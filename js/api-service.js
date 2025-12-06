// API Service for connecting to backend
// This service handles all API calls to the Express server

class APIService {
  constructor(baseURL = 'http://localhost:5000') {
    this.baseURL = baseURL;
    this.cache = {};
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async fetch(endpoint) {
    const cacheKey = endpoint;
    
    // Check cache
    if (this.cache[cacheKey] && Date.now() - this.cache[cacheKey].time < this.cacheTimeout) {
      return this.cache[cacheKey].data;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      // Cache the result
      this.cache[cacheKey] = {
        data: data,
        time: Date.now()
      };
      
      return data;
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  /**
   * Get all universities
   */
  async getAllUniversities() {
    return this.fetch('/api/universities');
  }

  /**
   * Get university by ID with all related data
   */
  async getUniversityById(id) {
    return this.fetch(`/api/universities/${id}`);
  }

  /**
   * Get universities by city
   */
  async getUniversitiesByCity(city) {
    return this.fetch(`/api/universities/by-city/${city}`);
  }

  /**
   * Get all academic programs
   */
  async getAllPrograms() {
    return this.fetch('/api/programs');
  }

  /**
   * Get programs by university
   */
  async getProgramsByUniversity(universityId) {
    return this.fetch(`/api/universities/${universityId}/programs`);
  }

  /**
   * Get universities offering a specific program
   */
  async getUniversitiesByProgram(programName) {
    return this.fetch(`/api/programs/${encodeURIComponent(programName)}/universities`);
  }

  /**
   * Get admission info for a university
   */
  async getAdmissionInfo(universityId) {
    return this.fetch(`/api/universities/${universityId}/admissions`);
  }

  /**
   * Get international cooperation info
   */
  async getInternationalInfo(universityId) {
    return this.fetch(`/api/universities/${universityId}/international`);
  }

  /**
   * Check server health
   */
  async health() {
    return this.fetch('/api/health');
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {};
  }
}

// Global instance
let apiService = null;

/**
 * Initialize API Service
 */
function initializeAPIService(baseURL = 'http://localhost:5000') {
  if (!apiService) {
    apiService = new APIService(baseURL);
  }
  return apiService;
}

/**
 * Get API Service instance
 */
function getAPIService() {
  if (!apiService) {
    apiService = new APIService();
  }
  return apiService;
}

/**
 * Test API connection
 */
async function testAPIConnection() {
  try {
    const service = getAPIService();
    const health = await service.health();
    console.log('✅ API connection successful:', health);
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return false;
  }
}
