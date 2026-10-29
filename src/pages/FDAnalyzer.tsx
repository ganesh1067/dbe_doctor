import { useMemo } from 'react';
import { Key, ArrowRight, Info } from 'lucide-react';
import type { AnalysisResult } from '../types';
import { computeClosure } from '../lib/algorithms';

interface FDAnalyzerProps {
  analysisResult: AnalysisResult | null;
}

export default function FDAnalyzer({ analysisResult }: FDAnalyzerProps) {
  const relation = analysisResult?.relation;
  const fds = relation?.functionalDependencies || [];
  const allAttributes = relation?.attributes.map(a => a.name) || [];

  // Compute closures for all subsets up to size 2
  const closures = useMemo(() => {
    if (!analysisResult) return [];
    const results: { attrs: string[]; closure: string[] }[] = [];
    
    // Single attribute closures
    for (const attr of allAttributes) {
      const closure = computeClosure([attr], fds);
      results.push({ attrs: [attr], closure });
    }
    
    // Composite closures (pairs)
    if (allAttributes.length <= 10) {
      for (let i = 0; i < allAttributes.length; i++) {
        for (let j = i + 1; j < allAttributes.length; j++) {
          const attrs = [allAttributes[i], allAttributes[j]];
          const closure = computeClosure(attrs, fds);
          if (closure.length > attrs.length) {
            results.push({ attrs, closure });
          }
        }
      }
    }
    
    return results;
  }, [analysisResult, allAttributes, fds]);

  if (!analysisResult) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
          <Key size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Functional Dependency Analyzer</h2>
          <p className="text-slate-500">
            Load a sample database or design a relation first to see functional dependency analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Functional Dependency Analyzer</h2>
        <p className="text-slate-500">
          Analyzing <span className="font-mono font-semibold text-violet-700">{relation?.name}</span>
        </p>
      </div>

      {/* Declared FDs */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Declared Functional Dependencies</h3>
        {fds.length > 0 ? (
          <div className="space-y-3">
            {fds.map((fd, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg border border-violet-100">
                <span className="text-sm font-mono">
                  <span className="font-semibold text-violet-800">
                    {'{' + fd.determinant.join(', ') + '}'}
                  </span>
                  <span className="text-violet-500 mx-2">→</span>
                  <span className="font-semibold text-blue-800">
                    {'{' + fd.dependent.join(', ') + '}'}
                  </span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No functional dependencies declared.</p>
        )}
      </div>

      {/* Candidate Keys */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Key size={20} className="text-amber-500" />
          Candidate Keys
        </h3>
        {analysisResult.candidateKeys.length > 0 ? (
          <div className="space-y-3">
            {analysisResult.candidateKeys.map((key, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <span className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-sm font-bold text-amber-800">
                  {i + 1}
                </span>
                <span className="font-mono font-semibold text-amber-800">
                  {'{' + key.join(', ') + '}'}
                </span>
              </div>
            ))}
            <p className="text-sm text-slate-600 mt-3">
              <Info size={14} className="inline mr-1" />
              A candidate key is a <em>minimal</em> set of attributes that uniquely identifies every tuple.
              No proper subset of a candidate key is also a superkey.
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-slate-500">
              {analysisResult.warnings.some(w => w.includes('12 attributes'))
                ? 'Schema too large for exhaustive candidate key search.'
                : 'No candidate keys found. Check your functional dependencies.'}
            </p>
          </div>
        )}
      </div>

      {/* Prime Attributes */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Prime vs Non-Prime Attributes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h4 className="font-medium text-green-800 mb-2">Prime Attributes</h4>
            <p className="text-xs text-green-600 mb-2">Attributes that appear in at least one candidate key</p>
            <div className="flex flex-wrap gap-2">
              {analysisResult.primeAttributes.length > 0 ? (
                analysisResult.primeAttributes.map(attr => (
                  <span key={attr} className="px-2.5 py-1 bg-green-200 text-green-800 rounded-md text-sm font-mono">
                    {attr}
                  </span>
                ))
              ) : (
                <span className="text-sm text-green-600">None identified</span>
              )}
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-medium text-slate-700 mb-2">Non-Prime Attributes</h4>
            <p className="text-xs text-slate-500 mb-2">Attributes not in any candidate key</p>
            <div className="flex flex-wrap gap-2">
              {allAttributes.filter(a => !analysisResult.primeAttributes.includes(a)).map(attr => (
                <span key={attr} className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md text-sm font-mono">
                  {attr}
                </span>
              ))}
              {allAttributes.filter(a => !analysisResult.primeAttributes.includes(a)).length === 0 && (
                <span className="text-sm text-slate-500">None (all attributes are prime)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attribute Closures */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Attribute Closures</h3>
        <p className="text-sm text-slate-500 mb-4">
          The closure X⁺ of attribute set X is the set of all attributes functionally determined by X.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Attribute Set (X)</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Closure (X⁺)</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Superkey?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {closures.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-violet-700">
                    {'{' + c.attrs.join(', ') + '}'}
                  </td>
                  <td className="px-4 py-3 font-mono text-blue-700">
                    {'{' + c.closure.join(', ') + '}'}
                  </td>
                  <td className="px-4 py-3">
                    {c.closure.length === allAttributes.length ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Yes ✓</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-medium">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Armstrong's Axioms */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Armstrong's Axioms — Inferred Dependencies</h3>
        <p className="text-sm text-slate-500 mb-4">
          Using Armstrong's axioms (reflexivity, augmentation, transitivity), we can derive additional dependencies.
        </p>
        <div className="space-y-3">
          {/* Show some inferred dependencies from closures */}
          {closures.filter(c => c.closure.length > c.attrs.length).slice(0, 8).map((c, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-lg text-sm">
              <ArrowRight size={14} className="text-blue-500" />
              <span className="font-mono">
                <span className="text-violet-700">{'{' + c.attrs.join(', ') + '}'}</span>
                <span className="text-slate-400 mx-1">→</span>
                <span className="text-blue-700">
                  {c.closure.filter(a => !c.attrs.includes(a)).join(', ')}
                </span>
              </span>
              <span className="text-xs text-slate-400 ml-auto">(inferred by transitivity/closure)</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-600">
            <strong>Note:</strong> Inferred dependencies are derived from the declared FDs using Armstrong's axioms.
            They are shown for educational purposes. The declared FDs above are the user-provided dependencies.
          </p>
        </div>
      </div>

      {/* Warnings */}
      {analysisResult.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-medium text-amber-800 mb-2">Analysis Warnings</h4>
          <ul className="text-sm text-amber-700 list-disc list-inside">
            {analysisResult.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
