import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export function getStatusColor(status) {
  const colors = {
    applied: 'badge-blue',
    shortlisted: 'badge-green',
    rejected: 'badge-red',
    hired: 'badge-purple',
  };
  return colors[status] || 'badge-blue';
}
