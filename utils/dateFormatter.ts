export const formatDate = (dateString?: string): string => {
  if (!dateString) {
    return 'N/A';
  }
  try {
    // Parse date as UTC to avoid timezone issues. Appending 'T00:00:00Z' ensures
    // '2024-08-15' is treated as midnight at UTC, not in the local timezone,
    // which prevents off-by-one-day errors in different timezones.
    const date = new Date(`${dateString}T00:00:00Z`);
    if (isNaN(date.getTime())) {
      // Handle invalid date string by returning it as is.
      return dateString;
    }
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Fallback to the original string if parsing fails
  }
};
