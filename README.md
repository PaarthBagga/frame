# 📸 Frame

**Invoicing for photographers in the field. Dictate an invoice out loud and send it with a Pay Now link, all in under a minute.**

<p align="center">
  <img src="docs/demo.gif" alt="Frame demo: dictating an invoice by voice, sending it, and the client paying" width="360">
</p>

<p align="center"><a href="docs/demo.mp4">▶️ Watch the full-quality video</a></p>

<p align="center"><i>Built at the Cursor Hackathon.</i></p>

---

## 📌 Overview

Wedding photographers finish a shoot exhausted, drive home, and leave invoicing for "later." Later turns into days, and every day an invoice isn't sent is a day longer before they get paid.

**Frame** lets a photographer send the invoice from their phone before they've even left the venue, by **talking instead of typing**.

---

## ✨ Features

- 🎙️ **Voice dictation**: Tap *Dictate* and answer a few prompts out loud: package, client name, email, event date. OpenAI Whisper transcribes each answer, and GPT turns the speech into clean form fields. "Emma dot patel at example dot com" becomes `emma.patel@example.com`, and "two weeks" becomes a 14-day due date.
- 📦 **Saved packages**: *Wedding Full Day*, *Engagement*, *Album Add-on* and others fill in the line items in one tap.
- 🔗 **Secure Pay link**: Every invoice gets a link the client can open on their phone and pay by card.
- ✉️ **Real email**: Invoices and reminders are sent through Resend as a branded HTML email.
- 💰 **Deposits**: Ask for 25% or 50% up front.
- 📊 **Dashboard and activity**: See what's outstanding, what's been collected this month, how long clients take to pay, and when each invoice was sent, reminded, or paid.
- 🗂️ **Client and project intake**, also by voice, so jobs can be logged before they're ready to invoice.

---

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 (Fraunces and Inter fonts)
- **AI:** OpenAI Whisper (speech to text) and GPT-4o mini (parsing speech into fields)
- **Email:** Resend
- **Demo recording:** Playwright

---

## 🔄 How Voice Dictation Works

```mermaid
flowchart LR
    A[Speak one answer] --> B["Browser records audio<br/>MediaRecorder"]
    B --> C["/api/transcribe<br/>Whisper"]
    C --> D{More steps?}
    D -- yes --> A
    D -- no --> E["/api/intake<br/>GPT, JSON output"]
    E --> F["Form filled in,<br/>ready to edit"]
```

### 1️⃣ One field at a time

- The dialog walks through one field at a time, and each step can be skipped.

### 2️⃣ Transcribe each answer separately

- Each answer is sent to Whisper on its own, so a messy answer only affects its own field.

### 3️⃣ Parse everything with GPT

- All the transcripts are sent to GPT together, with a rule for each field type: an email, a date relative to today, a package name that must match a real package, and so on.
- The model must return JSON and is told **never to invent anything that wasn't said**.

### 4️⃣ Review and send

- The form fills in, and the photographer can review and edit everything before sending.

---

## 🏗️ Architecture

```mermaid
flowchart LR
    UI["Next.js pages<br/>dashboard, new invoice, pay page"] --> API[API routes]
    API --> AI["OpenAI<br/>Whisper + GPT"]
    API --> Mail["Resend<br/>email"]
    API --> Store[("JSON file store<br/>.data/store.json")]
```

There's no database to set up. Data lives in a JSON file that's seeded with sample invoices on first run. Delete `.data/store.json` to reset.

---

## 🚀 Installation & Usage

### 📌 Prerequisites

- Node.js 20+ installed.

### ⚡ Quick start (no API keys needed)

```bash
npm install
DEMO_MODE=1 npm run dev
# open http://localhost:3000
```

Demo mode runs the whole app with realistic stand-ins for the paid services. Dictation returns sample speech, parsing returns the fields GPT would produce, and emails are marked sent without going out.

### 🔧 With the real services

```bash
cp .env.example .env.local
# add RESEND_API_KEY and OPENAI_API_KEY
npm run dev
```

In Resend's test mode you can only email your own address. Verify a domain to email clients.

---

## 🎬 Record the Demo Yourself

The GIF above is generated, not screen-recorded by hand. A Playwright script drives the app like a user would, with a fake microphone feeding the dictation flow, and records it:

```bash
DEMO_MODE=1 npm run dev          # terminal 1
npm run demo                     # terminal 2 -> demo/demo.webm

# convert to the README GIF and MP4 (needs ffmpeg)
ffmpeg -i demo/demo.webm -vf "setpts=PTS/1.25,fps=12,scale=360:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse" docs/demo.gif
ffmpeg -i demo/demo.webm -vf "setpts=PTS/1.25,scale=430:-2" -c:v libx264 -pix_fmt yuv420p docs/demo.mp4
```

Rerun it whenever the UI changes and the demo stays current.

---

## 📝 Notes

- **Payments are simulated.** The checkout is a demo screen and no card is ever charged. Connecting Stripe is the next step.
- **Single user.** There are no accounts. It's built around one photographer.

---

## 🔮 What's Next

- 💳 Real payments with Stripe Checkout
- 👥 Accounts, so more than one photographer can use it
- 🗄️ A real database (Postgres) in place of the JSON file
- 🧾 PDF invoices and automatic payment reminders

---

## 👥 Team

I built this in collaboration with three others at the Cursor Hackathon. The code is co-owned by all four of us.
