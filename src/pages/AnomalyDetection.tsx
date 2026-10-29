import { useState } from 'react';
import { AlertTriangle, RefreshCw, XCircle, PlusCircle, Edit3 } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface AnomalyDetectionProps {
  analysisResult: AnalysisResult | null;
}

export default function AnomalyDetection({ analysisResult }: AnomalyDetectionProps) {
  const [activeAnomaly, setActiveAnomaly] = useState<'update' | 'insertion' | 'deletion' | null>(null);
  const [showDecomposed, setShowDecomposed] = useState(false);

  if (!analysisResult) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
          <AlertTriangle size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Anomaly Detection Center</h2>
          <p className="text-slate-500">
            Load a sample database or design a relation first to detect anomalies.
          </p>
        </div>
      </div>
    );
  }

  const { relation, anomalies, decomposition } = analysisResult;
  const sampleData = relation.sampleData || [];
  const attrs = relation.attributes.map(a => a.name);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Anomaly Detection Center</h2>
        <p className="text-slate-500">
          Exploring data anomalies in <span className="font-mono font-semibold text-violet-700">{relation.name}</span>
        </p>
      </div>

      {/* Sample Data Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Current Relation Data</h3>
          <button
            onClick={() => setShowDecomposed(!showDecomposed)}
            className="text-sm px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
          >
            {showDecomposed ? 'Show Original' : 'Show Decomposed View'}
          </button>
        </div>

        {!showDecomposed && sampleData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {attrs.map(attr => (
                    <th key={attr} className="text-left px-4 py-3 font-medium text-slate-600 whitespace-nowrap">
                      {attr}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    {attrs.map(attr => (
                      <td key={attr} className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                        {String(row[attr] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showDecomposed && decomposition && (
          <div className="space-y-4">
            {decomposition.relations.map((rel, i) => (
              <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 font-semibold text-sm text-slate-700">
                  {rel.name}({rel.attributes.map(a => a.name).join(', ')})
                </div>
                {sampleData.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50">
                        <tr>
                          {rel.attributes.map(a => (
                            <th key={a.name} className="text-left px-3 py-2 text-slate-600">{a.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sampleData.map((row, j) => {
                          const relAttrs = rel.attributes.map(a => a.name);
                          // Check if this row has data for this relation
                          const hasData = relAttrs.some(a => row[a] !== undefined);
                          if (!hasData) return null;
                          return (
                            <tr key={j} className="hover:bg-slate-50">
                              {relAttrs.map(attr => (
                                <td key={attr} className="px-3 py-2 font-mono">
                                  {String(row[attr] ?? '')}
                                </td>
                              ))}
                            </tr>
                          );
                        }).filter(Boolean)}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showDecomposed && !decomposition && (
          <p className="text-slate-500 text-sm">
            No decomposition available. The relation may already be in BCNF, or no anomalies were detected that suggest decomposition.
          </p>
        )}
      </div>

      {/* Anomaly Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveAnomaly('update')}
          className={`p-5 rounded-xl border-2 text-left transition-all ${
            activeAnomaly === 'update'
              ? 'border-amber-400 bg-amber-50 shadow-md'
              : 'border-slate-200 bg-white hover:border-amber-200'
          }`}
        >
          <Edit3 size={24} className="text-amber-500 mb-2" />
          <h4 className="font-semibold text-slate-800">Update Anomaly</h4>
          <p className="text-sm text-slate-500 mt-1">Same data stored in multiple rows requires multiple updates</p>
        </button>

        <button
          onClick={() => setActiveAnomaly('insertion')}
          className={`p-5 rounded-xl border-2 text-left transition-all ${
            activeAnomaly === 'insertion'
              ? 'border-blue-400 bg-blue-50 shadow-md'
              : 'border-slate-200 bg-white hover:border-blue-200'
          }`}
        >
          <PlusCircle size={24} className="text-blue-500 mb-2" />
          <h4 className="font-semibold text-slate-800">Insertion Anomaly</h4>
          <p className="text-sm text-slate-500 mt-1">Cannot add certain facts without adding unrelated data</p>
        </button>

        <button
          onClick={() => setActiveAnomaly('deletion')}
          className={`p-5 rounded-xl border-2 text-left transition-all ${
            activeAnomaly === 'deletion'
              ? 'border-red-400 bg-red-50 shadow-md'
              : 'border-slate-200 bg-white hover:border-red-200'
          }`}
        >
          <XCircle size={24} className="text-red-500 mb-2" />
          <h4 className="font-semibold text-slate-800">Deletion Anomaly</h4>
          <p className="text-sm text-slate-500 mt-1">Deleting one fact accidentally removes other important data</p>
        </button>
      </div>

      {/* Anomaly Details */}
      {activeAnomaly && (
        <div className={`rounded-xl p-6 border-2 ${
          activeAnomaly === 'update' ? 'bg-amber-50 border-amber-200' :
          activeAnomaly === 'insertion' ? 'bg-blue-50 border-blue-200' :
          'bg-red-50 border-red-200'
        }`}>
          {(() => {
            const anomaly = anomalies.find(a => a.type === activeAnomaly);
            if (!anomaly) {
              return (
                <div className="text-center py-4">
                  <RefreshCw size={24} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-slate-600">
                    No {activeAnomaly} anomaly was detected in this relation based on the declared functional dependencies.
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    This may indicate the relation is already well-designed, or that the declared dependencies do not reveal this type of anomaly.
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800">{anomaly.title}</h3>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-1">What is the problem?</h4>
                    <p className="text-sm text-slate-600">{anomaly.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-1">Concrete Example</h4>
                    <p className="text-sm text-slate-600 bg-white/60 p-3 rounded-lg">{anomaly.example}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-1">Impact</h4>
                    <p className="text-sm text-slate-600">{anomaly.impact}</p>
                  </div>

                  {decomposition && (
                    <div className="mt-4 p-4 bg-white/60 rounded-lg border border-slate-200">
                      <h4 className="font-semibold text-green-700 mb-2">How Decomposition Helps</h4>
                      <p className="text-sm text-slate-600">
                        By decomposing the original relation into smaller, focused relations, each fact is stored in exactly one place.
                        This eliminates the {activeAnomaly} anomaly because:
                      </p>
                      <ul className="text-sm text-slate-600 mt-2 list-disc list-inside">
                        <li>Each entity has its own dedicated table</li>
                        <li>Information is not duplicated across rows</li>
                        <li>Updates, insertions, and deletions affect only the relevant table</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Anomaly Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
            <p className="font-medium text-amber-800">Update Anomalies</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {anomalies.filter(a => a.type === 'update').length > 0 ? '⚠️ Detected' : '✅ None'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <p className="font-medium text-blue-800">Insertion Anomalies</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {anomalies.filter(a => a.type === 'insertion').length > 0 ? '⚠️ Detected' : '✅ None'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-red-50 border border-red-100">
            <p className="font-medium text-red-800">Deletion Anomalies</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {anomalies.filter(a => a.type === 'deletion').length > 0 ? '⚠️ Detected' : '✅ None'}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Note: Anomaly detection depends on the declared schema, functional dependencies, and intended data semantics.
          Not every table necessarily suffers from all three types of anomalies.
        </p>
      </div>
    </div>
  );
}
