# TASK: Fix Location/Region Images

**Status: QUEUED** (after activity images)

## The Rule

**Location images MUST be of that exact location.**

No generic Welsh landscapes. Must be recognisable as that specific place.

## Quick Audit Results

| Region | Status | Notes |
|--------|--------|-------|
| anglesey | ✅ Correct | View to Snowdonia from Anglesey coast |
| brecon-beacons | ✅ Correct | Pen y Fan ridge |
| carmarthenshire | ⏳ Needs check | |
| gower | ✅ Correct | Three Cliffs Bay |
| llyn-peninsula | ⏳ Needs check | |
| mid-wales | ✅ Likely correct | Victorian bridge, wooded valley |
| north-wales | ⏳ Needs check | |
| pembrokeshire | ✅ Correct | Barafundle Bay |
| snowdonia | ❌ WRONG | PNW conifer forest, NOT Snowdonia |
| south-wales | ⏳ Needs check | |
| wye-valley | ❌ WRONG | New Zealand alpine lake! |

## Priority Fixes

1. **snowdonia-hero.jpg** — Currently Pacific Northwest forest. Need: Snowdon, Tryfan, Crib Goch, or similar
2. **wye-valley-hero.jpg** — Currently New Zealand lake! Need: River Wye, Tintern Abbey, Symonds Yat

## Workflow

### Step 1: Vision Audit Each Image
```
Is this {REGION}, Wales? 
Look for [specific landmarks for that region].
Answer: CORRECT / WRONG
If wrong, describe what it actually shows.
```

### Step 2: Source Replacements

**For location images, prioritise:**
1. **Geograph** — geotagged to exact location
2. **Wikimedia Commons** — search by landmark name
3. **Flickr CC** — search by landmark name

**Search terms per region:**
| Region | Search Terms |
|--------|--------------|
| Snowdonia | `snowdon summit`, `tryfan`, `crib goch`, `llyn ogwen` |
| Wye Valley | `tintern abbey`, `symonds yat`, `river wye monmouth` |
| Pembrokeshire | `barafundle bay`, `st davids`, `tenby harbour` |
| Gower | `rhossili bay`, `worms head`, `three cliffs bay` |
| Brecon Beacons | `pen y fan`, `corn du`, `brecon beacons` |
| Anglesey | `south stack lighthouse`, `beaumaris castle`, `menai strait` |

### Step 3: Verify Replacement Shows THE Location

Vision check must confirm the image shows a recognisable landmark from that specific region.

### Step 4: Download, Log, Commit

Same as activity images workflow.

## API Keys

- Geograph: `e8894773ec`
