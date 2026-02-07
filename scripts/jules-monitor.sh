#!/bin/bash
# Jules Queue Monitor - Launches pending tasks when slots are available

JULES_KEY="AQ.Ab8RN6JB-DQFy_ehQOsK6GTpSPFIg11JwgUOga2oQsfP8zD2PQ"
SOURCE="sources/github/mk-162/Adventure-Site"
QUEUE_FILE="/home/minigeek/Adventure-Site/jules-queue.json"
LOG_FILE="/home/minigeek/Adventure-Site/jules-monitor.log"
MAX_SESSIONS=15

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_FILE"
}

# Get current in-progress session count
get_active_count() {
  curl -s 'https://jules.googleapis.com/v1alpha/sessions?pageSize=30' \
    -H "X-Goog-Api-Key: $JULES_KEY" | jq '[.sessions[] | select(.state == "IN_PROGRESS")] | length'
}

# Get next pending task from queue
get_next_task() {
  jq -r '.pending[0] // empty' "$QUEUE_FILE"
}

# Remove first task from pending
pop_task() {
  local title="$1"
  jq --arg t "$title" '.pending = (.pending | .[1:]) | .completed += [$t]' "$QUEUE_FILE" > "$QUEUE_FILE.tmp" && mv "$QUEUE_FILE.tmp" "$QUEUE_FILE"
}

# Launch a task
launch_task() {
  local title="$1"
  local prompt="$2"
  
  result=$(curl -s 'https://jules.googleapis.com/v1alpha/sessions' \
    -X POST \
    -H "Content-Type: application/json" \
    -H "X-Goog-Api-Key: $JULES_KEY" \
    -d "{
      \"prompt\": \"$prompt\",
      \"sourceContext\": {
        \"source\": \"$SOURCE\",
        \"githubRepoContext\": {\"startingBranch\": \"main\"}
      },
      \"automationMode\": \"AUTO_CREATE_PR\",
      \"title\": \"$title\"
    }" 2>/dev/null)
  
  session_id=$(echo "$result" | jq -r '.name // empty')
  error=$(echo "$result" | jq -r '.error.message // empty')
  
  if [ -n "$session_id" ]; then
    log "✅ Launched: $title -> $session_id"
    pop_task "$title"
    return 0
  else
    log "❌ Failed: $title -> $error"
    return 1
  fi
}

# Check for completed sessions and merge PRs
check_completed() {
  completed=$(curl -s 'https://jules.googleapis.com/v1alpha/sessions?pageSize=30' \
    -H "X-Goog-Api-Key: $JULES_KEY" | jq -r '.sessions[] | select(.state == "COMPLETED") | select(.outputs[].pullRequest.url) | .outputs[].pullRequest.url' 2>/dev/null)
  
  if [ -n "$completed" ]; then
    log "📝 Completed PRs found: $(echo "$completed" | wc -l)"
  fi
}

# Main loop
main() {
  log "--- Monitor run started ---"
  
  active=$(get_active_count)
  log "Active sessions: $active / $MAX_SESSIONS"
  
  # Check for completed work
  check_completed
  
  # Calculate available slots
  available=$((MAX_SESSIONS - active))
  
  if [ "$available" -le 0 ]; then
    log "No slots available, waiting..."
    exit 0
  fi
  
  log "Available slots: $available"
  
  # Launch tasks for available slots
  launched=0
  while [ "$launched" -lt "$available" ]; do
    task=$(get_next_task)
    
    if [ -z "$task" ]; then
      log "No more pending tasks"
      break
    fi
    
    title=$(echo "$task" | jq -r '.title')
    prompt=$(echo "$task" | jq -r '.prompt')
    
    if launch_task "$title" "$prompt"; then
      launched=$((launched + 1))
      sleep 2
    else
      break
    fi
  done
  
  log "Launched $launched tasks this run"
  log "--- Monitor run complete ---"
}

main
