// Records a full walkthrough of the app as a video.
//
//   1. Start the app in demo mode:   npm run build && DEMO_MODE=1 npm start
//      (a production build, so the Next.js dev button isn't in the video;
//       delete .data/store.json first to start from the sample data)
//   2. In another terminal:          npm run demo
//
// The video lands in demo/. Chrome gets a fake microphone, so the voice
// dictation flow runs for real end to end (demo mode supplies the words).
//
// Convert it for the README (needs ffmpeg):
//   ffmpeg -y -i demo/demo.webm -vf "setpts=PTS/1.25,fps=12,scale=360:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse" docs/demo.gif
//   ffmpeg -y -i demo/demo.webm -vf "setpts=PTS/1.25,scale=430:-2" -c:v libx264 -pix_fmt yuv420p docs/demo.mp4

import { chromium } from "playwright";
import { mkdirSync, readdirSync, renameSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = "demo";
const SIZE = { width: 430, height: 880 }; // phone-sized, like Matt in the field

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
});
const context = await browser.newContext({
  viewport: SIZE,
  recordVideo: { dir: OUT, size: SIZE },
  permissions: ["microphone"],
  timezoneId: "America/Toronto",
});
const page = await context.newPage();
const wait = (ms) => page.waitForTimeout(ms);

// On-screen caption so the video explains itself.
async function caption(text) {
  await page.evaluate((t) => {
    let el = document.getElementById("demo-caption");
    if (!el) {
      el = document.createElement("div");
      el.id = "demo-caption";
      Object.assign(el.style, {
        position: "fixed", left: "12px", right: "12px", bottom: "92px", zIndex: "9999",
        background: "rgba(29,26,22,0.92)", color: "#fffdfa", padding: "12px 16px",
        borderRadius: "14px", font: "600 15px/1.35 Inter, system-ui, sans-serif",
        textAlign: "center", pointerEvents: "none", transition: "opacity .25s",
      });
      document.body.appendChild(el);
    }
    el.textContent = t;
    el.style.opacity = "1";
  }, text);
}

async function smoothScroll(y) {
  await page.evaluate((to) => window.scrollTo({ top: to, behavior: "smooth" }), y);
  await wait(900);
}

// 1. Dashboard
await page.goto(BASE);
await page.waitForLoadState("networkidle");
await caption("Dashboard: what's owed and what's been paid");
await wait(2800);

// 2. New invoice, by voice
await page.locator('a[href="/new"]').first().click();
await page.waitForURL("**/new");
await page.waitForLoadState("networkidle");
await caption("Just finished a shoot? Dictate the invoice");
await wait(1800);
await page.getByRole("button", { name: /Dictate/ }).first().click();

// Answer each step. Phone is skipped to show that steps are optional.
const answers = ["next", "next", "next", "skip", "next", "next", "next"];
for (const action of answers) {
  await page.getByText("Listening…").waitFor();
  await wait(1300);
  if (action === "skip") {
    await page.getByRole("button", { name: "Skip" }).click();
  } else {
    await page.getByRole("button", { name: /^(Next|Finish & fill form)$/ }).click();
  }
}
await caption("Whisper transcribes, GPT fills in the form");
await page.getByText("Filling in your form…").waitFor({ state: "detached", timeout: 15000 });
await wait(1600);
await smoothScroll(420);
await wait(1200);
await smoothScroll(0);

// 3. Send it
await caption("One tap sends it with a secure Pay link");
await wait(1400);
await page.getByRole("button", { name: /Send invoice/ }).click();
await page.waitForURL("**/invoice/**");
await page.waitForLoadState("networkidle");
await wait(2600);

// 4. The client's view
const link = await page.getByText("Preview what your client sees").getAttribute("href");
await page.goto(link);
await page.waitForLoadState("networkidle");
await caption("The couple opens the link on their phone");
await wait(2200);
await page.getByRole("button", { name: /securely/ }).click();
await wait(1200);
await caption("And pays by card in two taps");
await page.getByRole("button", { name: /^Pay \$[\d,.]+$/ }).click();
await page.getByText("Payment received").waitFor({ timeout: 15000 });
await caption("Paid on the spot, not weeks later");
await wait(3500);

await context.close();
await browser.close();

// Give the newest video a stable name.
const vids = readdirSync(OUT).filter((f) => f.endsWith(".webm") && f !== "demo.webm");
if (vids.length) renameSync(join(OUT, vids.at(-1)), join(OUT, "demo.webm"));
console.log(`Saved ${OUT}/demo.webm`);
