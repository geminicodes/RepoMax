"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextMonthStart = getNextMonthStart;
exports.createOrUpdateUser = createOrUpdateUser;
exports.checkUserRateLimit = checkUserRateLimit;
exports.incrementAnalysisCount = incrementAnalysisCount;
const firebase_1 = require("../config/firebase");
function getNextMonthStart(from = new Date()) {
    const d = new Date(from);
    // First day of next month at 00:00:00.000 UTC
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const next = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));
    return next;
}
async function createOrUpdateUser(uid, email, displayName, photoURL) {
    const db = (0, firebase_1.getFirestore)();
    const ref = db.collection("users").doc(uid);
    await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const now = new Date();
        const reset = getNextMonthStart(now).toISOString();
        if (!snap.exists) {
            const doc = {
                email,
                displayName,
                photoURL,
                tier: "free",
                createdAt: firebase_1.admin.firestore.FieldValue.serverTimestamp(),
                analysisCount: 0,
                analysisResetDate: reset,
                preferences: {}
            };
            tx.set(ref, doc, { merge: true });
            return;
        }
        // Only update identity fields; tier is managed server-side.
        tx.set(ref, {
            email,
            displayName,
            photoURL
        }, { merge: true });
    });
}
async function checkUserRateLimit(uid) {
    const db = (0, firebase_1.getFirestore)();
    const ref = db.collection("users").doc(uid);
    return await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const now = new Date();
        const tier = snap.data()?.tier ?? "free";
        if (tier === "pro") {
            return { allowed: true, remaining: -1, resetsAt: getNextMonthStart(now).toISOString(), tier };
        }
        const currentCount = Number(snap.data()?.analysisCount ?? 0);
        const resetIso = String(snap.data()?.analysisResetDate ?? "");
        const resetDate = resetIso ? new Date(resetIso) : getNextMonthStart(now);
        // If reset date is missing/invalid OR we've crossed it, reset counts.
        if (!resetIso || Number.isNaN(resetDate.getTime()) || now >= resetDate) {
            const nextReset = getNextMonthStart(now).toISOString();
            tx.set(ref, {
                analysisCount: 0,
                analysisResetDate: nextReset
            }, { merge: true });
            return { allowed: true, remaining: 3, resetsAt: nextReset, tier: "free" };
        }
        const remaining = Math.max(0, 3 - currentCount);
        const allowed = currentCount < 3;
        return { allowed, remaining, resetsAt: resetDate.toISOString(), tier: "free" };
    });
}
async function incrementAnalysisCount(uid) {
    const db = (0, firebase_1.getFirestore)();
    const ref = db.collection("users").doc(uid);
    await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const now = new Date();
        const tier = snap.data()?.tier ?? "free";
        if (tier === "pro")
            return;
        const resetIso = String(snap.data()?.analysisResetDate ?? "");
        const resetDate = resetIso ? new Date(resetIso) : getNextMonthStart(now);
        let analysisCount = Number(snap.data()?.analysisCount ?? 0);
        if (!resetIso || Number.isNaN(resetDate.getTime()) || now >= resetDate) {
            analysisCount = 0;
            tx.set(ref, { analysisResetDate: getNextMonthStart(now).toISOString(), analysisCount: 0 }, { merge: true });
        }
        tx.set(ref, { analysisCount: analysisCount + 1 }, { merge: true });
    });
}
