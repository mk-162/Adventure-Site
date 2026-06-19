#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1

LOG_DIR="$ROOT/content/ops/overnight-logs"
mkdir -p "$LOG_DIR"
RUN_ID="overnight-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="$LOG_DIR/${RUN_ID}.log"

# Defaults: keep spend controlled while still making real progress overnight.
MODEL="${CONTENT_OPS_MODEL:-sonnet}"
CONCURRENCY="${CONTENT_OPS_CONCURRENCY:-3}"
BATCH_LIMIT="${CONTENT_OPS_BATCH_LIMIT:-9}"
MAX_CYCLES="${CONTENT_OPS_MAX_CYCLES:-20}"
STOP_HOUR_LOCAL="${CONTENT_OPS_STOP_HOUR_LOCAL:-7}"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$*" | tee -a "$LOG_FILE"
}

queue_count() {
  node - <<'NODE'
const fs = require('fs');
const path = 'content/ops/task-queue.json';
if (!fs.existsSync(path)) { console.log(0); process.exit(0); }
const q = JSON.parse(fs.readFileSync(path, 'utf8')).tasks || [];
console.log(q.filter(t => t.task_type === 'research' && t.status === 'research_needed').length);
NODE
}

status_counts() {
  node - <<'NODE'
const fs = require('fs');
const path = 'content/ops/task-queue.json';
if (!fs.existsSync(path)) process.exit(0);
const q = JSON.parse(fs.readFileSync(path, 'utf8')).tasks || [];
const counts = {};
for (const t of q) counts[`${t.task_type}:${t.status}`] = (counts[`${t.task_type}:${t.status}`] || 0) + 1;
console.log(JSON.stringify(counts));
NODE
}

log "Starting Adventure Wales overnight research loop"
log "Run ID: $RUN_ID"
log "Model=$MODEL concurrency=$CONCURRENCY batch_limit=$BATCH_LIMIT max_cycles=$MAX_CYCLES stop_hour_local=$STOP_HOUR_LOCAL"

cycle=1
while [ "$cycle" -le "$MAX_CYCLES" ]; do
  current_hour="$(date '+%H')"
  if [ "$current_hour" -ge "$STOP_HOUR_LOCAL" ] && [ "$STOP_HOUR_LOCAL" != "0" ]; then
    log "Stop hour reached ($current_hour >= $STOP_HOUR_LOCAL). Ending loop."
    break
  fi

  log "Cycle $cycle: refreshing audit, task queue, and briefs"
  if ! npm run content-ops:audit 2>&1 | tee -a "$LOG_FILE"; then
    log "Audit failed. Ending loop."
    exit 1
  fi
  if ! npm run content-ops:tasks 2>&1 | tee -a "$LOG_FILE"; then
    log "Task export failed. Ending loop."
    exit 1
  fi

  remaining="$(queue_count)"
  log "Research-needed tasks remaining in top queue: $remaining. Counts: $(status_counts)"
  if [ "$remaining" -eq 0 ]; then
    log "No research_needed tasks left in active queue. Ending loop."
    break
  fi

  log "Cycle $cycle: launching research swarm"
  if ! npm run content-ops:swarm -- --limit "$BATCH_LIMIT" --concurrency "$CONCURRENCY" --task-type research --status research_needed --model "$MODEL" 2>&1 | tee -a "$LOG_FILE"; then
    log "Swarm command failed. Ending loop."
    exit 1
  fi

  log "Cycle $cycle: regenerating report after swarm"
  npm run content-ops:audit 2>&1 | tee -a "$LOG_FILE" || exit 1
  npm run content-ops:report 2>&1 | tee -a "$LOG_FILE" || true

  cycle=$((cycle + 1))
  sleep 20
done

log "Running final verification"
npm run typecheck 2>&1 | tee -a "$LOG_FILE" || log "Typecheck failed — inspect log"
npm run content-ops:audit 2>&1 | tee -a "$LOG_FILE" || true
npm run content-ops:report 2>&1 | tee -a "$LOG_FILE" || true
log "Finished Adventure Wales overnight research loop"
log "Log file: $LOG_FILE"
