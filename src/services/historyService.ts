// History and README API service
// Note: Firebase auth will be integrated later - currently using mock data

import { HistoryAnalysis, SavedREADME, mockHistoryData, mockREADMEData } from '@/types/history';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Simulated delay for realistic loading states
const simulateDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchAnalysisHistory(limit: number = 10): Promise<HistoryAnalysis[]> {
  // TODO: Integrate Firebase auth when available
  // const idToken = await auth.currentUser?.getIdToken();
  // const response = await fetch(`${API_URL}/history?limit=${limit}`, {
  //   headers: { 'Authorization': `Bearer ${idToken}` }
  // });
  // if (!response.ok) throw new Error('Failed to fetch history');
  // return (await response.json()).data;

  await simulateDelay();
  return mockHistoryData.slice(0, limit);
}

export async function fetchAnalysisById(id: string): Promise<HistoryAnalysis | null> {
  // TODO: Integrate Firebase auth when available
  await simulateDelay(500);
  return mockHistoryData.find(a => a.id === id) || null;
}

export async function fetchUserREADMEs(limit: number = 20): Promise<SavedREADME[]> {
  // TODO: Integrate Firebase auth when available
  // const idToken = await auth.currentUser?.getIdToken();
  // const response = await fetch(`${API_URL}/readmes?limit=${limit}`, {
  //   headers: { 'Authorization': `Bearer ${idToken}` }
  // });
  // if (!response.ok) throw new Error('Failed to fetch READMEs');
  // return (await response.json()).data;

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
