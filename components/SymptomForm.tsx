import React, { useRef } from 'react';
import { SymptomData } from '../types';

interface SymptomFormProps {
  data: SymptomData;
  file: File | null;
  loading: boolean;
  onDataChange: (data: SymptomData) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const SymptomForm: React.FC<SymptomFormProps> = ({ 
  data, file, loading, onDataChange, onFileChange, onSubmit, onBack 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onDataChange({ ...data, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in-up">
       <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1 transition">
         &larr; Back to Patient Info
       </button>
       
       <h2 className="text-2xl font-bold text-slate-800 mb-6">Describe Symptoms</h2>

       <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">What are your symptoms?</label>
            <textarea 
                name="description"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none h-32 transition"
                placeholder="E.g. I have a throbbing headache on the left side, sensitive to light. I also feel a bit nauseous."
                value={data.description}
                onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                <input 
                  type="text"
                  name="duration"
                  placeholder="e.g. 2 days, 1 week"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  value={data.duration}
                  onChange={handleChange}
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Severity</label>
                <select 
                  name="severity"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  value={data.severity}
                  onChange={handleChange}
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">Attachments (Optional)</label>
             <div className="flex items-center gap-4">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*,.pdf"
                    onChange={handleFile}
                    className="hidden"
                    id="file-upload"
                />
                <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition"
                >
                    <span>📎</span> {file ? file.name : "Upload Lab Report / Image"}
                </label>
                {file && (
                    <button onClick={() => onFileChange(null)} className="text-red-500 text-sm hover:underline">Remove</button>
                )}
             </div>
          </div>

          <button 
             onClick={onSubmit}
             disabled={loading || !data.description}
             className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
           >
             {loading ? (
               <>
                 <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Analyzing Symptoms...
               </>
             ) : "Start Health Assessment"}
           </button>
       </div>
    </div>
  );
};

export default SymptomForm;
