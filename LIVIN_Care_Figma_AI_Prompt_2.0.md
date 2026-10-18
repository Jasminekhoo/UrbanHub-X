# LIVIN Care --- Figma AI / Figma Make Prompt

## Interactive Hackathon Prototype \| Sime Darby Property --- People Track

Design and build a polished, clickable, responsive prototype for **LIVIN
Care**, an inclusive residential community safety and proactive-care
system for apartment and condominium residents in Malaysia.

## 1. Product vision and scope

LIVIN Care connects an **NFC Resident ID Card**, a **Resident App**, and
a **Property Management Dashboard** so residents can access security,
assistance, and facility-reporting services with minimal friction.

**Primary focus: residential property.** The residential experience must
be fully interactive and demonstrate the core safety-and-care storyline
from alarm trigger to management response and follow-up.

**Secondary focus: mall.** Include only a small, basic mall UI as an
additional concept screen or section. Do not build a full mall
experience and do not let it compete with the residential prototype.

This is a hackathon UI prototype, not a production system. Simulate NFC
scans, alerts, status changes, and notifications with clickable
interactions and realistic sample data. Do not claim that real NFC
hardware, emergency dispatch, medical monitoring, or integrations are
working.

## 2. User roles and role-based routing

Create a login screen with a role selector or clearly separated demo
login buttons: - **Resident / Family** - **Property Admin / Security**

After login, redirect users to different interfaces: - Resident / Family
→ Resident App - Property Admin / Security → Admin Dashboard

Provide a visible demo account / "Enter Demo" option for each role so
judges can test the prototype quickly without registering.

## 3. Main design direction

-   Product name: **LIVIN Care**
-   Tagline: **Care that responds. A community that includes everyone.**
-   Visual style: trustworthy, calm, modern residential technology;
    clean cards, clear hierarchy, friendly illustrations or simple
    icons.
-   Use a restrained palette: deep navy or blue for trust, teal/green
    for normal states, amber for warnings, and red only for urgent
    alarms.
-   Use large, high-contrast buttons and readable typography.
-   Accessibility is essential: simple language, clear labels, strong
    contrast, generous tap targets, icon + text (never colour alone),
    and a low-complexity help flow.
-   Responsive desktop and mobile layouts. Resident screens should look
    like a mobile app; admin screens should be desktop dashboard
    layouts.
-   Use realistic Malaysian apartment examples, Malaysian Ringgit only
    where needed, and fictional sample residents/units.
-   No points, leaderboards, or gamification in this MVP.

## 4. Required resident app screens

### A. Resident home

Show: - Greeting and resident profile (fictional name and unit number) -
NFC Resident ID Card status: Active / Temporarily blocked - Large quick
actions: **Request Help**, **Report an Issue**, **My NFC Card**,
**Family Care** - Latest notifications and request status - A clear "I
need help" action accessible from the main screen

### B. NFC Resident ID Card

Show a digital representation of the card and its status. Include
clickable demo actions: - **Simulate NFC Tap** - **Report Card Lost** -
**Freeze Card** - **Unfreeze / Request Replacement** (optional)

The card stores or represents a secure token/credential only. Do not
show an IC number, medical record, or sensitive personal data on the
card. Do not store health information on the NFC card.

When a suspicious or unrecognised card-use event is simulated, show an
alert: "Unusual card activity detected. Was this you?" Actions: - **Yes,
that was me** → mark as confirmed; close the alert. - **No, not me ---
Freeze Card** → change card status to Temporarily Blocked, create a
high-priority admin security case, and show a confirmation notification.

Do not imply that a card tap before a user's expected arrival time
proves theft. Present it as a configurable, explainable anomaly that
asks the resident to confirm.

### C. Request Help --- core care flow

This is the most important resident flow. Make it easy to complete in a
few taps, with large accessible controls.

Let the resident or authorised family member select: - **Who needs
help?** Elderly resident / Child / Person with disability (OKU) / Myself
/ Someone else - **Type of help:** Medical or urgent assistance / Safety
concern / Mobility or accessibility assistance / Escort home / Other -
**Location:** Home unit / Lobby / Lift / Car park / Common area /
Other - Optional short note; do not require a medical diagnosis.

Include a prominent **Trigger Demo Alert / Send Help Request** button.

After triggering: 1. Show a clear confirmation screen: "Help request
sent to property management." 2. Create a new case in the Admin
Dashboard immediately. 3. Send an in-app notification to the
resident/family view. 4. Show a case ID, submitted time, priority,
location, and current status. 5. Allow the resident to view progress:
**Received → Assigned → Assistance on the way → Resolved**. 6. When the
admin updates the status, reflect that change in the resident view and
add a notification.

For urgent requests, use an obvious urgent status and visual hierarchy,
but label the flow as a **prototype simulation**. Do not promise real
emergency response times.

### D. Family Care

Create a simple view for authorised family/guardians to see linked
dependants, such as: - Elderly parent - Child - Resident who needs
accessibility support

Show only minimal, consent-based information: - Name or display name -
Unit - Whether a help request is active - Latest relevant notification

Allow family/guardians to receive a notification when a linked dependant
triggers a help request. Include a small privacy note explaining that
access is permission-based and can be revoked.

Do not imply that the app continuously tracks a person's location or
health. Do not invent automatic fall detection or medical diagnosis.

### E. No-smartphone access / Home Console

Show an optional concept screen explaining that residents without
smartphones---especially some elderly residents, children, or OKU
residents---can use a **property-provided optional Home Console / help
point** or contact the management/security desk.

Create a clickable **Simulate Console SOS** button. When clicked: -
Trigger the same help-request flow as the app - Create a case in the
Admin Dashboard - Notify the authorised family/guardian view if linked -
Allow management to assign and update the case

Label the Home Console as **optional / future deployment**, not a
required device in every home. The MVP must not depend on expensive
in-home hardware.

### F. Report an Issue

Allow residents to report issues such as: - Lift out of service - Broken
lighting - Damaged ramp / accessibility barrier - Security concern -
Other facility issue

Include location, category, short description, and optional photo
placeholder. On submission, create a trackable case visible in the admin
dashboard and show a status timeline to the resident.

## 5. Required property admin / security dashboard

The admin interface must be a separate role-based experience and must be
interactive.

### A. Overview

Show summary cards: - Open urgent alerts - Help requests awaiting
assignment - Active assistance cases - Facility issues awaiting action

Show a recent activity feed and a small case-status chart or status
summary. Use fictional sample data and label it as demo data.

### B. Alerts and cases inbox

Create a filterable list/table with: - Case ID - Type: SOS / Security /
Accessibility / Facility - Resident display name and unit - Person
needing help: Elderly / Child / OKU / Other - Location - Priority -
Submitted time - Status

Clicking a case opens a detail panel/page with: - Request summary and
any resident-provided note - Acknowledge alert - Assign to Security /
Maintenance / Accessibility Support - Update status: Received, Assigned,
Assistance on the way, Resolved - Add a short internal action note -
Notify resident/family when status changes

The core workflow must be testable end-to-end: a resident's simulated
alert appears in the admin inbox; an admin acknowledges and assigns it;
the admin updates its status; the resident/family app reflects the
update.

### C. Resident support and accessibility

Provide a simple resident support list with only information needed for
service delivery, such as preferred assistance type or an authorised
emergency contact indicator. Avoid exposing unnecessary sensitive
details. Include a consent/permission indicator.

### D. NFC security management

Show a list of fictional card records with token-style card IDs, status,
and last event. Let an admin view a security case and mark it as
reviewed. Do not expose raw credentials or full personal identity
numbers.

### E. Sustainability / community impact

Include a small, simple impact section with prototype indicators such
as: - Number of issues reported and resolved - Number of digital reports
(paper reduction proxy) - Accessibility issues addressed - Assistance
requests completed

Label these as **illustrative prototype indicators**, not measured
real-world results. Do not invent carbon-saving figures.

## 6. Mandatory interactive demo storyline

Build the following storyline so it can be demonstrated live in under 2
minutes. Add a "Reset Demo" action if feasible.

### Storyline 1 --- Elderly resident without a smartphone (primary)

1.  Log in as **Property Admin / Security** in one browser tab or screen
    and open the Alerts & Cases inbox.
2.  In the resident experience, open **Home Console / Help Point** and
    click **Simulate Console SOS** for a fictional elderly resident in a
    condominium unit.
3.  Show an urgent alert created with a case ID, resident/unit,
    location, and "Elderly resident --- assistance requested."
4.  Switch to the Admin Dashboard: the new alert must appear in the
    inbox without manual data re-entry.
5.  Admin clicks **Acknowledge**, assigns **Security / Resident
    Support**, and changes the status to **Assistance on the way**.
6.  Return to the resident/family view: show the updated status and a
    notification that help is on the way.
7.  Admin marks the case **Resolved**; the resident/family view shows
    the completed timeline.

### Storyline 2 --- Child or OKU resident requests assistance

Provide quick demo presets for **Child needs help** and **OKU
accessibility assistance**. Clicking a preset should fill the form with
an appropriate fictional location and request type. Triggering it must
create a case in the same admin workflow and notify the authorised
guardian/family view.

### Storyline 3 --- Suspicious NFC card use

1.  On the resident app, click **Simulate NFC Tap** or **Simulate
    Unusual Card Activity**.
2.  Show "Was this you?" notification.
3.  Click **No, not me --- Freeze Card**.
4.  Update the card status to **Temporarily Blocked** and create a
    security case in the admin inbox.
5.  Admin reviews the case and marks the action taken.

The elderly / no-smartphone help storyline is the primary demonstration.
NFC suspicious-use is a secondary safety storyline.

## 7. Basic mall UI only

Add a small **Mall (Concept Preview)** section reachable from a simple
navigation link or property selector. Only create one or two basic
screens, such as: - Mall home with directory categories - A basic
**Request Assistance / Accessibility Help** card

The mall section may reuse the visual style and general help-request
concept, but should be mostly static. Do not build mall security
operations, tenant management, loyalty programmes, food ordering, or a
complete mall app. Keep all detailed interactions and the main demo
focused on residential property.

## 8. Privacy, safety, and realistic scope

-   Show a short privacy note: "Only share information needed to respond
    to your request. Family access requires permission."
-   NFC card stores/represents a secure token only; no IC number,
    medical records, or sensitive health data on the card.
-   Do not make health data collection mandatory. The core MVP works
    without wearables or health integrations.
-   Smartwatch, SOS pendant, and advanced sensor integrations are
    optional future extensions, not required MVP features.
-   Do not claim automatic emergency-service dispatch. The prototype
    alerts property management/security and authorised family contacts.
-   Clearly distinguish simulated prototype events from real alerts.
-   Include an option to cancel a request if it was triggered
    accidentally, while retaining a visible audit/status trail for
    admins.
-   Use fictional sample residents and non-sensitive data only.

## 9. Navigation and clickable prototype requirements

Use a persistent, simple navigation appropriate to each role.

**Resident App navigation:** Home · Request Help · NFC Card · Family
Care · My Requests · Profile

**Admin Dashboard navigation:** Overview · Alerts & Cases · Residents ·
NFC Security · Facility Reports · Impact

Make every primary button work. Use shared prototype state or connected
interactions where supported so that: - Triggering a resident/console
alert creates a corresponding admin case. - Admin status updates are
reflected in the resident/family case timeline and notification
centre. - Freezing a card updates the card status and creates a security
case. - Submitting a facility report creates a case visible to admins. -
Demo presets prefill forms and are usable without typing.

If true shared state across role views is not supported by the tool,
simulate the full flow using linked prototype screens and clearly
connected interactions. Prioritise a complete, reliable demo over a
large number of screens.

## 10. Final deliverable

Generate a cohesive, high-fidelity, clickable Figma prototype with: 1.
Role-based login and separate resident/admin destinations. 2. A fully
testable primary elderly/no-smartphone SOS storyline. 3. Child and OKU
assistance scenarios. 4. Admin acknowledge → assign → status update →
resident notification flow. 5. NFC unusual-use alert and card freeze
flow. 6. Facility issue reporting. 7. Optional Home Console concept. 8.
Basic mall concept preview only. 9. Privacy and illustrative
sustainability indicators.

Keep the prototype focused, feasible, and judge-friendly. The central
message should be immediately clear: **LIVIN Care helps a residential
community respond to residents who need support---including elderly
people, children, and OKU residents---without making smartphone
ownership a requirement.**
