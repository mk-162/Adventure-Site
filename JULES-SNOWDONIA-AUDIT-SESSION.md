# JULES-SNOWDONIA-AUDIT-SESSION.md

Session tracking for Snowdonia / Eryri content completeness audit.

## Session 1
- Session ID: `14604538365688445448`
- Status: `Completed`
- URL: `https://jules.google.com/session/14604538365688445448`
- Brief quality: Too high-level
- Outcome: Useful directional findings, but Jules used the wrong CSV schema and did not have concrete file targets.
- Action: Do not apply directly. Use as reference only.

## Session 2
- Session ID: `11321011470620508728`
- Status: `In progress`
- URL: `https://jules.google.com/session/11321011470620508728`
- Brief: `plans/jules-snowdonia-audit-brief-v2.md`
- Goal: Audit exact Snowdonia region/activity files and append rows to `content/inventory/coverage-findings.csv` using the existing schema.

## Pull commands
```bash
cd /home/minigeek/projects/Adventure-Site-audit
jules remote list --session | grep Snowdonia
jules remote pull --session <ID>
jules remote pull --session <ID> --apply
```

## Notes
- Use Session 1 for hints only.
- Session 2 is the clean audit run we should trust.
- Review changes before any apply.
