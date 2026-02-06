# TASK: Fix Combo Page Images

**Status: QUEUED** (after location images)

## The Rule

**Combo images must show BOTH:**
1. The correct LOCATION (recognisable)
2. The correct ACTIVITY (people doing it)

## Combo Images (10 total)

| Combo | Location OK? | Activity OK? | Status |
|-------|--------------|--------------|--------|
| pembrokeshire-coasteering | ✅ Pembs coast | ✅ People coasteering | ✅ KEEP |
| snowdonia-hiking | ✅ Tryfan visible | ⚠️ No hikers visible | MARGINAL |
| snowdonia-mountain-biking | ⚠️ Generic forest | ❌ No MTB | ❌ REPLACE |
| gower-surfing | ✅ Rhossili Bay | ❌ No surfers | ❌ REPLACE |
| pembrokeshire-kayaking | ⏳ Needs check | ⏳ Needs check | AUDIT |
| pembrokeshire-surfing | ⏳ Needs check | ⏳ Needs check | AUDIT |
| snowdonia-climbing | ⏳ Needs check | ⏳ Needs check | AUDIT |
| snowdonia-gorge-walking | ⏳ Needs check | ⏳ Needs check | AUDIT |
| snowdonia-zip-lining | ⏳ Needs check | ⏳ Needs check | AUDIT |
| brecon-beacons-hiking | ⏳ Needs check | ⏳ Needs check | AUDIT |

## Workflow

### Step 1: Vision Audit
```
Is this {ACTIVITY} in {REGION}?
1. LOCATION: Is this recognisably {REGION}?
2. ACTIVITY: Are people doing {ACTIVITY}?

Answer: KEEP / REPLACE
```

### Step 2: Source Replacements

Combo images are hardest — need both location AND activity.

**Search strategy:**
- Flickr: `{activity} {region}` e.g. "surfing gower llangennith"
- Geograph: location grid ref + activity keyword
- Operator websites: they have action shots at specific locations

**Key grid refs:**
| Location | Grid |
|----------|------|
| Llangennith (Gower surf) | SS4292 |
| Coed y Brenin (Snowdonia MTB) | SH7227 |
| St Davids (Pembs coasteer) | SM7525 |
| Tryfan (Snowdonia climb) | SH6659 |

### Step 3: Both Checks Must Pass

Vision verify replacement:
```
1. Is this recognisably {REGION}? 
2. Does it show {ACTIVITY} happening?
Both must be YES.
```

## API Keys

- Geograph: `e8894773ec`
