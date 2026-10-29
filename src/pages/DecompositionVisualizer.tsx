import { GitBranch, ArrowRight, CheckCircle, XCircle, HelpCircle, Link2 } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface DecompositionVisualizerProps {
  analysisResult: AnalysisResult | null;
}

export default function DecompositionVisualizer({ analysisResult }: DecompositionVisualizerProps) {
  if (!analysisResult) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
          <GitBranch size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Decomposition Visualizer</h2>
          <p className="text-slate-500">
            Load a sample database or design a relation first to see decomposition results.
          </p>
        </div>
      </div>
    );
  }

  const { relation, decomposition, candidateKeys } = analysisResult;

  if (!decomposition) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Decomposition Visualizer</h2>
          <p className="text-slate-500">
            Analyzing <span className="font-mono font-semibold text-violet-700">{relation.name}</span>
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">No Decomposition Needed</h3>
          <p className="text-green-700">
            The relation appears to satisfy BCNF based on the declared functional dependencies.
            No decomposition was suggested because no violations were detected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Decomposition Visualizer</h2>
        <p className="text-slate-500">
          Decomposing <span className="font-mono font-semibold text-violet-700">{relation.name}</span>
        </p>
      </div>

      {/* Visual Flow */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Decomposition Flow</h3>
        
        {/* Original Relation */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-lg p-4 bg-slate-100 rounded-xl border-2 border-slate-300 text-center">
            <p className="text-xs text-slate-500 mb-1">Original Relation</p>
            <p className="font-mono font-bold text-slate-800">{relation.name}</p>
            <p className="font-mono text-xs text-slate-600 mt-1">
              ({relation.attributes.map(a => a.name).join(', ')})
            </p>
            <div className="mt-2 flex flex-wrap gap-1 justify-center">
              {relation.attributes.filter(a => a.isPrimaryKey).map(a => (
                <span key={a.name} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                  🔑 {a.name}
                </span>
              ))}
            </div>
          </div>

          <ArrowRight size={24} className="text-violet-500 my-4 rotate-90" />

          {/* Decomposed Relations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {decomposition.relations.map((rel, i) => (
              <div key={i} className="p-4 bg-violet-50 rounded-xl border-2 border-violet-200">
                <p className="text-xs text-violet-500 mb-1">Relation {i + 1}</p>
                <p className="font-mono font-bold text-violet-800">{rel.name}</p>
                <p className="font-mono text-xs text-slate-600 mt-1">
                  ({rel.attributes.map(a => a.name).join(', ')})
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {rel.attributes.filter(a => a.isPrimaryKey).map(a => (
                    <span key={a.name} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                      🔑 {a.name}
                    </span>
                  ))}
                </div>
                {rel.functionalDependencies.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-violet-200">
                    <p className="text-xs text-slate-500 mb-1">FDs in this relation:</p>
                    {rel.functionalDependencies.map((fd, j) => (
                      <p key={j} className="text-xs font-mono text-violet-600">
                        {'{' + fd.determinant.join(',') + '}'} → {'{' + fd.dependent.join(',') + '}'}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Foreign Keys */}
      {decomposition.foreignKeys.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Link2 size={20} className="text-blue-500" />
            Foreign Key Relationships
          </h3>
          <div className="space-y-3">
            {decomposition.foreignKeys.map((fk, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="font-mono text-sm text-blue-800">
                  {fk.from}.{fk.attributes.join(', ')}
                </span>
                <ArrowRight size={16} className="text-blue-500" />
                <span className="font-mono text-sm text-blue-800">
                  {fk.to}.{fk.attributes.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lossless Join Check */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 border-2 ${
          decomposition.isLossless === true ? 'bg-green-50 border-green-300' :
          decomposition.isLossless === false ? 'bg-red-50 border-red-300' :
          'bg-amber-50 border-amber-300'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {decomposition.isLossless === true ? (
              <CheckCircle size={24} className="text-green-500" />
            ) : decomposition.isLossless === false ? (
              <XCircle size={24} className="text-red-500" />
            ) : (
              <HelpCircle size={24} className="text-amber-500" />
            )}
            <h3 className="font-bold text-slate-800">Lossless Join</h3>
          </div>
          <p className="text-sm text-slate-600">{decomposition.losslessExplanation}</p>
          <div className="mt-3 p-2 bg-white/60 rounded text-xs text-slate-500">
            <strong>Test:</strong> For a binary decomposition {`{R1, R2}`}, the join is lossless if R1 ∩ R2 → R1 or R1 ∩ R2 → R2.
          </div>
        </div>

        <div className={`rounded-xl p-6 border-2 ${
          decomposition.preservesDependencies === true ? 'bg-green-50 border-green-300' :
          decomposition.preservesDependencies === false ? 'bg-red-50 border-red-300' :
          'bg-amber-50 border-amber-300'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {decomposition.preservesDependencies === true ? (
              <CheckCircle size={24} className="text-green-500" />
            ) : decomposition.preservesDependencies === false ? (
              <XCircle size={24} className="text-red-500" />
            ) : (
              <HelpCircle size={24} className="text-amber-500" />
            )}
            <h3 className="font-bold text-slate-800">Dependency Preservation</h3>
          </div>
          <p className="text-sm text-slate-600">{decomposition.dependencyExplanation}</p>
          <div className="mt-3 p-2 bg-white/60 rounded text-xs text-slate-500">
            <strong>Test:</strong> Each original FD must have all its attributes in at least one decomposed relation.
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Before vs After Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-red-700 mb-2">❌ Before (Original)</h4>
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="font-mono text-sm text-slate-700">{relation.name}(</p>
              <ul className="ml-4 mt-1">
                {relation.attributes.map(a => (
                  <li key={a.name} className="font-mono text-xs text-slate-600">
                    {a.name} {a.isPrimaryKey ? '🔑' : ''} {a.dataType ? `[${a.dataType}]` : ''}
                  </li>
                ))}
              </ul>
              <p className="font-mono text-sm text-slate-700">)</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-green-700 mb-2">✅ After (Decomposed)</h4>
            <div className="space-y-2">
              {decomposition.relations.map((rel, i) => (
                <div key={i} className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="font-mono text-sm font-semibold text-slate-700">{rel.name}(</p>
                  <ul className="ml-4">
                    {rel.attributes.map(a => (
                      <li key={a.name} className="font-mono text-xs text-slate-600">
                        {a.name} {a.isPrimaryKey ? '🔑' : ''}
                      </li>
                    ))}
                  </ul>
                  <p className="font-mono text-sm text-slate-700">)</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>Important:</strong> This decomposition is illustrative and based on the declared functional dependencies.
          The actual correct decomposition depends on the business rules and data semantics.
          Different sets of FDs may lead to different decompositions.
        </p>
      </div>
    </div>
  );
}
