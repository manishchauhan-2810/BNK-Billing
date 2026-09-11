export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isToday(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

export function getDateRange(preset) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  
  let start = new Date(today);

  switch (preset) {
    case 'Today':
      break;
    case 'This Week':
      start.setDate(today.getDate() - today.getDay());
      break;
    case 'This Month':
      start.setDate(1);
      break;
    default:
      return { start: null, end: null };
  }
  
  return { start: start.toISOString(), end: end.toISOString() };
}
