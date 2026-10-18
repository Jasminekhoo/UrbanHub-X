# NIGHTSAFE LOOP --- Master Prompt for Figma AI / Figma Make

## High-Fidelity Clickable Prototype \| Sime Darby Property University Hackathon 2026

> **Purpose:** Build a polished, convincing, clickable prototype that
> demonstrates the complete NightSafe Loop concept through a carefully
> staged resident-to-security-to-property-management storyline. This is
> a prototype only. Use simulated data and simulated device behaviour.
> Do not imply that real streetlights, emergency dispatch, GPS tracking,
> fall detection, or property systems are connected.

------------------------------------------------------------------------

# 1. ROLE AND BUILD INSTRUCTIONS

Act as a senior product designer, UX architect, and frontend prototype
engineer. Design and implement **NightSafe Loop**, a township
night-walking safety and property-improvement decision-support platform.

Create a coherent, responsive, high-fidelity web prototype with: - A
**Resident App experience** (mobile-first, phone-sized frame). - A
**Security Operations Dashboard** (desktop). - A **Property Management
Intelligence Dashboard** (desktop). - A shared simulated data model so
the three experiences tell one consistent story. - Clickable controls,
realistic loading/confirmation states, functional filters, modals, tabs,
route selections, status updates, and demo reset controls. - A clear
**Demo Mode** label wherever data or device actions are simulated.

Prioritise an end-to-end storyline over implementing every possible
feature. The prototype must be easy to demo live in approximately 3--5
minutes without requiring external services, accounts, APIs, hardware,
or real personal data.

Do not stop at static mockup screens. Make the main buttons and
navigation work. If true backend functionality is unavailable, simulate
the outcome locally in the prototype and clearly label it as simulated.

## Product name

**NightSafe Loop**

## Tagline

**Better-lit journeys. Faster help. Smarter community improvements.**

## One-sentence value proposition

NightSafe Loop connects night-walking route conditions, discreet
emergency assistance, safety reporting, and budget-aware property
maintenance decisions in one explainable workflow.

## Hackathon context

-   Event: Sime Darby Property University Hackathon 2026.
-   Track: People.
-   Relevant themes: Safety & Security, Accessibility & Inclusion,
    Getting Around.
-   Team background: two Quantity Surveying students and two Computer
    Science students.
-   Prototype maturity: concept validation / hackathon prototype.
-   Use illustrative sample data. Do not represent the demo as a
    deployed or validated real-world service.

------------------------------------------------------------------------

# 2. PRODUCT POSITIONING AND DESIGN PRINCIPLES

NightSafe Loop is **not just a navigation app, an SOS button, or a smart
streetlight controller**. Its proposed differentiator is a connected
workflow:

1.  Residents compare night-time routes using available
    pedestrian-environment information.
2.  The prototype demonstrates how route-selected lighting could be
    activated where controllable smart lighting exists.
3.  Residents can initiate help discreetly or openly, and the security
    team can view a simulated alert and the last available
    location/checkpoint.
4.  Residents or inspectors can report environmental hazards.
5.  Property managers can verify reports, prioritise interventions
    transparently, compare feasible maintenance packages under a budget,
    and inspect modelled route-condition changes before and after
    interventions.

Design principles: - **Trust over false certainty:** never label a route
"100% safe" or predict crime. - **Explainability:** show why a route or
maintenance item is prioritised. - **Privacy by default:** show when
location tracking starts and ends; provide a visible "End journey"
action. - **Inclusive fallback:** do not require a smartwatch for core
SOS or Duress PIN features. - **Human response:** an alert does not
guarantee that security has received it or arrived. - **Evidence
quality:** show data source, timestamp, verification status, and
confidence. - **Realistic prototype boundaries:** simulate integrations
and identify them as future integration points. - **Low cognitive
load:** use clear labels, short explanations, large touch targets, and
accessible contrast.

Do not claim that the system reduces crime, prevents all falls,
guarantees emergency response, or produces verified energy savings. Any
modelled change is a prototype result, not proven real-world impact.

------------------------------------------------------------------------

# 3. VISUAL DESIGN SYSTEM

## Overall visual direction

Use a modern, credible property-tech / civic-tech visual style. The
product should feel appropriate for a major township developer: calm,
trustworthy, operationally clear, and polished---not like a gaming app
or a police surveillance tool.

## Colour palette

-   Deep navy: `#142B4A` --- primary navigation, headings, dashboard
    chrome.
-   Trust blue: `#2864A6` --- primary actions and links.
-   Night background: `#0D1726` --- night route map and resident journey
    mode only.
-   Warm light amber: `#F4B942` --- simulated active streetlights, route
    emphasis, warnings.
-   Teal: `#1F9D8B` --- completed / verified / resolved states.
-   Red: `#C83E4D` --- urgent emergency states only.
-   Background: `#F5F7FA`.
-   Surface: `#FFFFFF`.
-   Main text: `#172334`.
-   Secondary text: `#66758A`.
-   Borders: `#DCE3EB`.

Use colour with text and icons, never colour alone. Reserve red for
actual high-priority simulated alerts. Avoid overusing gradients,
glassmorphism, neon, or decorative charts.

## Typography and components

-   Use a clear sans-serif font such as Inter.
-   Strong information hierarchy with compact headings and readable body
    text.
-   Rounded cards (10--14 px), subtle borders, restrained shadows.
-   Consistent icon style (Lucide-like outline icons).
-   Buttons must have clear labels and visible hover/focus/pressed
    states.
-   Use responsive layouts: desktop dashboards at 1440 px wide, resident
    app at 390 × 844 px.
-   Include empty, loading, success, warning, and error states where
    useful.
-   Use accessible contrast and minimum 44 px touch targets on mobile.

## Map style

Create a **schematic township map**, not a real geolocation map. Show
roads, pedestrian paths, junctions, destinations, and numbered
lamp/checkpoint nodes. Use an unobtrusive grid or simplified
neighbourhood plan. Include a legend for: - Active simulated light. -
Inactive / normal light. - Lighting deficiency. - Sightline
obstruction. - Pathway defect. - Emergency location / last known
location.

Make it clear that map positions and lamp IDs are illustrative.

------------------------------------------------------------------------

# 4. USER ROLES AND ENTRY FLOW

Create a simple landing/login screen with two demo role choices: 1.
**Resident** 2. **Security / Property Management**

This is a hackathon prototype, so use role selection rather than real
authentication. Add a note: "Demo access --- no real account or personal
data."

After selecting a role: - Resident → Resident App home. - Security →
Security Operations Dashboard. - Property Management → Property
Intelligence Dashboard.

If only two role buttons can fit, provide "Security & Property
Management" as one entry and a role switcher inside that workspace.
Prefer three explicit demo role choices if feasible.

Persist the selected demo role during the prototype session. Add a
visible "Switch role" control so the presenter can move between user
experiences quickly without signing out or losing the demo scenario.

Provide a global **Reset Demo Scenario** action in a small menu. It
should reset all simulated alerts, statuses, route progress, and
management selections to the original sample state.

------------------------------------------------------------------------

# 5. SHARED SIMULATED DATA MODEL

Use the following coherent fictional scenario across all screens.

## Fictional location

**Sime Darby Property --- Sample Township (Demo Environment)**

Do not use real residents, phone numbers, home addresses, or live
locations.

## Resident demo profile

-   Display name: Aina (Demo Resident).
-   Journey: Community Residence → Central Transit Stop.
-   Journey time: approximately 8--10 minutes (illustrative).
-   Current state at the beginning: not on an active journey.
-   Emergency contact: "Demo Contact" (do not show a real number).

## Schematic routes

Create two route choices between the same origin and destination.

**Route A --- Main Avenue** - Approx. 9 minutes. - Better-lit main
pedestrian path. - One reported lighting fault near Junction L-04. -
Mostly continuous walkway. - Route cost: 31 (illustrative model index).

**Route B --- Garden Shortcut** - Approx. 7 minutes. - Shorter but
contains a lighting-deficiency segment, partial sightline obstruction,
and a pathway defect. - Route cost: 43 (illustrative model index).

Recommendation: Route A is the lower modelled environmental-cost route
despite being slightly longer. Explain that this reflects the available
demo data, not a guarantee of safety.

## Example hazards

Use at least these sample records: 1. `HZ-101` --- Lighting deficiency
at Junction L-04 --- Severity: High --- Pedestrian exposure: High ---
Evidence confidence: Medium --- Status: Reported. 2. `HZ-102` ---
Overgrown vegetation obstructing sightline near Garden Shortcut ---
Severity: Medium --- Pedestrian exposure: Medium --- Confidence: High
--- Status: Under verification. 3. `HZ-103` --- Uneven / damaged pathway
near Garden Shortcut --- Severity: High --- Pedestrian exposure: Medium
--- Confidence: Medium --- Status: Reported. 4. `HZ-104` --- Streetlight
flickering near Central Transit Stop --- Severity: Medium --- Pedestrian
exposure: High --- Confidence: Low --- Status: Needs verification.

Show the source and time for each record, e.g. "Resident report · 8:42
PM · Demo data." Do not imply these are actual SDP reports.

## Candidate maintenance interventions

Use illustrative cost estimates: - `IN-01`: Repair lamp L-04 --- RM
1,800 --- modelled route benefit: 12. - `IN-02`: Trim vegetation near
Garden Shortcut --- RM 900 --- modelled route benefit: 6. - `IN-03`:
Repair damaged pathway section --- RM 4,500 --- modelled route benefit:
15. - `IN-04`: Repair flickering lamp near Transit Stop --- RM 1,200 ---
modelled route benefit: 8. - `IN-05`: Add / improve lighting at a dark
path segment --- RM 3,000 --- modelled route benefit: 10.

Set the default illustrative maintenance budget to **RM 5,000**. Allow
the manager to edit it. Make it clear that all costs and benefits are
assumptions for the demo and require practitioner validation.

## Route model explanation

Display a short "How route comparison works" panel: - The prototype
considers normalised distance/time plus penalties for lighting
deficiency, sightline obstruction, and pathway discontinuity. - The
displayed "Route Cost" is a model index, not a crime probability or
measured safety score. - Lower modelled cost means fewer / smaller
environmental penalties under the chosen assumptions. - Data confidence
is shown separately.

## Hazard prioritisation explanation

Use an illustrative weighted score based on: - Severity. - Pedestrian
exposure / route importance. - Urgency. Keep evidence confidence
separate. Low-confidence hazards with potentially serious consequences
should appear in a verification queue instead of automatically being
ranked last.

## Budget optimisation

Allow the manager to change the budget and click **Optimise Maintenance
Plan**. Show a feasible selected intervention set with total estimated
cost ≤ budget, total modelled benefit, and a clear explanation of the
selection. A basic knapsack-style or precomputed simulated outcome is
acceptable, but the numbers must be internally consistent. Do not imply
additive benefits are guaranteed in real life; overlapping route
benefits may be double-counted in a simple prototype.

## Emergency demo data

When the Duress PIN storyline is triggered: - Alert ID: `AL-204`. -
Type: "Discreet Duress Alert". - Resident: "Aina (Demo Resident)". -
Last available location: "Near Lamp L-07, Garden Junction". - Last
checkpoint record: "L-07 · 9:14 PM". - Alert received: "9:15 PM". -
Status: "Awaiting security acknowledgement". - Lighting response:
"Simulated --- nearby route lights held at high brightness". - Location
freshness: "Last available demo location --- not live tracking".

The alert should not claim that a guard has arrived. The security user
must manually acknowledge it in the demo.

------------------------------------------------------------------------

# 6. REQUIRED SCREEN INVENTORY

Build the screens below. They should share the same visual system and
data.

## A. Shared entry screens

### Screen A1 --- Welcome / Role Selection

Elements: - NightSafe Loop logo / wordmark. - Tagline: "Better-lit
journeys. Faster help. Smarter community improvements." - Brief 3-pillar
summary: 1. Plan a better-informed night route. 2. Request help
discreetly or openly. 3. Improve community environments with evidence. -
Buttons: "Continue as Resident", "Continue as Security", "Continue as
Property Manager". - Badge: "Prototype Demo · Simulated Data". - Small
note: "No real emergency services or streetlights are connected."

Interactions: - Each role button navigates to the corresponding
home/dashboard. - "Reset Demo" resets the sample state.

## B. Resident App --- mobile-first

### Screen R1 --- Resident Home

Elements: - Greeting: "Good evening, Aina". - Demo status chip: "Demo
Township". - Main card: "Plan a night journey". - Destination input with
suggestion list; default destination: "Central Transit Stop". - Origin
selector: "Community Residence". - Primary CTA: "Compare Routes". -
Secondary quick actions: - "SOS" - "Discreet Help" - "Report a Hazard" -
A small status card for recent report / no active journey. - Bottom
navigation: Home, Night Path, Report, Safety.

Interactions: - "Compare Routes" opens route comparison. - "SOS" opens a
confirmation / hold-to-trigger simulation, not a real call. - "Discreet
Help" opens a safe explanation of Duress PIN and its simulated
activation. - "Report a Hazard" opens the report form. - Bottom
navigation switches screens.

### Screen R2 --- Night Path / Route Comparison

Elements: - Schematic route map with two alternatives. - Route A: "Main
Avenue", 9 min, route cost 31. - Route B: "Garden Shortcut", 7 min,
route cost 43. - Route A recommended because its current modelled
environmental cost is lower. - Visible reasons: - Better lighting
coverage in available demo data. - More continuous pedestrian path. -
Fewer / lower environmental penalties. - A route-condition legend. -
"How is this calculated?" expandable information panel. - A data
confidence / last updated label. - Buttons: "Choose Main Avenue",
"Choose Garden Shortcut". - Notice: "Route cost is an illustrative
environmental model index, not a guarantee of safety."

Interactions: - Selecting a route highlights it on the map and updates
the details panel. - Choosing a route opens a journey preview. - "How is
this calculated?" expands a short explanation. - Route selection drives
the simulated lighting corridor.

### Screen R3 --- Journey Preview / Smart Light Corridor

Elements: - Selected route and ETA. - Toggle / button: "Start Demo
Journey". - Map with lamp nodes L-01 to L-08. - A visual lighting
animation: lamps along the selected route light up in sequence ahead of
the resident; lamps behind may dim after a delay in the simulation. -
Status label: "Simulated smart-light response". - "Safety checkpoints"
list with expected nodes. - "Enable journey check-ins" toggle, on by
default for demo. - "End Journey" button. - "SOS" and "Discreet Help"
actions accessible without hunting through menus.

Interactions: - Clicking "Start Demo Journey" starts the journey,
changes status to "Journey in progress", and animates route lights. -
Mark one checkpoint as passed when "Simulate passing L-03" is clicked. -
Provide "Simulate missed checkpoint" as a clearly labelled demo-only
control. - "End Journey" stops simulated tracking and changes status to
"Journey ended". - If real lighting control is not available, all light
behaviour remains simulated. Never label the lights "connected".

### Screen R4 --- Safety Centre

Elements: - Three clear actions/cards: 1. "SOS --- I need help now" 2.
"Duress PIN --- I need discreet help" 3. "Journey Check-ins --- review
current status" - Short comparison of the actions: - SOS: open,
user-initiated request for help. - Duress PIN: discreet, user-initiated
request when overt help may be unsafe. - Missed checkpoint: a prompt to
confirm wellbeing, not proof of an emergency. - Status of current
journey and last successful checkpoint. - Privacy note: "Location is
only simulated in this prototype. A real product would need explicit
permission and clear start/stop controls."

Interactions: - Each card opens its dedicated flow. - Keep actions
accessible and clearly named.

### Screen R5 --- Duress PIN Setup

Elements: - Title: "Set up discreet help". - Explain that a Duress PIN
is a special PIN selected in advance to request discreet help when the
user cannot openly ask for assistance. - Demo-only numeric PIN fields
(use masked digits; do not store or expose real secrets). - Confirm PIN
field. - Toggle: "Enable demo Duress PIN". - Button: "Save demo
setting". - Clear warning: "This prototype simulates an alert only. It
does not contact real security services." - Include an optional "How it
works" accordion. - Do not make the user set a real security PIN in the
prototype.

Interactions: - Use a preconfigured demo-only trigger, such as a
"Simulate Duress PIN" button, so the presentation does not rely on
remembering a PIN. - After saving, show "Demo Duress PIN enabled". -
Never display the configured PIN in plain text after save.

### Screen R6 --- Duress PIN Activation / Discreet Help

This screen is critical. The experience should look calm and not
theatrically alarming.

Elements: - A minimal, neutral screen that could plausibly resemble a
normal app state. - Small unobtrusive status such as "Request received"
only if this does not expose the user's action. - A button / prototype
action: "Simulate Duress PIN". - Do not use flashing red screens, loud
alarms, or dramatic animations. - Do not display a large "YOU ARE IN
DANGER" message.

Prototype interaction: 1. Presenter clicks "Simulate Duress PIN". 2. The
resident UI returns to a neutral state / ordinary-looking screen. 3.
Shared simulated state creates alert `AL-204`. 4. Nearby schematic lamps
switch to "held bright --- simulated". 5. Security Dashboard shows a new
discreet alert. 6. The resident screen must not claim real help has
arrived.

Safety note for prototype documentation: a real implementation would
require careful safety testing, secure configuration, anti-misuse
safeguards, reliable alert delivery, and discreet but understandable
user feedback. Do not claim the feature is foolproof.

### Screen R7 --- SOS Activation

Elements: - Large, clear "Request Emergency Help" action. - Before
triggering, show a short confirmation or press-and-hold simulation to
reduce accidental triggers. - Choose a demo category: Personal Safety,
Medical, Other. - Display what would be shared: current / last available
location, selected category, timestamp. - Button: "Send demo SOS". -
After triggering, show a restrained confirmation: "Demo alert created
--- no real service contacted". - Link to "View alert status".

Interactions: - Clicking "Send demo SOS" creates a simulated security
alert with a distinct ID and category. - Security Dashboard receives the
new alert. - "Cancel" returns to Safety Centre without creating an
alert.

### Screen R8 --- Checkpoint / Missed Check-in

Elements: - Current journey progress. - Checkpoint list with timestamp
states: Upcoming, Passed, Missed / Awaiting confirmation. - "Simulate
passing checkpoint". - "Simulate missed checkpoint". - If missed: show a
calm confirmation prompt: "We haven't recorded your next checkpoint. Are
you okay?" - Actions: "I'm okay", "Need help", "No response (demo)". -
Explain that a missing checkpoint can occur due to GPS/network problems
and is not proof of danger.

Interactions: - "I'm okay" resolves the prompt. - "Need help" opens SOS
choices. - "No response (demo)" creates a simulated follow-up alert on
the Security Dashboard. - Display last available checkpoint and
timestamp.

### Screen R9 --- Hazard Report Form

Elements: - Hazard type selector: - Lighting deficiency / faulty
streetlight. - Obstructed sightline. - Damaged / discontinuous
pedestrian path. - Other. - Location selector using schematic nodes /
areas, not a real map. - Severity selector: Low / Medium / High. -
Description field. - Optional "Attach demo photo" placeholder. - Submit
button. - Note: "Demo reports are simulated and do not create real
maintenance work orders."

Interactions: - Validation for required fields. - Submit creates a
simulated report ID, e.g. `HZ-105`. - Show success state with report ID,
submitted time, and status "Reported --- awaiting verification". - The
report becomes visible in the property dashboard. - Avoid collecting
name, IC number, phone number, home address, or other unnecessary
personal information.

### Screen R10 --- My Reports / Journey History

Elements: - List of submitted demo reports with status chips. - Journey
history with start/end times and last checkpoint. - Report detail view:
source, timestamp, verification status, assigned / unassigned, latest
update. - "End journey / stop sharing" control if a journey is active.

Interactions: - Filter reports by status. - Clicking a report opens
details. - Changing a report status in the management dashboard should
update the resident's view if possible in the shared prototype state.

### Screen R11 --- Accessibility and Settings

Elements: - Text-size setting. - High-contrast toggle. - Reduced-motion
toggle. - Notification preference examples. - Location permission
explanation with "Only during active demo journey" selection. - Clear
way to end a journey and stop simulated tracking. - Emergency feature
explanations. - Do not promise full accessibility compliance; make the
prototype visibly considerate of accessibility needs.

------------------------------------------------------------------------

# 7. SECURITY OPERATIONS DASHBOARD --- DESKTOP

Use a desktop layout with: - Left navigation sidebar. - Top bar with
"Security Operations · Demo Environment". - Main content area. - A
persistent "SIMULATED DATA" label. - Responsive layout and readable
tables.

## Screen S1 --- Security Overview

Top summary cards: - Active alerts. - Awaiting acknowledgement. - In
progress. - Resolved today (demo).

Main panels: - Alert queue. - Schematic township map with alert pins and
lamp/checkpoint IDs. - Recent events timeline. - Status legend.

Seed the dashboard with one low-noise initial state. The Duress alert
should appear only after the presenter triggers it in the Resident App
storyline.

Interactions: - Click an alert to open the detail panel. - Filter by
alert type and status. - Sort newest first / highest priority. - Click
"Switch role" to return to role selection.

## Screen S2 --- Alert Detail: Discreet Duress Alert

This is a key demo screen.

When `AL-204` is created, display: - Alert type: "Discreet Duress
Alert". - Resident: "Aina (Demo Resident)". - Last available location:
"Near Lamp L-07, Garden Junction". - Last checkpoint: "L-07 · 9:14
PM". - Alert created: "9:15 PM". - Location freshness: "Last available
demo location --- not live tracking". - Status: "Awaiting security
acknowledgement". - Lighting: "Simulated --- nearby route lights held at
high brightness".

Buttons: - "Acknowledge Alert". - "Mark Response In Progress". - "Add
Incident Note". - "Resolve Demo Alert" (require a confirmation modal). -
"View Map Location".

Interactions: - Acknowledge changes status to "Acknowledged". - In
progress changes status to "Response in progress". - Add note opens a
small modal and saves a demo note. - Resolve asks for confirmation and
changes status to "Resolved --- demo". - These changes should be
reflected in the alert queue. - Do not invent an arrival time or claim a
real guard was dispatched.

## Screen S3 --- Checkpoint Events

Elements: - Table of checkpoint events with timestamp, checkpoint ID,
event type, status, and data source. - Filters for Passed / Missed /
Awaiting confirmation. - Select a missed checkpoint to inspect last
available location. - A "Simulate no response" action for the
presenter. - Clear note that a missed check-in is a prompt for review,
not proof of emergency.

## Screen S4 --- Incident History

Elements: - List of simulated alerts and their status transitions. -
Filter by date, type, and status. - Detail drawer showing alert
timeline. - No personal sensitive data beyond the fictional demo
resident.

------------------------------------------------------------------------

# 8. PROPERTY MANAGEMENT INTELLIGENCE DASHBOARD --- DESKTOP

This workspace demonstrates the main decision-support differentiator.
Use a professional operations interface with a left sidebar: -
Overview - Hazard Map - Reports & Verification - Priority Ranking -
Budget Optimisation - Route Impact - Settings / Assumptions

## Screen M1 --- Management Overview

Summary cards: - Open hazards. - High-priority items. - Awaiting
verification. - Illustrative budget remaining. - Modelled route cost
change (label as "model index", not safety improvement).

Main panels: - Schematic hazard map. - Priority queue. - Recent resident
reports. - Budget overview. - "Continue demo storyline" button.

Do not use invented claims such as "crime reduced by 30%" or "safety
improved by 50%".

## Screen M2 --- Hazard Map

Elements: - Schematic township map with hazard pins. - Legend for
lighting, sightline, pathway. - Filter by category, severity,
verification status, and date. - Clicking a pin opens a detail panel. -
Each hazard detail shows: - ID. - Category. - Description. - Severity. -
Pedestrian exposure / route importance. - Evidence confidence. -
Source. - Timestamp. - Verification status. - Current action / owner
(use demo labels). - Buttons: "Mark Under Verification", "Verify
Report", "Mark Duplicate", "Mark Resolved". - Any status change should
update the report list and priority queue.

## Screen M3 --- Reports & Verification

Elements: - Table of hazards and resident submissions. - Search and
filters. - Duplicate-report grouping. - Low-confidence but potentially
serious items in a visible "Needs verification" queue. - Report detail
drawer. - "Verify", "Mark Duplicate", "Request Site Inspection"
(simulated), and "Close Report" actions.

Do not automatically suppress a high-severity item only because evidence
confidence is low.

## Screen M4 --- Explainable Priority Ranking

Show a ranked list of interventions / hazards and a side panel "Why this
rank?"

Use a provisional illustrative priority model based on: - Severity. -
Pedestrian exposure / route importance. - Urgency.

Keep evidence confidence as a separate field. Explain that weights are
configurable assumptions and have not been validated with SDP.

Each row should show: - Priority rank. - Hazard / intervention. -
Severity. - Exposure. - Urgency. - Evidence confidence. - Estimated cost
(where available). - Reason for ranking. - Status.

Provide a "Model assumptions" accordion with placeholder weights that
add up to 100%. Include a sensitivity / weight-adjustment interaction if
feasible. If weights are adjusted, update the displayed score or clearly
label the ranking as a preset demo result.

## Screen M5 --- Budget Optimisation

This is one of the highest-priority management screens.

Elements: - Budget input defaulting to RM 5,000. - Candidate
intervention list with checkboxes / selectable rows. - Estimated cost
and modelled benefit for each. - Button: "Optimise Maintenance Plan". -
Output: - Recommended feasible package. - Total estimated cost. - Budget
remaining. - Total modelled benefit. - Interventions selected. -
Excluded interventions and a concise reason (e.g. budget constraint or
lower modelled benefit under current assumptions). - Alternative package
comparison if feasible. - Small explanation: "Illustrative budget model.
Benefits are assumptions; overlapping route effects may be
double-counted."

The prototype must prevent the selected package total from exceeding the
entered budget. If full optimisation logic is not possible, use a small
precomputed set of consistent outcomes and label them as simulated.

Default intervention catalogue: - Repair lamp L-04 --- RM 1,800 ---
benefit 12. - Trim vegetation near Garden Shortcut --- RM 900 ---
benefit 6. - Repair damaged pathway --- RM 4,500 --- benefit 15. -
Repair flickering lamp near Transit Stop --- RM 1,200 --- benefit 8. -
Improve lighting at dark segment --- RM 3,000 --- benefit 10.

For the default RM 5,000 budget, show a plausible combination that does
not exceed the budget. Keep costs and totals mathematically consistent.

## Screen M6 --- Route Impact / Before and After

Elements: - Route A and Route B comparison. - Before and after
model-cost values. - Segment-level breakdown of distance/time, lighting
penalty, sightline penalty, pathway penalty. - Highlight which selected
intervention changes which segment. - Explain that the result is a
modelled route-condition change, not a measured reduction in crime,
incidents, or personal risk. - Button: "Apply Selected Plan to
Simulation". - After click, update the schematic map and route-cost
model for the demo.

Use `ΔC = C_before − C_after` as the modelled change. A positive result
means the modelled route cost decreased under the current assumptions.
Do not call it a "percentage increase in safety".

## Screen M7 --- Lighting Status / Corridor Simulation

Elements: - Schematic lamp list: L-01 to L-08. - Lamp state: Normal,
Simulated Active, Fault Reported, Held Bright (Emergency Demo). -
Current selected resident route. - "Preview light corridor" action. -
"Reset lighting simulation" action. - Legend and simulation disclaimer.

This is a visual demonstration only. Do not suggest that a real
controller, sensor, or electrical system is connected.

## Screen M8 --- Model Assumptions and Data Quality

Elements: - Route model factors. - Priority model factors. - Data
confidence definitions. - Source and timestamp handling. - Illustrative
cost assumptions. - Limitations. - A visible note that SDP's existing
systems and workflows must be validated before claiming an operational
gap or uniqueness.

------------------------------------------------------------------------

# 9. THE CRITICAL END-TO-END DEMO STORYLINE

Build the prototype specifically so the presenter can run this sequence
smoothly. The screens must be connected, and the same simulated state
should appear consistently across resident, security, and management
views.

## Storyline title

**"From a Night Journey to a Measurable Community Improvement"**

## Scene 0 --- Set up the problem (10--15 seconds)

Presenter starts on the welcome screen.

Suggested narration: "NightSafe Loop connects three things that are
often shown separately in a safety concept: the resident's night
journey, the ability to request help, and the property team's decisions
about which environmental issues to fix first. This is a simulated
prototype, not a live security system."

Action: - Select "Continue as Resident".

## Scene 1 --- Compare routes (25--35 seconds)

Resident home: - Enter / select "Central Transit Stop". - Click "Compare
Routes".

Route comparison: - Route A Main Avenue: 9 minutes, route cost 31. -
Route B Garden Shortcut: 7 minutes, route cost 43. - The shorter route
is not automatically recommended because the demo data indicates more
environmental penalties. - Show the reasons: lighting deficiency,
obstructed sightline, and pathway defect.

Suggested narration: "NightSafe Loop does not claim to predict crime. It
compares the environmental information currently available and explains
why one route is preferred. The score is a model index, and the user can
still choose another route."

Action: - Choose Route A. - Click "Start Demo Journey".

## Scene 2 --- Show the smart-light concept (15--20 seconds)

Journey Preview: - Animate lamps L-01, L-02, L-03 and other nodes along
the selected route. - Show the light corridor extending ahead of the
resident. - Mark checkpoint L-03 as passed. - Show "Simulated
smart-light response" at all times.

Suggested narration: "If the township has compatible, controllable smart
lighting, a future integration could illuminate the selected corridor
ahead of the resident and maintain lighting when help is requested. In
this prototype, we simulate the behaviour; no real lights are
connected."

Action: - Click "Simulate passing L-03". - Return to Safety Centre or
click "Discreet Help".

## Scene 3 --- Trigger Duress PIN discreetly (20--30 seconds)

Duress flow: - Use the preconfigured "Simulate Duress PIN" button. -
Keep the resident screen visually neutral. - Do not show an alarming
public confirmation. - Shared demo state creates alert `AL-204`. -
Nearby lamp nodes switch to "Held Bright --- Simulated".

Suggested narration: "If a resident cannot safely make an obvious call
for help, a preconfigured Duress PIN could trigger a discreet alert. The
resident interface stays neutral in this demo. The alert is simulated,
and a real deployment would need reliable delivery, careful safety
testing, and a trained response process."

Action: - Click "Simulate Duress PIN". - Switch role to Security.

## Scene 4 --- Security receives the alert (25--35 seconds)

Security Overview: - New alert `AL-204` appears at the top of the
queue. - Open the alert.

Alert detail shows: - Discreet Duress Alert. - Aina (Demo Resident). -
Near Lamp L-07, Garden Junction. - Last checkpoint L-07 · 9:14 PM. -
Alert created 9:15 PM. - "Last available demo location --- not live
tracking". - "Awaiting security acknowledgement". - "Nearby route lights
held at high brightness --- simulated".

Action: - Click "Acknowledge Alert". - Click "Mark Response In
Progress". - Do not click "Resolved" unless the presenter wants to
demonstrate closure.

Suggested narration: "The security team receives the alert in a
dedicated queue with the last available location and checkpoint
timestamp. This is not proof that a person has arrived or that dispatch
has succeeded; the prototype shows how the alert could be managed and
audited."

## Scene 5 --- Report an environmental hazard (15--25 seconds)

Switch role to Resident. - Open "Report a Hazard". - Select "Lighting
deficiency / faulty streetlight". - Location: Junction L-04. - Severity:
High. - Description: "Lamp is not providing consistent illumination." -
Submit report. - Show a new simulated ID, such as `HZ-105`.

Suggested narration: "Beyond responding to emergencies, residents can
report environmental conditions that may make routes less comfortable or
accessible. Each report retains a source, timestamp, and verification
state."

Action: - Switch role to Property Manager.

## Scene 6 --- Verify and prioritise (25--35 seconds)

Management dashboard: - Open Hazard Map or Reports & Verification. -
Find `HZ-105`. - Mark "Under Verification" or "Verified" to demonstrate
status handling. - Open Priority Ranking. - Show why lighting and
pathway issues are ranked using severity, pedestrian exposure, and
urgency. - Show confidence separately.

Suggested narration: "The management side converts reports into a
transparent queue. Confidence is displayed separately, so a serious but
uncertain report is sent for verification rather than automatically
being dismissed."

## Scene 7 --- Optimise the maintenance budget (35--45 seconds)

Open Budget Optimisation. - Show RM 5,000 default budget. - Click
"Optimise Maintenance Plan". - Display the recommended feasible
combination. - Show total cost, budget remaining, selected items, and
modelled benefit. - Ensure total cost does not exceed RM 5,000. - Select
"Apply Selected Plan to Simulation".

Suggested narration: "Instead of only showing a list of complaints,
NightSafe Loop helps the property team compare feasible maintenance
packages under a limited budget. These costs and benefits are
illustrative and would need to be checked against actual maintenance
data."

## Scene 8 --- Compare before and after (20--30 seconds)

Open Route Impact. - Show Route A / Route B before and after model-cost
values. - Highlight which intervention affects which route segment. -
Explain the changed route-cost index. - Never describe this as a proven
percentage reduction in crime or an actual measured safety improvement.

Suggested narration: "Finally, the team can see which route segments are
expected to improve under the model if selected interventions are
carried out. This closes the loop from a resident's observation to a
budget decision and a transparent estimate of route-condition change."

## Closing line (5--10 seconds)

Suggested narration: "NightSafe Loop connects better-informed night
journeys with discreet assistance and evidence-based property
improvements. Our prototype demonstrates the workflow with simulated
data; the next step is validating the assumptions, operational fit, and
integration feasibility with the property team."

------------------------------------------------------------------------

# 10. ALTERNATE SHORT DEMO FLOW (IF TIME IS LIMITED)

If the live presentation is limited to 2 minutes, do not try to
demonstrate every screen. Use this priority order:

1.  Route comparison (show the 9-minute lower-cost route versus the
    7-minute route with more environmental penalties).
2.  Start journey and animate smart-light corridor.
3.  Trigger Duress PIN.
4.  Switch to Security Dashboard and acknowledge `AL-204`.
5.  Switch to Property Management and run Budget Optimisation.
6.  Show Before-and-After Route Impact.

Do not spend presentation time on login, settings, full CRUD operations,
or every possible form field. Use preloaded data and visible demo labels
to keep the story smooth.

------------------------------------------------------------------------

# 11. FUNCTIONAL PROTOTYPE REQUIREMENTS

Implement the following interactions where possible: - Role selection
and role switching. - Resident bottom navigation. - Route selection with
map highlighting. - Start / end journey. - Simulated lamp state
changes. - Simulated checkpoint passage and missed-checkpoint prompt. -
Duress PIN activation creates a shared simulated alert. - SOS activation
creates a separate simulated alert. - Security alert acknowledgement /
in-progress / resolved status. - Resident hazard report submission
creates a report visible to management. - Management verification /
duplicate / resolved actions update report status. - Budget input
changes the feasible plan. - "Optimise Maintenance Plan" generates a
budget-feasible result. - "Apply Selected Plan to Simulation" updates
route-impact display. - Reset Demo restores the original state. - All
forms validate required inputs and show useful feedback. - All
navigation controls have a working destination.

Use a shared in-memory state if supported. If the prototype tool cannot
share state across workspaces, simulate transitions with preconfigured
linked screens while keeping labels and data consistent.

Avoid dead-end buttons. If a feature is outside the prototype scope,
show a clear "Not connected in this prototype" message rather than
pretending it works.

------------------------------------------------------------------------

# 12. PROTOTYPE SAFETY, PRIVACY, AND CLAIMS

Show these constraints through the interface and prototype content: - No
real emergency services are contacted. - No real streetlights are
controlled. - All routes, lamp IDs, reports, timestamps, and costs are
simulated. - A missing checkpoint is not proof of an emergency. - A last
known location may be stale or unavailable. - Duress PIN does not
guarantee discreet delivery or rescue. - Phone-based fall detection is
not reliable in every circumstance; smartwatch support is optional and
future-facing. - Do not collect unnecessary personal information. - Show
journey tracking status and provide an end / stop-sharing control. - Do
not show live tracking unless a journey is active in the simulation. -
Do not make absolute safety claims or use crime-probability
percentages. - Use "modelled route cost", "environmental condition
index", "illustrative benefit", and "simulated alert". - Do not claim
compatibility with any specific SDP application, streetlight vendor,
emergency centre, or maintenance platform. - Do not assume SDP lacks
current safety programmes or maintenance workflows; the prototype
proposes a workflow to validate.

------------------------------------------------------------------------

# 13. CONTENT AND MICROCOPY

Use concise, natural English for the UI. Add short Chinese labels only
if the layout can support them without crowding. Keep all critical demo
buttons in English so the presenter can follow the script.

Preferred phrases: - "Demo Mode --- Simulated Data" - "Modelled Route
Cost" - "Last Available Location" - "Discreet Duress Alert" - "Awaiting
Security Acknowledgement" - "Simulated Smart-Light Response" - "Awaiting
Verification" - "Illustrative Maintenance Budget" - "Modelled
Route-Condition Change" - "End Journey" - "Stop Sharing" - "No real
emergency services or streetlights are connected"

Avoid: - "Guaranteed Safe" - "Crime Risk: 0%" - "Emergency team
dispatched" unless explicitly labelled as a simulation state and not an
actual dispatch - "Safety improved by X%" - "AI detected a criminal" -
"The user has definitely fallen" - "All residents are tracked at all
times"

------------------------------------------------------------------------

# 14. ACCEPTANCE CHECKLIST

Before finishing, verify that the prototype meets these criteria:

## Visual quality

-   [ ] Consistent typography, spacing, colour, and component styles.
-   [ ] Resident experience is mobile-first.
-   [ ] Security and management dashboards are readable on desktop.
-   [ ] Maps are clearly schematic and include a legend.
-   [ ] Critical actions have obvious visual hierarchy.
-   [ ] Accessible contrast and clear focus / hover states.

## Storyline

-   [ ] The presenter can start as a resident and compare two routes.
-   [ ] Route A is recommended for a clearly explained reason.
-   [ ] Starting a journey visibly animates the simulated light
    corridor.
-   [ ] Duress PIN creates a discreet simulated alert.
-   [ ] Security can acknowledge and update that alert.
-   [ ] A resident hazard report appears in the management workflow.
-   [ ] Management can verify / prioritise hazards.
-   [ ] Budget optimisation returns a plan within the selected budget.
-   [ ] Before-and-after route analysis shows a modelled change.
-   [ ] The prototype can be reset for another demo run.

## Trustworthiness

-   [ ] Every simulated integration is clearly labelled.
-   [ ] No unsupported claim of actual safety, crime reduction, energy
    savings, or dispatch success.
-   [ ] Evidence confidence is separate from hazard severity / priority.
-   [ ] Missing check-in is not treated as proof of an emergency.
-   [ ] Location privacy and end-journey controls are visible.
-   [ ] No real personal information is used.

## Functional completeness

-   [ ] No major button is dead.
-   [ ] Forms show validation and success feedback.
-   [ ] Role switching works.
-   [ ] Shared simulated state is consistent across the three roles.
-   [ ] Reset Demo restores the original state.

------------------------------------------------------------------------

# 15. FINAL BUILD PRIORITY

If the tool or time limit cannot support everything, prioritise in this
exact order:

**Priority 1 --- End-to-end story:** Route comparison → simulated
lighting → Duress PIN → Security alert acknowledgement → management
hazard prioritisation → budget optimisation → before/after route impact.

**Priority 2 --- Working interactions:** Role switching, route
selection, alert status, report submission, budget input, reset demo.

**Priority 3 --- Supporting features:** SOS, missed checkpoint, optional
fall-detection simulation, report history, accessibility settings.

**Priority 4 --- Future integration illustrations:** Real smart-light
control, real GPS / checkpoint integration, real security dispatch,
smartwatch integration.

Do not sacrifice a coherent, reliable storyline to create many
disconnected screens. The final prototype should make the concept easy
to understand, show a complete loop from resident experience to property
action, and honestly communicate that it is a simulated hackathon
prototype.
