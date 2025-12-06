// Database Bridge - Allows using either API or static data
// This ensures the app works whether or not the backend server is running

class DatabaseBridge {
  constructor() {
    this.useAPI = false;
    this.api = null;
    this.staticData = universities; // Fallback to static data
    this.initializeConnection();
  }

  async initializeConnection() {
    try {
      // Try to connect to API
      this.api = initializeAPIService('http://localhost:5000');
      const health = await this.api.health();
      this.useAPI = true;
      console.log('✅ Connected to database API. Using live data.');
    } catch (error) {
      this.useAPI = false;
      console.warn('⚠️ API not available. Using static data.');
    }
  }

  /**
   * Get university by ID
   */
  async getUniversityById(id) {
    if (this.useAPI) {
      try {
        return await this.api.getUniversityById(id);
      } catch (error) {
        console.error('API error, falling back to static data:', error);
        return this.staticData[id];
      }
    }
    return this.staticData[id];
  }

  /**
   * Get all universities
   */
  async getAllUniversities() {
    if (this.useAPI) {
      try {
        const unis = await this.api.getAllUniversities();
        // Convert array to object format
        const uniObj = {};
        unis.forEach(uni => {
          uniObj[uni.id] = uni;
        });
        return uniObj;
      } catch (error) {
        console.error('API error, falling back to static data:', error);
        return this.staticData;
      }
    }
    return this.staticData;
  }

  /**
   * Get universities by city
   */
  async getUniversitiesByCity(city) {
    if (this.useAPI) {
      try {
        return await this.api.getUniversitiesByCity(city);
      } catch (error) {
        console.error('API error, falling back to static data:', error);
        return Object.values(this.staticData).filter(u => u.city === city);
      }
    }
    return Object.values(this.staticData).filter(u => u.city === city);
  }

  /**
   * Search universities by program
   */
  async getUniversitiesByProgram(programName) {
    if (this.useAPI) {
      try {
        return await this.api.getUniversitiesByProgram(programName);
      } catch (error) {
        console.error('API error, falling back to static data:', error);
      }
    }
    
    // Static fallback
    return Object.values(this.staticData).filter(u => {
      const allPrograms = [...u.programs.bachelor, ...u.programs.master];
      return allPrograms.some(p => p.toLowerCase().includes(programName.toLowerCase()));
    });
  }

  /**
   * Get connection status
   */
  isConnected() {
    return this.useAPI;
  }

  /**
   * Force use static data (for development/testing)
   */
  forceStatic() {
    this.useAPI = false;
    console.log('Switched to static data mode.');
  }

  /**
   * Force use API (for testing)
   */
  async forceAPI() {
    this.useAPI = false;
    await this.initializeConnection();
  }
}

// Global instance
let dbBridge = null;

/**
 * Get database bridge instance
 */
function getDatabase() {
  if (!dbBridge) {
    dbBridge = new DatabaseBridge();
  }
  return dbBridge;
}

/**
 * Wait for database to initialize
 */
async function waitForDatabase() {
  const db = getDatabase();
  // Wait up to 2 seconds for API to connect
  for (let i = 0; i < 10; i++) {
    if (db.useAPI) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  return false;
}
