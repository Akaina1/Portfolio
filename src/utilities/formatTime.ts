/**
 * Formats a date to display only hours and minutes in a consistent format
 * that won't cause hydration mismatches between server and client
 */
export const formatTime = (date: Date): string => {
  // Use explicit formatting to avoid locale differences
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format as 12-hour time with AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};
