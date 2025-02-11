/**
 * Stores a value in localStorage after serializing it to JSON.
 * @param key - The key under which to store the value
 * @param value - The value to store. Can be any JSON-serializable value
 * @throws Will log error to console if storage fails or value cannot be serialized
 */
export const setStorageItem = (key: string, value: any): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Retrieves and deserializes a value from localStorage.
 * @param key - The key of the value to retrieve
 * @param defaultValue - Value to return if key doesn't exist or if retrieval fails
 * @returns The deserialized value if found, otherwise the defaultValue
 * @throws Will log error to console if retrieval or parsing fails
 */
export const getStorageItem = <T>(key: string, defaultValue: T | null = null): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};
