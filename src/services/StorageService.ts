export const uploadToCloud = async (file: File): Promise<string> => {
  // Mock upload for images (Small files)
  if (file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
  
  // Mock upload for APK/Files (Large files)
  console.log(`[Storage] Mocking upload for ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
  
  // Return a fake internal URL to simulate the file being hosted.
  return `https://internal-storage.gamesmart.com/files/${Date.now()}_${file.name}`;
};

export const saveToPersistentStore = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // Handle QuotaExceededError specifically to prevent crash
    if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      console.warn(`Storage quota exceeded for key: ${key}. Data not saved.`);
    } else {
      console.error("Storage error", e);
    }
  }
};

export const loadFromPersistentStore = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};
