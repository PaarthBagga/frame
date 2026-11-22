// Demo mode: run the full app with no API keys.
// Set DEMO_MODE=1 and voice dictation, form parsing and email sending
// return realistic canned results instead of calling OpenAI or Resend.
// With real keys and DEMO_MODE unset, none of this code runs.

export function isDemo(): boolean {
  return process.env.DEMO_MODE === "1";
}

// What the "photographer" says at each dictation step.
const SPOKEN: Record<string, string> = {
  packages: "Wedding full day, plus an album",
  clientName: "Emma and Noah Patel",
  email: "emma dot patel at example dot com",
  phone: "four one six, five five five, zero one nine two",
  eventType: "full day wedding",
  eventDate: "June 14th",
  dueInDays: "two weeks",
};

export function demoTranscript(step: string): string {
  return SPOKEN[step] ?? "";
}

// Next June 14th, as YYYY-MM-DD.
function nextJune14(): string {
  const now = new Date();
  const year = now.getMonth() > 5 || (now.getMonth() === 5 && now.getDate() > 14) ? now.getFullYear() + 1 : now.getFullYear();
  return `${year}-06-14`;
}

// What the AI would turn that speech into.
export function demoParse(keys: string[], transcripts: Record<string, string>): Record<string, unknown> {
  const parsed: Record<string, unknown> = {
    packages: ["Wedding — Full Day", "Album Add-on"],
    clientName: "Emma & Noah Patel",
    email: "emma.patel@example.com",
    phone: "+1 416 555 0192",
    eventType: "Wedding — Full Day",
    eventDate: nextJune14(),
    dueInDays: 14,
  };
  const values: Record<string, unknown> = {};
  for (const key of keys) {
    values[key] = key in parsed ? parsed[key] : (transcripts[key] ?? "");
  }
  return values;
}

export function demoDelay(ms = 700): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
