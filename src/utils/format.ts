/**
 * Shared formatting utilities – government timestamp + helpers
 */

export function formatGovTimestamp(date: Date = new Date()): string {
  // e.g. "07 Sep 2026, 08:14 PM" – 12h, en-IN, IST-aware
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-IN', { month: 'short' });
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${day} ${month} ${year}, ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

export function formatGovTimestampWithSeconds(date: Date = new Date()): string {
  const base = formatGovTimestamp(date);
  const seconds = String(date.getSeconds()).padStart(2, '0');
  // inject :SS before AM/PM
  return base.replace(/( \wM)$/, `:${seconds}$1`);
}

export function isoNow(): string {
  return new Date().toISOString();
}

export function latencyMs(min = 105, max = 210): string {
  return `${Math.floor(min + Math.random() * (max - min))}ms`;
}

export function randomSha256(): string {
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function nextLogId(): string {
  return `LOG-${Math.floor(1000 + Math.random() * 9000)}`;
}
