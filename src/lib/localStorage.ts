
// Local Storage utility functions for persisting app data

/**
 * Save data to local storage
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

/**
 * Load data from local storage
 */
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Remove data from local storage
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

/**
 * Export data from localStorage to a JSON file
 */
export const exportLocalStorageData = (keys: string[], filename: string = 'fitness-data-export.json'): void => {
  try {
    const exportData: Record<string, any> = {};
    
    keys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data !== null) {
        exportData[key] = JSON.parse(data);
      }
    });
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting data from localStorage:', error);
  }
};

/**
 * Import data to localStorage from a JSON file
 * @returns A promise that resolves to the imported data
 */
export const importLocalStorageData = (file: File): Promise<Record<string, any>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target || typeof event.target.result !== 'string') {
          throw new Error('Invalid file content');
        }
        
        const importData = JSON.parse(event.target.result);
        
        // Save each key to localStorage
        Object.entries(importData).forEach(([key, value]) => {
          saveToLocalStorage(key, value);
        });
        
        resolve(importData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };
    
    reader.readAsText(file);
  });
};

// Storage keys
export const STORAGE_KEYS = {
  NUTRITION_ITEMS: 'nutrition_items',
  NUTRITION_GOALS: 'nutrition_goals',
  WATER_INTAKE: 'water_intake',
  WATER_GOAL: 'water_goal',
  PROGRESS_DATA: 'progress_data',
  WORKOUTS: 'workouts',
  WORKOUT_TEMPLATES: 'workout_templates',
  GYM_TASKS: 'gym_tasks',
  PROGRESS_IMAGES: 'progress_images',
  WORKOUT_STATISTICS: 'workout_statistics'
};
