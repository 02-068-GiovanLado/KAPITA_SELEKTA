const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  /**
   * Helper method for GET requests
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Helper method for POST requests
   */
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Helper method for PUT requests
   */
  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error putting to ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Helper method for DELETE requests
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get dashboard statistics
   * GET /api/stats
   */
  async getStats() {
    return this.get('/stats');
  }

  /**
   * Get recent alerts with patient details
   * GET /api/alerts/recent
   */
  async getRecentAlerts() {
    return this.get('/alerts/recent');
  }

  /**
   * Get all patients or filter by category
   * GET /api/patients?category=...
   * @param {string} category - Optional: 'Bayi', 'Dewasa', or 'Lansia'
   */
  async getPatients(category = null) {
    const query = category ? `?category=${category}` : '';
    return this.get(`/patients${query}`);
  }

  /**
   * Get patient by ID with all associations
   * GET /api/patients/:id
   * @param {number} id - Patient ID
   */
  async getPatientById(id) {
    return this.get(`/patients/${id}`);
  }

  /**
   * Create new patient with initial checkup
   * POST /api/patients
   * @param {object} patientData - Patient data including checkup
   */
  async createPatient(patientData) {
    return this.post('/patients', patientData);
  }
  /**
   * Update patient
   * PUT /api/patients/:id
   */
  async updatePatient(id, data) {
    return this.put(`/patients/${id}`, data);
  }

  /**
   * Delete patient
   * DELETE /api/patients/:id
   */
  async deletePatient(id) {
    return this.delete(`/patients/${id}`);
  }

  /**
   * Update checkup
   * PUT /api/checkups/:id
   */
  async updateCheckup(id, data) {
    return this.put(`/checkups/${id}`, data);
  }

  /**
   * Update vitamin
   * PUT /api/vitamins/:id
   */
  async updateVitamin(id, data) {
    return this.put(`/vitamins/${id}`, data);
  }
}

const apiService = new ApiService();
export default apiService;
