/**
 * Utility functions for date formatting and parsing
 */

/**
 * Safely formats a date string/object to a readable date
 * Handles various date formats from the backend
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return 'Unknown date';
  
  let date;
  
  try {
    // Handle different date formats
    if (typeof dateInput === 'string') {
      // Handle ISO strings or other string formats
      date = new Date(dateInput);
    } else if (typeof dateInput === 'object' && dateInput.$date) {
      // Handle MongoDB date objects: { "$date": "2025-09-21T08:00:00.000Z" }
      date = new Date(dateInput.$date);
    } else if (dateInput instanceof Date) {
      // Already a Date object
      date = dateInput;
    } else {
      // Try to convert whatever it is
      date = new Date(dateInput);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date received:', dateInput);
      return 'Invalid date';
    }
    
    // Format the date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error, 'Input:', dateInput);
    return 'Invalid date';
  }
};

/**
 * Formats a date with time
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return 'Unknown date';
  
  let date;
  
  try {
    if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else if (typeof dateInput === 'object' && dateInput.$date) {
      date = new Date(dateInput.$date);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      date = new Date(dateInput);
    }
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date received:', dateInput);
      return 'Invalid date';
    }
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Date formatting error:', error, 'Input:', dateInput);
    return 'Invalid date';
  }
};

/**
 * Gets relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return 'Unknown time';
  
  let date;
  
  try {
    if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else if (typeof dateInput === 'object' && dateInput.$date) {
      date = new Date(dateInput.$date);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      date = new Date(dateInput);
    }
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    
    // Fall back to formatted date for older items
    return formatDate(date);
  } catch (error) {
    console.error('Relative time formatting error:', error, 'Input:', dateInput);
    return 'Invalid date';
  }
};

/**
 * Formats date for analytics charts
 */
export const formatChartDate = (dateInput) => {
  if (!dateInput) return '';
  
  let date;
  
  try {
    if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else if (typeof dateInput === 'object' && dateInput.$date) {
      date = new Date(dateInput.$date);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      date = new Date(dateInput);
    }
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Chart date formatting error:', error, 'Input:', dateInput);
    return '';
  }
};