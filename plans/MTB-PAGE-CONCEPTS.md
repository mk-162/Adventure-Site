# MTB Mega Page Concepts for Adventure Wales

> **Mission:** Create the world's best mountain biking landing page that makes riders say "holy shit, this is exactly what I needed."

---

## 🔬 Research Findings

### What the Best Outdoor/Adventure Sites Do Right

**Trailforks** (Industry Standard for MTB)
- Crowdsourced trail database with real-time condition reports
- Difficulty ratings, elevation profiles, GPS navigation
- Trail direction indicators (shows which way trails are ridden most)
- Weather integration at trail-system level
- User ride logs showing how people actually connect trails
- Badges and achievements for exploration

**Strava** (Gamification King)
- Segments with leaderboards (KOM/QOM crowns)
- Heatmaps showing where riders actually go
- Personal bests with gold/silver/bronze medals
- Social proof through kudos and activity feeds
- Local Legends for repeated segment completion
- Filter by age group, gender, following

**Komoot** (Best UI/UX)
- Clean, beautiful interface
- Turn-by-turn voice navigation
- AI route planning that understands trail preferences
- Highlights system showing points of interest
- Community-curated collections

**AllTrails** (Discovery Focus)
- User reviews with specific condition reports
- Photo galleries from recent visits
- "Wildflower" and "pub walk" filters
- Trail conditions with weather forecasts
- Accessibility information

**Red Bull** (Emotion & Immersion)
- Video-first content design
- Athlete-centered storytelling
- VR experiences (Matterhorn climbing, skydiving)
- Immersive POV content
- Event coverage that builds anticipation

**Mapbox** (Technical Innovation)
- 3D terrain with realistic rendering
- Globe view with atmosphere effects
- 85° camera pitch for dramatic angles
- Custom styling for brand identity
- Smooth camera animations along routes

### What MTB Riders Actually Want (Reddit Research)

1. **Trail Conditions** - Is it rideable RIGHT NOW? (Wet/dry, mud levels)
2. **Difficulty Beyond Colors** - Flow vs Technical distinction, mandatory features
3. **Trailhead Navigation** - How do I actually GET there?
4. **Trail Connections** - How do I string trails into a full ride?
5. **Local Knowledge** - What do people who ride here regularly know?
6. **Shuttle/Uplift Info** - How many runs can I get? Costs?
7. **Bike Shop/Amenities** - Where can I fix a flat? Get food?
8. **Group Skill Planning** - Can mixed-ability groups ride together?

### Key Innovation Opportunities

- **MudWatch** uses AI to predict trail conditions beyond weather
- **Epic Ride Weather** provides route-specific forecasts
- **Scrollytelling** creates emotional journeys through content
- **WebGL 3D** enables flythrough experiences in-browser
- **Strava Heatmaps** show authentic riding patterns

---

## 🚀 5 Radically Different Concepts

---

### Concept 1: "TRAIL COMMAND"
**The Mission Control Center for Welsh MTB**

#### Core Idea
Turn trail planning from a chore into a dopamine hit. A real-time dashboard that answers every question before you ask it: What's rideable NOW? What's the weather doing? Where are other riders going TODAY?

#### Hero Experience
Full-screen interactive map of Wales with live pulsing dots showing trail conditions:
- 🟢 Green glow = Perfect conditions, go ride!
- 🟡 Amber pulse = Some issues, check details
- 🔴 Red fade = Closed/unrideable

Animated weather front moving across the map showing the next 6 hours. A "Best Trails Right Now" ticker scrolling recommended trails based on current conditions.

#### Key Interactive Elements
- **Condition Radar:** Click any trail center for instant status (crowd-sourced + AI predicted)
- **Weather Timeline:** Scrub through next 48 hours to find your weather window
- **Trail Matchmaker:** Input skill level, hours available, what you want (flow/tech/views) → Get a route
- **Live Rider Count:** See estimated riders at each location (from Strava integration)
- **Parking Status:** Green/amber/red for car park capacity on busy days

#### Content Structure
```
[Live Dashboard Header]
    ├── Regional Condition Overview
    ├── Weather Radar Mini-Map
    └── "Riding Right Now" counter

[Main Interactive Map]
    ├── Trail Center Clusters
    ├── Click-to-expand Details
    └── Route Builder Overlay

[Smart Recommendations]
    ├── "Perfect for Today"
    ├── "This Weekend's Best"
    └── "Hidden Gems" (lesser-known trails)

[Quick Actions]
    ├── Book Uplift
    ├── Rent a Bike
    └── Find Accommodation
```

#### Unique Features
- **AI Mud Prediction:** Goes beyond weather to predict actual trail surface
- **Crowd Forecasting:** "BikePark Wales will be busy at 10am, try arriving at 8am"
- **Weather Windows:** "Rain stops at 2pm, Cwmcarn dries fastest—rideable by 3pm"
- **Carpool Connect:** Find other riders heading same direction

#### Why Riders Would Love It
No more guessing. No more driving 2 hours to find soup. It's the confidence of LOCAL KNOWLEDGE without having to be a local.

#### Technical Feasibility
✅ **Highly Buildable**
- Mapbox GL JS for interactive map
- Weather API integration (Open-Meteo, Met Office)
- Trailforks API for condition data
- Strava heatmap API for activity data
- Standard web stack (React/Next.js)

---

### Concept 2: "THE DESCENT"
**Immersive Video-First Experience**

#### Core Idea
Stop showing boring text about trails. Let riders FEEL Wales through full-screen, autoplay POV videos from every trail center. Red Bull meets Netflix for mountain biking.

#### Hero Experience
Cinematic 30-second POV video autoplays on landing—screaming down Antur Stiniog's black run. As you scroll, the video fades into a 3D map flyover that traces the trail you just watched. Sound design: crunching gravel, heavy breathing, birds, wind.

The scroll becomes the throttle—stop scrolling, video pauses. Resume scrolling, keep descending.

#### Key Interactive Elements
- **Trail Video Selector:** 360° carousel of GoPro clips from each trail center
- **Speed Scrubber:** Drag to any point in the trail, see that section's stats
- **Feature Callouts:** Pop-up labels during video ("Rock Garden - Grade 4", "Gap Jump - 8ft")
- **"I Want This" Button:** One-click saves trail to your planning list
- **Split-Screen Comparisons:** Play two trails side-by-side to compare

#### Content Structure
```
[Full-Screen Video Hero]
    └── Trail name + difficulty badge overlay

[Scroll-Triggered Sections]
    ├── Video 1: The Descent (POV)
    ├── 3D Terrain Flyover (same trail)
    ├── Trail Profile with Feature Markers
    ├── Video 2: The Climb Back Up
    └── Rider Testimonials (video snippets)

[Trail Center Grid]
    ├── Hover to preview (video loop)
    ├── Click for full experience
    └── Filter by vibe (Flow/Tech/Scenic)

[Closing CTA]
    └── "Plan Your Ride" or "Book Uplift"
```

#### Unique Features
- **Trail DNA Video:** Every trail has a signature 15-second video that captures its essence
- **Seasonal Cuts:** Same trail in summer dust vs autumn leaves vs winter mud
- **Night Riding Previews:** For trails with night riding options
- **Drone Transitions:** Aerial establishing shots between POV sections
- **Sound Profiles:** Each trail center has distinct audio identity

#### Why Riders Would Love It
Text can't sell flow. Words can't convey steepness. Video creates DESIRE. Riders will watch, feel their heart rate rise, and NEED to ride that trail.

#### Technical Feasibility
✅ **Buildable with Investment**
- Video hosting (Cloudflare Stream, Mux)
- Scroll-triggered playback (GSAP, ScrollMagic)
- 3D terrain (Mapbox terrain, Three.js)
- Significant video production investment required
- Good mobile optimization needed for video performance

---

### Concept 3: "RIDE BUILDER"
**Your Personal MTB Trip Architect**

#### Core Idea
A step-by-step wizard that builds your perfect Welsh MTB trip. Answer 5 questions, get a complete itinerary: trails, accommodation, food, bike shops, even Spotify playlists for the drive.

#### Hero Experience
Giant question mark morphs into a bike wheel as you scroll. First screen:

> "Let's build your perfect Welsh MTB adventure"
> 
> ⏱️ Takes 90 seconds
> 🎯 Get a complete trip plan
> 📱 Save and share anywhere

Big, satisfying "Let's Go" button.

#### Key Interactive Elements
- **Step 1 - Who's Coming?**
  - Rider count slider
  - Skill level mix (beginner/intermediate/advanced)
  - Any e-bikers?

- **Step 2 - What's Your Vibe?**
  - Flow lover vs Tech seeker vs Scenic cruiser
  - Jump enthusiast?
  - View chaser?

- **Step 3 - How Long?**
  - Day trip / Weekend / Week
  - Dates (enables weather integration)

- **Step 4 - What Matters?**
  - Drag-rank priorities: Trails / Accommodation / Food / Nightlife / Family-friendly

- **Step 5 - Budget?**
  - Budget / Mid-range / Treat ourselves

#### Content Structure
```
[Wizard Flow]
    ├── Progress bar (5 steps)
    ├── Big, tappable options (not forms)
    ├── Instant visual feedback
    └── "Skip" option on non-essential questions

[Generated Itinerary]
    ├── Day-by-day breakdown
    ├── Morning trail → Lunch spot → Afternoon ride
    ├── Evening: Where to eat, stay, drink
    └── Practical: Bike shops, hospitals, phone signal spots

[Map View]
    └── Interactive route connecting all points

[Export Options]
    ├── PDF download
    ├── Email to self/group
    ├── Share link
    └── Add to calendar
```

#### Unique Features
- **Group Compromise Engine:** Finds trails where beginners and experts can both have fun
- **Weather-Smart:** If your dates have rain forecast, suggests indoor alternatives
- **Budget Tracker:** Running total as you build the trip
- **Local Gems:** Includes under-the-radar spots locals love
- **WhatsApp/Discord Share:** One-click share formatted trip to group chat

#### Why Riders Would Love It
Planning an MTB trip is overwhelming—Trailforks for trails, Google for accommodation, TripAdvisor for food. This does ALL of it in 90 seconds. It's the concierge you always wanted.

#### Technical Feasibility
✅ **Very Buildable**
- Multi-step form wizard (TypeForm-style UX)
- Content database for accommodations, restaurants, trails
- Simple recommendation algorithm
- PDF generation (React-PDF, Puppeteer)
- Standard web stack

---

### Concept 4: "LEADERBOARD WALES"
**Gamified Trail Collection System**

#### Core Idea
Turn Welsh MTB into a game. Collect trails like Pokémon. Climb leaderboards. Earn badges. Compete with friends. Make "riding all of Wales" a life goal people actually track.

#### Hero Experience
A massive progress bar showing YOUR completion of Welsh MTB:

> **You've ridden 23% of Welsh MTB trails**
> 
> 12/52 trail centers visited
> 47/312 trails conquered
> 
> [View Your Map]

Below: Animated 3D topographic map of Wales with your completed trails glowing gold, unridden trails in grey.

#### Key Interactive Elements
- **Trail Collection Map:** Click to see what you've done, what's left
- **Badge Gallery:** Achievement system for milestones:
  - "North Wales Dominator" - All Eryri trails ✓
  - "Vertical Vampire" - 50,000m lifetime elevation
  - "Dawn Patrol" - Ride before 7am
  - "All-Weather Warrior" - Ride in rain, shine, and snow
- **Leaderboards:**
  - Most trails ridden in Wales (all-time)
  - Monthly movers
  - Fastest on local segments
  - Most diverse (different trail centers)
- **Challenges:**
  - "The Welsh Grand Slam" - All 5 major bike parks in one year
  - "Coast to Coast" - Ride trails from Pembroke to Eryri
  - Seasonal events with exclusive badges

#### Content Structure
```
[Personal Dashboard]
    ├── Progress ring/bar
    ├── Recent rides
    ├── Badges earned
    └── "Next Recommended" trail

[Wales Conquest Map]
    ├── 3D terrain with fog-of-war on unvisited areas
    ├── Gold trails = completed
    ├── Silver trails = partially ridden
    └── Grey trails = undiscovered

[Social Leaderboards]
    ├── Friends
    ├── Regional
    ├── All Wales
    └── This Month

[Trail Cards]
    └── Collectible-style cards for each trail (shareable)
```

#### Unique Features
- **Strava Sync:** Automatically detects which Welsh trails you've ridden
- **Physical Rewards:** Collect enough trails, earn Adventure Wales merch
- **Annual Reset Challenges:** Fresh leaderboards each year
- **Trail Trading Cards:** Shareable graphics for each trail you complete
- **Group Challenges:** Create custom challenges for your riding crew

#### Why Riders Would Love It
Riders are ALREADY chasing trails. They just don't have a system. This turns the natural "I want to ride everything" urge into a trackable, shareable, COMPETITIVE game. FOMO will drive return visits.

#### Technical Feasibility
✅ **Buildable with Strava Integration**
- Strava API for ride detection
- User accounts and progress tracking
- PostgreSQL for leaderboard data
- SVG badge system
- Social sharing APIs
- Real-time leaderboard updates (WebSockets/Supabase)

---

### Concept 5: "LOCAL VOICES"
**The Human-First Trail Guide**

#### Core Idea
Ditch the corporate tourism speak. Let REAL Welsh riders tell you about THEIR trails. Video testimonials, local tips, honest opinions. It's the pub chat about trails, but online.

#### Hero Experience
Grid of faces—real riders, diverse ages, different bikes. Headline:

> "Meet your guides to Welsh MTB"

Click any face → Full-screen video intro: "I'm Dai, I've been riding Cwmcarn for 15 years. Let me show you the lines no one talks about."

#### Key Interactive Elements
- **Local Guide Profiles:** Each trail center has 2-3 local ambassadors
  - Their bike setup
  - Their favorite trail & why
  - Their "secret" recommendation
  - Video walk-through of a hidden feature
- **Q&A Sections:** Real questions from visitors, answered by locals
  - "Is the black run at Antur Stiniog actually that hard?"
  - "Where do locals eat after BikePark Wales?"
- **"Ask a Local" Chat:** Submit questions, get video responses
- **Trail Stories:** Short narratives about trail history, memorable crashes, wildlife encounters
- **Weather Wisdom:** "When it rains, here's what dries first..."

#### Content Structure
```
[Guide Gallery Hero]
    └── Grid of local faces, hover for trail specialty

[Featured Guide Video]
    ├── 60-second intro
    ├── "My trail, my rules" tour
    └── Contact/social links

[Trail-Specific Sections]
    ├── Official info (length, grade, facilities)
    ├── Local perspective video
    ├── Community tips feed
    └── Recent visitor stories

[Community Q&A]
    ├── Browse by category
    ├── Upvote helpful answers
    └── Submit your own question

[Local Recommendations]
    └── "Where to ___ near [trail center]" guides
```

#### Unique Features
- **Authenticity Score:** No scripted content, genuine reactions
- **Multi-Lingual:** Some guides speak Welsh, subtitles provided
- **Seasonal Updates:** Locals record new videos each season
- **The Real Rating:** Locals rate trails honestly (not marketing-speak)
- **"I Saw This Coming" Stories:** Funny/scary near-miss stories that teach

#### Why Riders Would Love It
Tourism websites are BORING. They say everything is "stunning" and "world-class." Riders want to hear "actually, skip that one unless you're mental" and "the third rock on the left is deceptively slippery." HONESTY sells.

#### Technical Feasibility
✅ **Very Buildable, Content-Intensive**
- Video hosting and streaming
- User-generated content moderation
- Comment/Q&A system
- CMS for managing guide profiles
- The hard part is CREATING the authentic content

---

## 🏆 Recommendation

### For Maximum Impact: Combine Elements

**Phase 1 (Launch):**
- "Trail Command" interactive map as the hero
- Weather-aware trail conditions
- Basic trip planning tools

**Phase 2 (Engagement):**
- Add "Leaderboard Wales" gamification
- Strava integration for progress tracking
- Challenge system

**Phase 3 (Differentiation):**
- "Local Voices" video content
- POV trail videos ("The Descent" elements)
- Community Q&A

### The Killer Combo
Imagine landing on the page:

1. **See instantly** what's rideable today (Trail Command)
2. **Feel the trails** through immersive video (The Descent)
3. **Build your trip** in 90 seconds (Ride Builder)
4. **Track your progress** against all of Wales (Leaderboard)
5. **Get real advice** from people who live it (Local Voices)

That's not a landing page. That's a **destination**.

---

## 📝 Technical Stack Recommendation

```
Frontend:       Next.js 14 + React
Styling:        Tailwind CSS
Maps:           Mapbox GL JS (3D terrain, custom styling)
Video:          Cloudflare Stream or Mux
Animation:      GSAP + Framer Motion
Backend:        Supabase (auth, database, real-time)
CMS:            Sanity or Contentful (for trail/guide content)
Integrations:   Strava API, Weather API, Booking APIs
Hosting:        Vercel (Edge functions for performance)
```

---

## 🎯 Success Metrics to Track

- Time on page (target: 3+ minutes vs industry 45 seconds)
- Trail detail click-through rate
- Trip builder completions
- Strava connections (for gamification)
- Booking/conversion actions
- Social shares
- Return visits

---

*Created for Adventure Wales — Because Welsh MTB deserves better than a boring webpage.*
