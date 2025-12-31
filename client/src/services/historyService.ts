// History and README API service
// Note: Firebase auth will be integrated later - currently using mock data

import { HistoryAnalysis, SavedREADME, mockHistoryData, mockREADMEData } from '@/types/history';
import { authFetch } from '@/services/authFetch';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Simulated delay for realistic loading states
const simulateDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchAnalysisHistory(limit: number = 10): Promise<HistoryAnalysis[]> {
  // Prefer API when available; fall back to mock data for local/demo environments.
  try {
    const response = await authFetch(`${API_URL}/history?limit=${limit}`);
    if (response.ok) {
      const json = await response.json();
      return (json?.data ?? json) as HistoryAnalysis[];
    }
  } catch {
    // ignore and fall back
  }

  await simulateDelay();
  return mockHistoryData.slice(0, limit);
}

export async function fetchAnalysisById(id: string): Promise<HistoryAnalysis | null> {
  // TODO: Integrate Firebase auth when available
  await simulateDelay(500);
  return mockHistoryData.find(a => a.id === id) || null;
}

export async function fetchUserREADMEs(limit: number = 20): Promise<SavedREADME[]> {
  try {
    const response = await authFetch(`${API_URL}/readmes?limit=${limit}`);
    if (response.ok) {
      const json = await response.json();
      return (json?.data ?? json) as SavedREADME[];
    }
  } catch {
    // ignore and fall back
  }

  await simulateDelay();
  return mockREADMEData.slice(0, limit);
}

export async function fetchREADMEById(id: string): Promise<SavedREADME | null> {
  await simulateDelay(500);
  return mockREADMEData.find(r => r.id === id) || null;
}

export async function deleteAnalysis(id: string): Promise<boolean> {
  // TODO: Integrate Firebase auth when available
  await simulateDelay(500);
  return true;
}

export async function deleteREADME(id: string): Promise<boolean> {
  // TODO: Integrate Firebase auth when available
  await simulateDelay(500);
  return true;
}

export async function exportHistoryCSV(): Promise<Blob> {
  // TODO: Integrate Firebase auth when available
  await simulateDelay(1000);
  
  const headers = ['Date', 'Job Title', 'Company', 'Overall Score', 'Technical', 'Experience', 'Relevance'];
  const rows = mockHistoryData.map(a => [
    new Date(a.analyzedAt).toLocaleDateString(),
    a.jobTitle,
    a.jobCompany,
    a.overallScore,
    a.technicalScore,
    a.experienceScore,
    a.relevanceScore,
  ]);
  
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  return new Blob([csv], { type: 'text/csv' });
}
