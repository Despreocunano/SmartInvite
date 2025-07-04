import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function calculateRsvpStats(guests: any[]) {
  const total = guests.length;
  const attending = guests.filter(guest => guest.attending === true).length;
  const notAttending = guests.filter(guest => guest.attending === false).length;
  const pending = total - attending - notAttending;
  
  return {
    total,
    attending,
    notAttending,
    pending,
    attendingPercent: total ? Math.round((attending / total) * 100) : 0,
    pendingPercent: total ? Math.round((pending / total) * 100) : 0,
  };
}

/**
 * Opens a payment window with better mobile support
 * @param url - The payment URL to open
 * @param onSuccess - Callback when window opens successfully
 * @param onRedirect - Callback when redirecting in same window
 * @param onError - Callback when popup is blocked
 */
export function openPaymentWindow(
  url: string, 
  onSuccess?: () => void,
  onRedirect?: () => void,
  onError?: () => void
) {
  // Detect if it's mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // On mobile, try to open in new window first
    try {
      // Try to open in new window
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      // If popup was blocked, open in same window
      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        onRedirect?.();
        window.location.href = url;
      } else {
        onSuccess?.();
      }
    } catch (error) {
      // Fallback: open in same window
      onRedirect?.();
      window.location.href = url;
    }
  } else {
    // On desktop, use normal window.open
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) {
      onSuccess?.();
    } else {
      onError?.();
    }
  }
}