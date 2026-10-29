import { Database, ArrowRight, BookOpen } from 'lucide-react';
import type { PageId, AnalysisResult, Relation } from '../types';
import { sampleDatabases } from '../data/samples';
import { analyzeRelation } from '../lib/algorithms';

interface SampleDatabaseProps {
  onNavigate: (page: PageId) => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
  onRelationChange: (relation: Relation) => void;
}

export default function SampleDatabase({ onNavigate, onAnalysisComplete, onRelationChange }: SampleDatabaseProps) {
  const handleLoadSample = (id: string) => {
    const sample = sampleDatabases.find(s => s.id === id);
    if (sample) {
      onRelationChange(sample.relation);
      const result = analyzeRelation(sample.relation);
      onAnalysisComplete(result);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Sample Database Laboratory</h2>
        <p className="text-slate-500">
          Explore pre-built examples to understand database design problems and normalization.
        </p>
      </div>

      {/* Sample Cards */}
      <div className="grid grid-cols-1 gap-6">
        {sampleDatabases.map((sample) => (
          <div key={sample.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0">
                  <Database size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800">{sample.name}</h3>
                  <p className="text-slate-500 mt-1">{sample.description}</p>
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-700">🎯 Purpose:</p>
                    <p className="text-sm text-slate-600 mt-1">{sample.purpose}</p>
                  </div>
                </div>
              </div>

              {/* Schema Preview */}
              <div className="mt-4 p-4 bg-slate-900 rounded-lg">
                <p className="text-green-400 font-mono text-sm">
                  {sample.relation.name}(
                </p>
                <div className="ml-4">
                  {sample.relation.attributes.map((attr, i) => (
                    <p key={attr.name} className="font-mono text-xs text-slate-300">
                      {attr.name} {attr.dataType ? `[${attr.dataType}]` : ''}
                      {attr.isPrimaryKey ? ' <span className="text-amber-400">PRIMARY KEY</span>' : ''}
                      {i < sample.relation.attributes.length - 1 ? ',' : ''}
                    </p>
                  ))}
                </div>
                <p className="text-green-400 font-mono text-sm">)</p>
              </div>

              {/* FDs Preview */}
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Functional Dependencies:</p>
                <div className="flex flex-wrap gap-2">
                  {sample.relation.functionalDependencies.map((fd, i) => (
                    <span key={i} className="px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-lg text-sm font-mono text-violet-700">
                      {'{' + fd.determinant.join(', ') + '}'} → {'{' + fd.dependent.join(', ') + '}'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Data Preview */}
              {sample.relation.sampleData && sample.relation.sampleData.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">Sample Data:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-100">
                        <tr>
                          {sample.relation.attributes.map(a => (
                            <th key={a.name} className="text-left px-3 py-2 font-medium text-slate-600">{a.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sample.relation.sampleData.slice(0, 3).map((row, i) => (
                          <tr key={i}>
                            {sample.relation.attributes.map(a => (
                              <td key={a.name} className="px-3 py-2 font-mono text-slate-600">
                                {String(row[a.name] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-3">
              <button
                onClick={() => handleLoadSample(sample.id)}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors text-sm"
              >
                <Database size={16} /> Load & Analyze
              </button>
              <button
                onClick={() => {
                  handleLoadSample(sample.id);
                  setTimeout(() => onNavigate('normalization'), 100);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors text-sm"
              >
                <BookOpen size={16} /> View Normalization
              </button>
              <button
                onClick={() => {
                  handleLoadSample(sample.id);
                  setTimeout(() => onNavigate('anomaly-detection'), 100);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors text-sm"
              >
                <ArrowRight size={16} /> Detect Anomalies
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
