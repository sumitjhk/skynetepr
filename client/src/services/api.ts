import type { Person, EPR, CreateEPRData, UpdateEPRData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface AssistRequest {
  overallRating: number;
  technicalSkillsRating: number;
  nonTechnicalSkillsRating: number;
}

interface AssistResponse {
  suggestedRemarks: string;
}

export const api = {
  // People endpoints
  async getPeople(role?: string, search?: string): Promise<Person[]> {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (search) params.append('search', search);
    
    const url = `${API_BASE_URL}/people${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch people');
    }
    
    return response.json();
  },

  async getPersonById(id: string): Promise<Person> {
    const response = await fetch(`${API_BASE_URL}/people/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch person');
    }
    
    return response.json();
  },

  // EPR endpoints
  async getEPRs(personId: string): Promise<EPR[]> {
    const response = await fetch(`${API_BASE_URL}/epr?personId=${personId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch EPRs');
    }
    
    return response.json();
  },

  async getEPRById(id: string): Promise<EPR> {
    const response = await fetch(`${API_BASE_URL}/epr/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch EPR');
    }
    
    return response.json();
  },

  async createEPR(data: CreateEPRData): Promise<EPR> {
    const response = await fetch(`${API_BASE_URL}/epr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create EPR');
    }
    
    return response.json();
  },

  async updateEPR(id: string, data: UpdateEPRData): Promise<EPR> {
    const response = await fetch(`${API_BASE_URL}/epr/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update EPR');
    }
    
    return response.json();
  },

  // AI Assist endpoint
  async assistEPR(data: AssistRequest): Promise<AssistResponse> {
    const response = await fetch(`${API_BASE_URL}/epr/assist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate suggested remarks');
    }

    return response.json();
  },
};
