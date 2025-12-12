export interface READMEGeneration {
  repoName: string;
  tone: string;
  language: "en" | "es" | "other";
  generatedREADME: string;
  createdAt: string; // ISO
}
