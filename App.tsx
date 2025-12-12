import React, { useState } from 'react';
import { analyzeHealthData, fileToGenerativePart } from './services/geminiService';
import { HealthAnalysis, Language, PatientProfile, SymptomData, QuestionAnswer } from './types';
import MindMap from './components/MindMap';
import HealthReport from './components/HealthReport';
import Flashcards from './components/Flashcards';
import { KnowledgeQuiz, AdaptiveQuiz } from './components/Quiz';
import Infographic from './components/Infographic';
import PatientForm from './components/PatientForm';
import SymptomForm from './components/SymptomForm';

enum AppStep {
  PATIENT_INFO,
  SYMPTOM_INPUT,
  LOADING_INITIAL,
  ADAPTIVE_QUIZ,
  LOADING_FINAL,
  REPORT_VIEW
}

const App: React.FC = () => {
  // State for Flow Control
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.PATIENT_INFO);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [error, setError] = useState<string | null>(null);

  // Data State
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({});
  const [symptomData, setSymptomData] = useState<SymptomData>({ description: '', duration: '', severity: 'Mild' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Analysis State
  const [initialAnalysis, setInitialAnalysis] = useState<HealthAnalysis | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuestionAnswer[]>([]);
  const [finalResult, setFinalResult] = useState<HealthAnalysis | null>(null);

  // Handlers
  const handleInitialAnalyze = async () => {
    setCurrentStep(AppStep.LOADING_INITIAL);
    setError(null);

    try {
      let filePart;
      if (selectedFile) {
        filePart = await fileToGenerativePart(selectedFile);
      }

      const data = await analyzeHealthData(symptomData, patientProfile, language, filePart);
      setInitialAnalysis(data);
      
      // Decide next step based on AI output
      if (data.isFinalReport) {
        // AI decided it has enough info (unlikely given prompt structure, but possible)
        setFinalResult(data);
        setCurrentStep(AppStep.REPORT_VIEW);
      } else if (data.clarifyingQuestions && data.clarifyingQuestions.length > 0) {
        // Go to Quiz
        setCurrentStep(AppStep.ADAPTIVE_QUIZ);
      } else {
        // Fallback
        setFinalResult(data);
        setCurrentStep(AppStep.REPORT_VIEW);
      }
    } catch (err: any) {
      console.error(err);
      setError("An error occurred. Please try again.");
      setCurrentStep(AppStep.SYMPTOM_INPUT);
    }
  };

  const handleQuizComplete = async (answers: QuestionAnswer[]) => {
    setQuizAnswers(answers);
    setCurrentStep(AppStep.LOADING_FINAL);
    
    try {
      let filePart;
      if (selectedFile) {
        filePart = await fileToGenerativePart(selectedFile);
      }

      const data = await analyzeHealthData(symptomData, patientProfile, language, filePart, answers);
      setFinalResult(data);
      setCurrentStep(AppStep.REPORT_VIEW);
    } catch (err: any) {
        console.error(err);
        setError("An error occurred generating final report.");
        setCurrentStep(AppStep.ADAPTIVE_QUIZ);
    }
  };

  const handleReset = () => {
    // If user didn't consent to storage, clear profile
    if (!patientProfile.storeSession) {
        setPatientProfile({});
    }
    setSymptomData({ description: '', duration: '', severity: 'Mild' });
    setSelectedFile(null);
    setInitialAnalysis(null);
    setFinalResult(null);
    setQuizAnswers([]);
    setCurrentStep(AppStep.PATIENT_INFO);
  };

  if (!disclaimerAccepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-8 text-center animate-fade-in-up">
           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           </div>
           <h1 className="text-2xl font-bold text-slate-900 mb-4">Important Disclaimer</h1>
           <p className="text-slate-600 mb-6 leading-relaxed">
             This AI Medical Assistant is an educational tool <strong>ONLY</strong>. It does not provide medical diagnoses, treatment, or professional advice. 
             <br/><br/>
             <strong>Always consult a qualified healthcare provider for any medical concerns.</strong>
             <br/><br/>
             In a medical emergency, call emergency services immediately.
           </p>
           <button 
             onClick={() => setDisclaimerAccepted(true)}
             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
           >
             I Understand & Accept
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">H</div>
            <div className="flex flex-col">
              <h1 className="font-bold text-xl text-slate-800 leading-none">HealthAware AI</h1>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">Understand Your Symptoms. Take Informed Action.</span>
            </div>
          </div>
          <div className="flex gap-2 text-sm">
             <button onClick={() => setLanguage(Language.ENGLISH)} className={`px-3 py-1 rounded-full transition ${language === Language.ENGLISH ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>ENG</button>
             <button onClick={() => setLanguage(Language.HINDI)} className={`px-3 py-1 rounded-full transition ${language === Language.HINDI ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>HI</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Step 1: Patient Info */}
        {currentStep === AppStep.PATIENT_INFO && (
          <PatientForm 
            profile={patientProfile} 
            onChange={setPatientProfile} 
            onNext={() => setCurrentStep(AppStep.SYMPTOM_INPUT)}
          />
        )}

        {/* Step 2: Symptom Input */}
        {currentStep === AppStep.SYMPTOM_INPUT && (
           <SymptomForm 
             data={symptomData}
             file={selectedFile}
             loading={false}
             onDataChange={setSymptomData}
             onFileChange={setSelectedFile}
             onSubmit={handleInitialAnalyze}
             onBack={() => setCurrentStep(AppStep.PATIENT_INFO)}
           />
        )}

        {/* Loading State */}
        {(currentStep === AppStep.LOADING_INITIAL || currentStep === AppStep.LOADING_FINAL) && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-slate-800">Analyzing Health Data...</h3>
                <p className="text-slate-500 mt-2">Consulting medical knowledge base</p>
            </div>
        )}

        {/* Step 3: Adaptive Quiz */}
        {currentStep === AppStep.ADAPTIVE_QUIZ && initialAnalysis?.clarifyingQuestions && (
             <AdaptiveQuiz 
                questions={initialAnalysis.clarifyingQuestions} 
                onComplete={handleQuizComplete}
                loading={false}
             />
        )}

        {/* Step 4: Final Report View */}
        {currentStep === AppStep.REPORT_VIEW && finalResult && (
          <div className="space-y-8 animate-fade-in">
            
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Health Assessment</h2>
              <button onClick={handleReset} className="text-sm text-blue-600 font-medium hover:underline">Start New Assessment</button>
            </div>

            <Infographic data={finalResult} />

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                 <HealthReport 
                    data={finalResult} 
                    profile={patientProfile}
                    symptoms={symptomData}
                    qa={quizAnswers}
                 />
                 
                 <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Condition Map</h3>
                    <MindMap data={finalResult} />
                 </div>
              </div>

              <div className="space-y-8">
                 <Flashcards cards={finalResult.flashcards} />
                 <KnowledgeQuiz questions={finalResult.knowledgeQuiz} />
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 mt-12 pt-8 border-t border-slate-200">
               <p>Disclaimer: This analysis is generated by AI. It is strictly educational and not a substitute for professional medical advice.</p>
            </div>
          </div>
        )}

        {error && (
            <div className="max-w-md mx-auto mt-8 bg-red-50 border border-red-200 p-4 rounded-lg text-center text-red-700">
                <p className="font-bold">Error</p>
                <p>{error}</p>
                <button onClick={() => setCurrentStep(AppStep.SYMPTOM_INPUT)} className="text-sm underline mt-2">Try Again</button>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;