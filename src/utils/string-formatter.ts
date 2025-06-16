/**
 * Utility functions for string formatting
 */

/**
 * Capitalizes the first letter of each word in a string
 * @param str - The input string
 * @returns The string with the first letter of each word capitalized
 */
export function capitalizeWords(str: string): string {
  if (!str) return str;
  
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Truncates a string to a specified length and adds an ellipsis if truncated
 * @param str - The input string
 * @param maxLength - The maximum length of the string
 * @returns The truncated string with an ellipsis if truncated
 */
export function truncate(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str;
  
  return str.substring(0, maxLength) + '...';
}