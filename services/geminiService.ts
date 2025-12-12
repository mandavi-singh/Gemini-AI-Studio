import { GoogleGenAI, Type, Schema } from "@google/genai";
import { HealthAnalysis, Language, PatientProfile, SymptomData, QuestionAnswer } from "../types";

const SYSTEM_INSTRUCTION = `
You are "HealthAware AI" — a symptom-awareness and health-guidance assistant.
Tagline: "Understand Your Symptoms. Take Informed Action."

IMPORTANT: You are NOT a doctor. You DO NOT diagnose. 
You provide educational, awareness-oriented general health information only.
Always prioritize safety. If symptoms suggest an emergency, emphasize seeking immediate care.
Always include: "This is not medical advice. Consult a qualified healthcare professional."

Your task is to analyze the provided symptoms (text, image, or medical report) and generate a structured JSON response.

Input:
- Patient Info (optional)
- Symptoms, Duration, Severity
- (Optional) Answers to previous clarifying questions

Output Structure Requirements:
1. Extract key symptoms.
2. List POSSIBLE conditions (differential diagnosis logic, strictly educational).
3. Assign a Risk Score (Low/Moderate/High).
4. Provide immediate self-care.
5. List medication cautions.
6. List Red Flags (Seek medical care).
7. Create study materials (Flashcards and Educational Quiz).
8. Generate Clarifying Questions (if this is the first pass).

Language: Respond in the language requested by the user.
Tone: Professional, empathetic, clear (10th-12th grade reading level).
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: { type: Type.STRING, description: "A brief 2-3 sentence overview of the analysis." },
    extractedSymptoms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of identified symptoms." },
    conditions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          likelihood: { type: Type.STRING, description: "e.g., Most Likely, Possible, Unlikely" },
          relevance: { type: Type.STRING, description: "Why this condition is considered, referencing user answers if available." },
          matchingSymptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
          nonMatchingSymptoms: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    },
    riskScore: { type: Type.STRING, enum: ["Low", "Moderate", "High"] },
    riskExplanation: { type: Type.STRING, description: "1-2 sentences explaining the risk level based on specific inputs." },
    selfCareSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Immediate home care advice." },
    medicationCaution: { type: Type.ARRAY, items: { type: Type.STRING }, description: "What to avoid or use with caution." },
    redFlags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Signs to seek immediate medical help." },
    infographicData: {
      type: Type.OBJECT,
      properties: {
        keyPoint: { type: Type.STRING, description: "One main takeaway." },
        topCondition: { type: Type.STRING, description: "The most relevant condition discussed." },
        immediateAction: { type: Type.STRING, description: "The most important next step." }
      }
    },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING }
        }
      }
    },
    knowledgeQuiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
          explanation: { type: Type.STRING }
        }
      }
    },
    isFinalReport: { type: Type.BOOLEAN, description: "True if based on clarifying questions, False if initial pass." },
    clarifyingQuestions: {
      type: Type.ARRAY,
      description: "5-8 context-specific questions to ask the patient to narrow down possibilities. Empty if isFinalReport is true.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          text: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Simple options like Yes, No, Maybe, or specific values." }
        }
      }
    }
  }
};

export const analyzeHealthData = async (
  symptomData: SymptomData,
  patientProfile: PatientProfile,
  language: Language,
  file?: { data: string; mimeType: string },
  previousAnswers?: QuestionAnswer[]
): Promise<HealthAnalysis> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  const isFollowUp = !!(previousAnswers && previousAnswers.length > 0);

  let promptText = `
    Analyze the following health context.
    User Language Preference: ${language}.
    
    Patient Profile (Optional):
    - Name: ${patientProfile.name || "Anonymous"}
    - Age: ${patientProfile.age || "Not provided"}
    - Gender: ${patientProfile.gender || "Not provided"}
    - Location: ${patientProfile.location || "Not provided"}

    Symptom Input:
    - Description: "${symptomData.description}"
    - Duration: ${symptomData.duration}
    - Severity: ${symptomData.severity}
    
    ${file ? "A file (Image or PDF) is attached containing medical reports or visual symptoms." : ""}
  `;

  if (isFollowUp) {
    promptText += `
    
    USER ANSWERS TO CLARIFYING QUESTIONS:
    ${previousAnswers.map(a => `- Q: ${a.questionText} \n  A: ${a.answer}`).join('\n')}

    TASK:
    Based on the original symptoms AND the user's answers to the clarifying questions, provide a FINAL detailed health report.
    Set "isFinalReport" to TRUE.
    Leave "clarifyingQuestions" empty.
    Refine the risk score and potential conditions based on the new information.
    `;
  } else {
    promptText += `
    
    TASK:
    Perform an initial analysis.
    Set "isFinalReport" to FALSE.
    Generate 5-8 "clarifyingQuestions" that would help narrow down the possibilities or assess severity (e.g., asking about fever, travel history, specific pain nature).
    `;
  }

  const parts: any[] = [{ text: promptText }];
  
  if (file) {
    parts.push({
      inlineData: {
        data: file.data,
        mimeType: file.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      role: "user",
      parts: parts
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.4 
    }
  });

  const responseText = response.text;
  if (!responseText) throw new Error("No response from AI");

  return JSON.parse(responseText) as HealthAnalysis;
};

// Helper to convert File to Base64
export const fileToGenerativePart = (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        data: base64Data,
        mimeType: file.type
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};