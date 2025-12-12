import { jsPDF } from "jspdf";
import { HealthAnalysis, PatientProfile, SymptomData, QuestionAnswer } from "../types";

export const generatePDFReport = (
  analysis: HealthAnalysis,
  profile: PatientProfile,
  symptoms: SymptomData,
  qa: QuestionAnswer[]
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;
  const leftMargin = 20;
  const lineHeight = 7;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // Blue
  doc.text("HealthAware AI - Health Report", leftMargin, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, leftMargin, yPos);
  yPos += 15;

  // Disclaimer
  doc.setFontSize(9);
  doc.setTextColor(220, 38, 38); // Red
  doc.setFont("helvetica", "bold");
  doc.text("DISCLAIMER: This is an AI-generated educational report. NOT A MEDICAL DIAGNOSIS.", leftMargin, yPos);
  doc.setFont("helvetica", "normal");
  yPos += 5;
  doc.text("Consult a qualified healthcare provider for medical decisions.", leftMargin, yPos);
  yPos += 15;

  // Patient Info
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Information", leftMargin, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const pText = `Name: ${profile.name || "Anonymous"} | Age: ${profile.age || "N/A"} | Gender: ${profile.gender || "N/A"}`;
  doc.text(pText, leftMargin, yPos);
  yPos += lineHeight;
  if (profile.contact || profile.location) {
     doc.text(`Contact: ${profile.contact || "N/A"} | Location: ${profile.location || "N/A"}`, leftMargin, yPos);
     yPos += lineHeight;
  }
  yPos += 5;

  // Symptom Data
  doc.setFont("helvetica", "bold");
  doc.text("Reported Symptoms", leftMargin, yPos);
  yPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  const descLines = doc.splitTextToSize(`Description: ${symptoms.description}`, pageWidth - 40);
  doc.text(descLines, leftMargin, yPos);
  yPos += (descLines.length * 5) + 5;
  
  doc.text(`Duration: ${symptoms.duration} | Severity: ${symptoms.severity}`, leftMargin, yPos);
  yPos += 10;

  // Quiz Answers (if any)
  if (qa && qa.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Clarifying Questions & Answers", leftMargin, yPos);
      yPos += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      qa.forEach(q => {
          doc.text(`Q: ${q.questionText}`, leftMargin, yPos);
          yPos += 5;
          doc.setTextColor(37, 99, 235);
          doc.text(`A: ${q.answer}`, leftMargin + 5, yPos);
          doc.setTextColor(0);
          yPos += 7;
          if (yPos > 270) { doc.addPage(); yPos = 20; }
      });
      yPos += 10;
  }

  // Analysis
  if (yPos > 250) { doc.addPage(); yPos = 20; }
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Analysis Summary", leftMargin, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const summaryLines = doc.splitTextToSize(analysis.executiveSummary, pageWidth - 40);
  doc.text(summaryLines, leftMargin, yPos);
  yPos += (summaryLines.length * 6) + 10;

  // Risk
  doc.setFont("helvetica", "bold");
  doc.text(`Risk Assessment: ${analysis.riskScore}`, leftMargin, yPos);
  yPos += 7;
  doc.setFont("helvetica", "normal");
  const riskLines = doc.splitTextToSize(analysis.riskExplanation, pageWidth - 40);
  doc.text(riskLines, leftMargin, yPos);
  yPos += (riskLines.length * 6) + 10;

  // Conditions
  doc.setFont("helvetica", "bold");
  doc.text("Possible Considerations", leftMargin, yPos);
  yPos += 8;
  analysis.conditions.forEach(c => {
      doc.setFont("helvetica", "bold");
      doc.text(`• ${c.name} (${c.likelihood})`, leftMargin, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      const relLines = doc.splitTextToSize(c.relevance, pageWidth - 45);
      doc.text(relLines, leftMargin + 5, yPos);
      yPos += (relLines.length * 5) + 5;
      if (yPos > 270) { doc.addPage(); yPos = 20; }
  });

  // Action Plan
  if (yPos > 220) { doc.addPage(); yPos = 20; }
  yPos += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Immediate Actions & Red Flags", leftMargin, yPos);
  yPos += 8;
  
  doc.setTextColor(220, 38, 38); // Red for flags
  analysis.redFlags.forEach(flag => {
      doc.text(`[!] ${flag}`, leftMargin, yPos);
      yPos += 6;
  });
  
  yPos += 5;
  doc.setTextColor(0, 100, 0); // Green for care
  analysis.selfCareSteps.forEach(step => {
      doc.text(`[✓] ${step}`, leftMargin, yPos);
      yPos += 6;
  });

  doc.save(`HealthAware_Report_${new Date().toISOString().slice(0,10)}.pdf`);
};