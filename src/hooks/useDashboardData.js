import { useMemo } from "react";
import { generateRandomCases } from "../components/data/CaseData";

// Utility to produce an array of 12 random ints between min–max (inclusive)
const generateYearlyData = (min, max) =>
  Array.from(
    { length: 12 },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );

/**
 * Provides all synthetic data consumed by the CRM dashboard: case list,
 * chart series, and high-level statistics.  Memoised so work is done only
 * once per mount.
 */
export default function useDashboardData(caseCount = 10) {
  const caseData = useMemo(() => generateRandomCases(caseCount), [caseCount]);

  const chartData = useMemo(() => {
    return {
      scans: generateYearlyData(10, 25),
      molds: generateYearlyData(8, 20),
      impressions: generateYearlyData(5, 18),
    };
  }, []);

  const stats = useMemo(() => {
    const newCases = caseData.filter((c) => c.cat === "New Case").length;
    const total = caseData.length;
    const completed = caseData.filter((c) => c.stat === "Completed").length;
    const pending = caseData.filter((c) => c.stat === "Pending").length;
    const inReview = caseData.filter((c) => c.stat === "In Review").length;
    const uploaded = caseData.filter((c) => c.stat === "Uploaded").length;
    const inProgress = caseData.filter((c) => c.stat === "In Progress").length;

    return {
      total,
      newCases,
      completed,
      pending,
      inProgress,
      inReview,
      uploaded,
      completionPercentage: Math.round((completed / total) * 100) || 0,
    };
  }, [caseData]);

  return { caseData, chartData, stats };
}
