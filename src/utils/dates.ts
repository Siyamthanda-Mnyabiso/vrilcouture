/**
 * Format a date for display
 */
export const formatDate = (
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-ZA', options).format(dateObj);
};

/**
 * Format date for input (YYYY-MM-DD)
 */
export const formatDateInput = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
};

/**
 * Format date and time
 */
export const formatDateTime = (date: Date | string): string => {
    return formatDate(date, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date | string): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return (
        dateObj.getFullYear() === today.getFullYear() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getDate() === today.getDate()
    );
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: Date | string): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.getTime() < new Date().getTime();
};

/**
 * Check if a date is in the future
 */
export const isFuture = (date: Date | string): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.getTime() > new Date().getTime();
};

/**
 * Get the difference in days between two dates
 */
export const getDaysDifference = (date1: Date | string, date2: Date | string): number => {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get the start of the day for a given date
 */
export const getStartOfDay = (date: Date | string): Date => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
};

/**
 * Get the end of the day for a given date
 */
export const getEndOfDay = (date: Date | string): Date => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59, 999);
};

/**
 * Format a date range
 */
export const formatDateRange = (start: Date | string, end: Date | string): string => {
    const startDate = typeof start === 'string' ? new Date(start) : start;
    const endDate = typeof end === 'string' ? new Date(end) : end;

    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
        return `${startDate.getDate()} - ${endDate.getDate()} ${new Intl.DateTimeFormat('en-ZA', { month: 'long' }).format(startDate)} ${startDate.getFullYear()}`;
    }

    return `${formatDate(start)} - ${formatDate(end)}`;
};