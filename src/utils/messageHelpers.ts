/**
 * Format a timestamp string to a human-readable date/time string
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Format a priority score (0-1) to a percentage string (0-100)
 */
export function formatPriority(priority: number): string {
  const clampedPriority = Math.max(0, Math.min(1, priority));
  return (clampedPriority * 100).toFixed(0);
}

