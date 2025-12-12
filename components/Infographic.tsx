import React from 'react';
import { HealthAnalysis } from '../types';

interface InfographicProps {
  data: HealthAnalysis;
}

const Infographic: React.FC<InfographicProps> = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-300 opacity-20 rounded-full blur-3xl transform -translate-x-10 translate-y-10"></div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-center">
        
        {/* Left: Key Stats */}
        <div className="space-y-6 flex-1">
          <div>
            <h3 className="text-indigo-100 text-sm font-bold uppercase tracking-wide">Primary Insight</h3>
            <p className="text-2xl md:text-3xl font-bold leading-tight mt-1">
              {data.infographicData.keyPoint}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="text-indigo-200 text-xs font-bold uppercase">Top Consideration</div>
            <div className="text-xl font-semibold mt-1">{data.infographicData.topCondition}</div>
          </div>
        </div>

        {/* Right: Actionable */}
        <div className="flex-1 w-full md:w-auto">
          <div className="bg-white text-indigo-900 rounded-xl p-5 shadow-xl">
             <div className="flex items-center gap-3 mb-3 border-b border-indigo-100 pb-3">
                <div className={`w-3 h-3 rounded-full ${data.riskScore === 'High' ? 'bg-red-500' : data.riskScore === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <span className="font-bold text-sm">Action Plan</span>
             </div>
             
             <div className="space-y-3">
                <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Immediate Action</div>
                    <div className="text-sm font-medium">{data.infographicData.immediateAction}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Doctor Visit?</div>
                    <div className="text-sm font-medium">
                        {data.riskScore === 'High' ? 'IMMEDIATELY' : data.riskScore === 'Moderate' ? 'Recommended' : 'Monitor at home'}
                    </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Infographic;
