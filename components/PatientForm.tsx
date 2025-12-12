import React from 'react';
import { PatientProfile } from '../types';

interface PatientFormProps {
  profile: PatientProfile;
  onChange: (profile: PatientProfile) => void;
  onNext: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ profile, onChange, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        onChange({ ...profile, [name]: (e.target as HTMLInputElement).checked });
    } else {
        onChange({ ...profile, [name]: value });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Patient Profile <span className="text-sm font-normal text-slate-500">(Optional)</span></h2>
      <p className="text-slate-500 mb-6 text-sm">Providing these details helps the AI tailor the insights to your specific demographic. You can skip any field.</p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input 
            type="text" 
            name="name" 
            value={profile.name || ''} 
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
          <input 
            type="text" 
            name="age" 
            value={profile.age || ''} 
            onChange={handleChange}
            placeholder="e.g. 35"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
          <select 
            name="gender" 
            value={profile.gender || ''} 
            onChange={handleChange}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
          >
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
          <input 
            type="text" 
            name="location" 
            value={profile.location || ''} 
            onChange={handleChange}
            placeholder="City, Country"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
          />
        </div>
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact (Phone/Email)</label>
            <input 
              type="text" 
              name="contact" 
              value={profile.contact || ''} 
              onChange={handleChange}
              placeholder="Optional contact info for report"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
            />
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8 bg-blue-50 p-4 rounded-lg">
        <input 
          type="checkbox" 
          name="storeSession" 
          id="storeSession"
          checked={profile.storeSession || false} 
          onChange={handleChange}
          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
        />
        <label htmlFor="storeSession" className="text-sm text-slate-700">
           I consent to using this information for this session's report generation. <br/>
           <span className="text-xs text-slate-500">Unchecked data will not be persisted.</span>
        </label>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
        >
          Next: Describe Symptoms &rarr;
        </button>
      </div>
    </div>
  );
};

export default PatientForm;
