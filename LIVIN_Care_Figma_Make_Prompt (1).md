# LIVIN Care — Figma Make Prompt File
## Role-Based Resident & Admin Prototype | Hackathon MVP

You are a senior UI/UX designer and frontend prototyping specialist. Build a polished, responsive, interactive prototype for **LIVIN Care**, an inclusive community safety and proactive-care platform for apartment and condominium communities.

The prototype is for a Sime Darby Property Hackathon. The key principle is:

**“Better care for people, with less unnecessary resource consumption.”**

The goal is not to build every possible feature. Prioritise a small number of complete, reliable demo storylines. The most important requirement is that **Admin and User have different interfaces immediately after login, with role-based redirection**.

---

## 1. Non-negotiable role-based login

Create a shared login page with a clear, working demo login experience.

### Demo accounts
Use these fictional demo accounts:

- **Resident/User**
  - Email: `resident@livincare.demo`
  - Password: `Resident123!`
  - Role: `user`
  - After successful login, redirect to `/resident/home`.

- **Admin**
  - Email: `admin@livincare.demo`
  - Password: `Admin123!`
  - Role: `admin`
  - After successful login, redirect to `/admin/dashboard`.

Provide visible “Try Resident Demo” and “Try Admin Demo” buttons so judges can enter either experience quickly. These buttons must actually set the corresponding role and navigate to the correct interface.

For this prototype, simulated authentication is acceptable. Do not claim it is production authentication.

### Role routing rules
- The login page is the entry point.
- After login, the resident and admin must see clearly different layouts, navigation and available actions.
- A `user` must never be redirected to the admin dashboard.
- An `admin` must never be redirected to the resident home.
- Keep the active role in shared application state.
- Provide a logout button in both interfaces. Logging out must clear the active session and return to the login page.
- If a user attempts to open a route belonging to the other role, redirect them to their own home page.
- Refreshing or navigating within the prototype should not unexpectedly switch roles during the active demo session, where the tool supports session state.
- Show a role label in each interface, such as “Resident Portal” or “Admin Console”.

Use a simple, clear login design. Do not spend time building registration, password reset, OTP, or real authentication integrations.

---

## 2. Product and design direction

LIVIN Care connects condominium residents with property management and security personnel. It supports safety requests, inclusive assistance, service tracking and more sustainable community operations.

Design style:
- Premium, calm, modern condominium service platform.
- Primary navy: `#214B74`
- Blue accent: `#2F6FA5`
- Background: `#F5F5F7`
- White cards, subtle borders, rounded corners and generous whitespace.
- Use a modern sans-serif font such as Inter.
- Use accessible contrast, clear labels and readable status text.
- Use red only for genuinely urgent alerts.
- Desktop-oriented admin interface and responsive mobile-friendly resident interface.

Use consistent buttons, forms, status badges, request cards, confirmation dialogs and toast messages.

---

## 3. Keep the MVP small

Build only these working areas:

### Resident/User
1. Home.
2. Emergency assistance.
3. General/accessibility assistance request.
4. My requests and status tracking.
5. Digital resident card with simulated lost-card reporting.
6. Profile/privacy information only if time permits.

### Admin
1. Operations dashboard.
2. Request and emergency alert list.
3. Request details, assignment and status updates.
4. Simple sustainability indicators using clearly labelled demo data.

Do not build smartwatch integration, fall detection, health monitoring, home terminals, reward points, payment processing, real NFC access control, real notifications or real emergency dispatch. These are outside the hackathon MVP.

Do not require real hardware, external APIs, or a production backend.

---

## 4. User interface after login

### A. Resident Home — `/resident/home`

Use a mobile-friendly layout with bottom navigation:
- Home
- My Requests
- Resident Card
- Profile (optional)

Display:
- Greeting: “Good evening, Alex”
- Property: “Aster Residence”
- Unit: “Tower B · Unit 12-08”
- Digital resident card preview
- Primary button: **Request Emergency Help**
- Secondary button: **Request Assistance**
- Button/link: **Report Lost Card**
- Recent requests with current statuses
- A short community notice
- A discreet sustainability message such as “Digital-first services, using existing community infrastructure.”

The resident should understand the next action immediately.

### B. Emergency Assistance — `/resident/emergency`

Include:
- Medical Assistance
- Immediate Safety Concern
- Mobility Assistance
- Other Urgent Help
- Optional short description
- Pre-filled sample residence/unit
- **Send Emergency Alert** button
- Confirmation dialog before submission

After confirmation:
- Create a request with a unique ID, e.g. `LC-1001`.
- Set category and priority to urgent.
- Set status to `Submitted` or `Awaiting Acknowledgement`.
- Show a clear success/confirmation screen and request ID.
- Explain: “Demo only — this prototype does not contact real emergency services.”

The newly created alert must appear in the Admin interface using the same request record.

### C. General / Accessibility Assistance — `/resident/assistance`

Include:
- Accessibility Support
- Mobility Assistance
- Shared Facilities
- Community or Property Issue
- Other Assistance

Include optional description and an optional preferred contact method:
- Phone call
- In-person assistance
- Text
- No preference

After submission:
- Create a request with a unique ID, e.g. `LC-1002`.
- Set status to `Submitted`.
- Show the request ID and confirmation.
- Make the same request visible in the Admin interface.

Collect only information needed to handle the request.

### D. My Requests — `/resident/requests`

Show a list of the current resident’s demo requests:
- Request ID
- Category
- Date/time
- Priority
- Status
- “View details” action

Supported statuses:
- Submitted
- Acknowledged
- Assigned
- In Progress
- Resolved
- Closed

When Admin updates a request status, the Resident’s view must show the updated status and activity history. Use the same shared application state/data source for both roles; do not create separate unsynchronised copies.

### E. Digital Resident Card — `/resident/card`

Display a visual NFC card with fictional resident information and a status:
- Active
- Reported Lost

Include:
- **Simulate NFC Tap** — show a simulated success message only.
- **Report Lost Card** — ask for confirmation, then update the card status to “Reported Lost” and create a corresponding admin-visible security item if practical.

Do not claim that real access control has been disabled. Clearly state that the NFC interaction is simulated.

---

## 5. Admin interface — separate from the Resident interface

The Admin must land on `/admin/dashboard` immediately after logging in. Use a desktop-first layout with a left sidebar.

Admin sidebar:
- Overview
- Requests & Alerts
- Sustainability
- Logout

Show a visible role indicator: **Admin Console**.

### A. Admin Dashboard — `/admin/dashboard`

Include:
- Heading: “Community Operations”
- Property: “Aster Residence”
- Summary cards:
  - Open Requests
  - Urgent Alerts
  - In Progress
  - Resolved Today
- An urgent alerts section
- Recent requests table/list
- Status and priority badges
- “View Request” action

Use clearly labelled fictional demo data. Statistics should update when the demo requests change where practical.

### B. Requests & Alerts — `/admin/requests`

Display a request table/list with:
- Request ID
- Category
- Priority
- Resident/unit
- Submitted time
- Assigned staff
- Status
- View action

Provide basic filters for status and priority if practical.

Opening a request should show a detail panel/page with:
- Request information
- Relevant unit information
- Current status
- Assigned staff member
- Activity history
- Assignment control
- Status update control
- Internal note or resolution summary field if practical

Admin actions:
- Acknowledge an urgent alert.
- Assign a responder, using fictional sample staff names.
- Update status to `Assigned`, `In Progress`, or `Resolved`.
- Record a resolution note if practical.

When Admin changes a request:
1. Update the shared request record.
2. Update the Admin list/dashboard.
3. Update the Resident’s My Requests view.
4. Add an activity-history entry.

This cross-role synchronisation is a core requirement of the demo.

### C. Sustainability — `/admin/sustainability`

Show a compact set of cards:
- Digital service requests
- Alternative assistance channels available
- Existing infrastructure reused
- Proposed paper requests avoided

Every number must be labelled **Demo Data**, **Illustrative Estimate**, or **Proposed KPI**. Do not claim that these are measured real-world outcomes or guaranteed savings.

Add a short note: “Actual impact should be validated through a community pilot.”

---

## 6. Core demo storylines — make these work first

The following three storylines are more important than adding more screens or decorative details.

### Storyline 1: Emergency alert from Resident to Admin (highest priority)

1. Open login.
2. Click “Try Resident Demo”.
3. Confirm the app redirects to Resident Home, not Admin Dashboard.
4. Click “Request Emergency Help”.
5. Select “Medical Assistance”.
6. Submit and confirm the request.
7. Show a request ID and “Awaiting Acknowledgement”.
8. Log out.
9. Log in as Admin using “Try Admin Demo”.
10. Confirm the app redirects to Admin Dashboard.
11. Find the same emergency request in Urgent Alerts.
12. Open it and click “Acknowledge Alert”.
13. Assign a security responder.
14. Update the status to “In Progress”.
15. Log out and return to Resident Demo.
16. Open My Requests and confirm the same request shows the updated status.

**Acceptance criteria:** The same request ID and status are used across both roles. Do not simulate this workflow with unrelated hardcoded screens.

### Storyline 2: Accessibility request

1. Log in as Resident.
2. Open Request Assistance.
3. Select “Accessibility Support”.
4. Select “Prefer in-person assistance”.
5. Submit the request.
6. Log in as Admin.
7. Find the same request.
8. Assign a staff member.
9. Change its status to “In Progress” and then “Resolved”.
10. Return to Resident and verify the updated status.

**Acceptance criteria:** Request creation, assignment and status updates work end-to-end.

### Storyline 3: Lost NFC card

1. Log in as Resident.
2. Open Resident Card.
3. Click “Report Lost Card”.
4. Confirm the action.
5. Show the card as “Reported Lost”.
6. Log in as Admin.
7. Show a corresponding security item or card-status alert if practical.

**Acceptance criteria:** Card status visibly changes, and the prototype clearly states that actual physical access control is not connected.

---

## 7. Shared data and implementation rules

Use shared in-memory state or a lightweight local mock data store supported by the environment.

Suggested data shapes:

**Resident**
- id
- name
- property
- unit
- cardStatus

**Request**
- id
- category
- description
- priority
- residentName
- unit
- createdAt
- status
- assignedTo
- preferredContact
- activityHistory

**Activity history**
- action
- actorRole
- timestamp
- note

Seed the prototype with a few fictional requests so the dashboard does not look empty. Newly created requests must appear alongside the seed records.

Do not use real personal information.

If persistence across a full browser refresh is unavailable, keep the demo reliable within the current session and provide a **Reset Demo Data** action only if needed.

Do not introduce an actual backend just to support this prototype. Do not pretend that a backend, real notifications, or building access integration exists.

---

## 8. Privacy, inclusion and sustainability

Show these principles in the actual UI:
- Use fictional resident data.
- Collect only necessary request information.
- Do not collect continuous health or location data.
- Do not require smartwatches, home terminals or extra sensors.
- Provide non-app alternatives such as security-counter or staff-assisted requests.
- Limit sensitive request information to authorised staff.
- Clearly label all simulated actions.
- Make accessibility and preferred-contact fields optional.
- Present sustainability values as proposed or illustrative until measured in a real pilot.

The MVP should reuse existing management and security workflows wherever possible. Do not design a mandatory smart terminal for every residential unit.

---

## 9. Final quality checklist

Before considering the prototype complete, verify all of the following:

- [ ] Login page offers Resident and Admin demo entry.
- [ ] Resident login redirects to `/resident/home`.
- [ ] Admin login redirects to `/admin/dashboard`.
- [ ] The two roles have clearly different layouts and navigation.
- [ ] Logout returns to login and clears the active role.
- [ ] Cross-role routes do not expose the other role’s interface.
- [ ] Resident can submit an emergency alert.
- [ ] The alert appears in Admin’s urgent alerts.
- [ ] Admin can acknowledge, assign and update the alert.
- [ ] The Resident sees the same request’s updated status.
- [ ] Resident can submit an accessibility request.
- [ ] Admin can resolve that request.
- [ ] Resident can report a lost card.
- [ ] Sustainability values are labelled as demo/illustrative/proposed.
- [ ] Simulated features are not presented as real integrations.
- [ ] The interface is visually consistent and suitable for a live hackathon demo.

## Final instruction

**Prioritise working role-based login, cross-role request synchronisation and the emergency-response storyline above all other features.** If time is limited, simplify the visual details and optional pages rather than leaving the main demo flows broken.

Product tagline: **“LIVIN Care — Better care for people, with less unnecessary resource consumption.”**
