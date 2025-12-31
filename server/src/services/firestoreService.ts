import type { AnalysisResult, ToneAnalysis } from "@readyrepo/shared";
import { admin, getFirestore } from "../config/firebase";

export async function saveAnalysis(params: {
  userId: string;
  githubUsername: string;
  jobUrl: string;
  jobTitle: string;
  analysisResult: AnalysisResult;
  toneAnalysis: ToneAnalysis;
  isPublic?: boolean;
}) {
  const db = getFirestore();
  const ref = await db.collection("analyses").add({
    userId: params.userId,
    githubUsername: params.githubUsername,
    jobUrl: params.jobUrl,
    jobTitle: params.jobTitle,
    overallScore: params.analysisResult.overallScore,
    scoreBreakdown: params.analysisResult.scoreBreakdown,
    strengths: params.analysisResult.strengths,
    gaps: params.analysisResult.gaps,
    recommendations: params.analysisResult.recommendations,
    repoScores: params.analysisResult.repoScores,
    toneAnalysis: params.toneAnalysis,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    isPublic: Boolean(params.isPublic ?? false)
  });

  return { analysisId: ref.id };
}

export async function getAnalysisHistory(userId: string, limit = 10) {
  const db = getFirestore();
  const snap = await db
    .collection("analyses")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAnalysisById(analysisId: string, userId: string) {
  const db = getFirestore();
  const snap = await db.collection("analyses").doc(analysisId).get();
  if (!snap.exists) return null;
  const data = snap.data();
  if (!data) return null;
  const ownerId = (data as Record<string, unknown>)["userId"];
  if (typeof ownerId !== "string" || ownerId !== userId) return null;
  return { id: snap.id, ...data };
}

export async function saveGeneratedREADME(params: {
  userId: string;
  analysisId: string | null;
  repoName: string;
  repoUrl: string;
  originalREADME: string | null;
  generatedREADME: string;
  tone: ToneAnalysis;
  jobContext: {
    jobUrl: string;
    jobTitle: string;
    company?: string | null;
  };
}) {
  const db = getFirestore();
  const now = admin.firestore.FieldValue.serverTimestamp();

  const ref = await db.collection("readmes").add({
    userId: params.userId,
    analysisId: params.analysisId,
    repoName: params.repoName,
    repoUrl: params.repoUrl,
    originalREADME: params.originalREADME,
    generatedREADME: params.generatedREADME,
    tone: params.tone,
    jobContext: params.jobContext,
    createdAt: now,
    lastEditedAt: now
  });

  return { readmeId: ref.id };
}

export async function getUserREADMEs(userId: string, limit = 20) {
  const db = getFirestore();
  const snap = await db
    .collection("readmes")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

