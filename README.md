# LIVIN Care 2.0 — Hackathon MVP Prototype

> **Sime Darby Property Hackathon — People Track**  
> *“Care that responds. A community that includes everyone.”*

This repository is updated based on [**`LIVIN_Care_Figma_AI_Prompt_2.0.md`**](file:///c:/Users/user/Downloads/LIVIN/LIVIN_Care_Figma_AI_Prompt_2.0.md) and preserves the exhibition-grade editorial poster from [**`gemini-code-1792220856470.md`**](file:///c:/Users/user/Downloads/LIVIN/gemini-code-1792220856470.md).

---

## 🌟 Core Message
**LIVIN Care helps a residential community respond to residents who need support—including elderly people, children, and OKU residents—without making smartphone ownership a requirement.**

---

## 🚀 Development Server

The Vite server is currently running:
- 🌐 **Local Web App:** [http://localhost:3000/](http://localhost:3000/)

To run manually:
```bash
npm run dev
```

---

## 🔑 Demo Accounts & Quick Switchers

On the login page (`/login`), judges have **one-click demo entry buttons**:

| Role | Email | Password | Destination |
| :--- | :--- | :--- | :--- |
| **Resident / Family** | `resident@livincare.demo` | `Resident123!` | `/resident/home` (Resident & Family App) |
| **Property Admin / Security** | `admin@livincare.demo` | `Admin123!` | `/admin/dashboard` (Admin Dashboard) |

Judges can also use the **top header quick switchers** (`Switch to Resident App` / `Switch to Admin Console`) at any time.

---

## 🧪 Interactive Demo Storylines (Under 2 Minutes)

### Storyline 1: Elderly resident without a smartphone (Primary Demo)
1. In the top bar or Resident Home, click **“Home Console SOS”** (or **“Test Console SOS”**).
2. The hardware-simulated **Home Console / Help Point** appears with a large red **“SOS HELP”** push button.
3. Click **“SOS HELP”** to simulate an elderly parent (*Robert Chen, Unit 12-08*) pressing the physical bedside/wall console without a smartphone.
4. An urgent SOS case is created in real-time (`LC-1002`) and logged to the Guardhouse console.
5. In the top bar, click **“Switch to Admin Console”** (or open in another window).
6. In **Overview** / **Alerts & Cases**, find the urgent alert from Robert Chen (Home Console).
7. Click **“Acknowledge Alert”**, assign **“Nurse Sarah (Community First Aid)”**, and advance the status to **“Assistance on the way”**.
8. Return to the Resident/Family view: notice the live notification and timeline advancing to *“Assistance on the way”*.
9. In Admin Console, mark the case as **“Resolved”**; the family view completes the care timeline.

### Storyline 2: Child or OKU resident requests assistance
1. In the Resident App, go to **“Request Help”** (`/resident/request-help`).
2. Use the 1-click **Judge Demo Presets**:
   - **“🧒 Child Needs Help”** (pre-fills: Child, Safety concern, Compound playground).
   - **“♿ OKU Accessibility”** (pre-fills: Person with disability, Mobility assistance, Lobby ramp).
3. Click **“Trigger Demo Alert / Send Help Request”**.
4. The case immediately appears in the Admin **Alerts & Cases** inbox with the appropriate role tag.

### Storyline 3: Suspicious NFC card use
1. In the Resident App, go to **“NFC Card”** (`/resident/card`).
2. Click **“Simulate Unusual Activity”**.
3. A notification prompt appears: *“Unusual card activity detected. Was this you?”*
4. Click **“No, not me — Freeze Card”**.
5. The card status visibly updates to **“Temporarily Blocked”**, and any subsequent contactless taps are rejected.
6. A high-priority security case is dispatched to the Admin Console under **“NFC Security”** (`/admin/nfc-security`).
7. Admin marks the case reviewed and can unblock/reactivate the credential.

---

## 🏬 Basic Mall UI (Concept Preview — Section 7)
Click **“Mall Preview”** in the top header to inspect the **KL East Mall & Retail Hub** concept preview:
- Retail directory (Concierge, Mobility Loans, Parking Escort, Safe Meetpoints).
- Accessibility & Mobility Loan request form.
- Clearly segregated as a concept preview so residential remains the core focus.

---

## 🎨 Editorial Poster Integration (`gemini-code-1792220856470.md`)
Click **“Editorial Poster”** in the top bar:
- **Top Half (50%)**: Exhibition-grade photograph of Aster Residence with natural lighting and archival metadata tags.
- **Bottom Half (50%)**: Minimalist Risograph print art on ivory paper (`#F7F5F0`) with 5 selectable dynamic motion fields (*Vertical Drop, Ascending Line, Directional Flow, Radial Dispersion, Ripple Waves*), stipple dot matrices, and micro-typography.

---

## 🛡️ Privacy & Sustainability Guarantees (Section 8)
- **Token-Only Security**: NFC cards represent an encrypted token ID; **no IC numbers, medical records, or sensitive health data** are stored on cards.
- **Zero Mandatory Extra Hardware**: Uses residents' existing smartphones and standard guardhouse networks.
- **Illustrative Prototype Indicators**: Labeled with `[Illustrative Prototype Indicator]` rather than speculative carbon metrics.
