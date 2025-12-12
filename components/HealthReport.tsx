import React from 'react';
import { HealthAnalysis, RiskLevel, PatientProfile, SymptomData, QuestionAnswer } from '../types';
import { generatePDFReport } from '../services/pdfService';

interface HealthReportProps {
  data: HealthAnalysis;
  profile: PatientProfile;
  symptoms: SymptomData;
  qa: QuestionAnswer[];
}

const HealthReport: React.FC<HealthReportProps> = ({ data, profile, symptoms, qa }) => {
  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.HIGH: return 'bg-red-50 text-red-700 border-red-200';
      case RiskLevel.MODERATE: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case RiskLevel.LOW: return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  const handleDownload = () => {
    generatePDFReport(data, profile, symptoms, qa);
  };

  return (
    <div className="space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
          <div>
              <h2 className="text-2xl font-bold text-slate-800">Detailed Health Report</h2>
              <div className="text-sm text-slate-500 mt-1">
                 Patient: <span className="font-medium text-slate-700">{profile.name || "Anonymous"}</span> 
                 {profile.age && ` | Age: ${profile.age}`}
                 {profile.gender && ` | Gender: ${profile.gender}`}
              </div>
          </div>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition shadow-md"
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             Download PDF
          </button>
      </div>

      {/* Executive Summary */}
      <section>
        <p className="text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1">
          {data.executiveSummary}
        </p>
      </section>

      {/* Risk Score */}
      <section className={`p-4 rounded-xl border ${getRiskColor(data.riskScore)}`}>
        <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-bold">Risk Level: {data.riskScore}</span>
        </div>
        <p className="text-sm opacity-90">{data.riskExplanation}</p>
        {data.riskScore === RiskLevel.HIGH && (
            <div className="mt-3 bg-white/50 p-2 rounded text-sm font-bold animate-pulse">
                ⚠️ URGENT: Seek immediate medical attention.
            </div>
        )}
      </section>

      {/* Conditions Table */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Possible Conditions</h3>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm">
                <th className="py-2 px-1 w-1/4">Condition</th>
                <th className="py-2 px-1 w-1/6">Likelihood</th>
                <th className="py-2 px-1">Relevance</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {data.conditions.map((c, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                  <td className="py-3 px-1 align-top font-medium">{c.name}</td>
                  <td className="py-3 px-1 align-top">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      c.likelihood.toLowerCase().includes('most') ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {c.likelihood}
                    </span>
                  </td>
                  <td className="py-3 px-1 align-top text-sm">
                    {c.relevance}
                    <div className="mt-2 text-xs grid grid-cols-2 gap-2">
                        <div className="text-green-600">
                            <strong>Matches:</strong> {c.matchingSymptoms.join(', ')}
                        </div>
                        <div className="text-slate-400">
                            <strong>Does not match:</strong> {c.nonMatchingSymptoms.join(', ')}
                        </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Self Care */}
        <section className="bg-blue-50 p-5 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
            <span>🍵</span> Self-Care Steps
          </h3>
          <ul className="space-y-2">
            {data.selfCareSteps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-blue-900">
                <span className="mt-1">•</span> {step}
              </li>
            ))}
          </ul>
        </section>

        {/* Medication Caution */}
        <section className="bg-amber-50 p-5 rounded-xl border border-amber-100">
          <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
            <span>💊</span> Medication Caution
          </h3>
          <ul className="space-y-2">
            {data.medicationCaution.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-900">
                <span className="mt-1">⚠️</span> {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Red Flags */}
      <section className="bg-red-50 p-6 rounded-xl border border-red-200">
        <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2 text-lg">
            <span>🚑</span> When to Seek Medical Care
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
            {data.redFlags.map((flag, i) => (
                <li key={i} className="flex items-start gap-2 text-red-800 text-sm font-medium">
                    <span className="text-red-500 text-lg">•</span> {flag}
                </li>
            ))}
        </ul>
      </section>

    </div>
  );
};

export default HealthReport;
