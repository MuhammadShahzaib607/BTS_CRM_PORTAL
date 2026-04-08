export function formatDate(inputDate) {
  const date = inputDate ? new Date(inputDate) : new Date();

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const day = String(date.getDate()).padStart(2, '0');
  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];

  return `${day}-${months[date.getMonth()]}-${date.getFullYear()}`;
}