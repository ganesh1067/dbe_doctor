import { CheckCircle, XCircle, HelpCircle, ArrowDown } from 'lucide-react';
import type { AnalysisResult, NormalFormCheck } from '../types';

interface NormalizationWorkbenchProps {
  analysisResult: AnalysisResult | null;
}

function NormalFormCard({ name, check, isActive, isHighest }: { name: string; check: NormalFormCheck; isActive: boolean; isHighest: boolean }) {
  return (
    <div className={`rounded-xl p-5 border-2 transition-all ${
      isHighest ? 'border-green-400 bg-green-50' :
      check.satisfied ? 'border-green-300 bg-green-50' :
      'border-red-300 bg-red-50'
    }`}>
      <div className="flex items-start gap-3">
        {check.satisfied ? (
          <CheckCircle size={24} className="text-green-500 shrink-0" />
        ) : (
          <XCircle size={24} className="text-red-500 shrink-0" />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-800">{name}</h4>
            {isHighest && (
              <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs font-medium">
                Highest achieved
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mt-1">{check.reason}</p>
          
          {check.violations && check.violations.length > 0 && (
            <div className="mt-3 space-y-2">
              {check.violations.map((v, i) => (
                <div key={i} className="p-2 bg-red-100/50 rounded-md text-xs text-red-700 font-mono">
                  {v}
                </div>
              ))}
            </div>
          )}

          {check.details && isActive && (
            <div className="mt-3 p-3 bg-white/60 rounded-md border border-slate-200">
              <p className="text-xs text-slate-600">{check.details}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NormalizationWorkbench({ analysisResult }: NormalizationWorkbenchProps) {
  if (!analysisResult) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
          <ArrowDown size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Normalization Workbench</h2>
          <p className="text-slate-500">
            Load a sample database or design a relation first to analyze its normal form.
          </p>
        </div>
      </div>
    );
  }

  const { normalForms, relation } = analysisResult;

  // Determine highest achieved normal form
  const nfOrder = ['1NF', '2NF', '3NF', 'BCNF', '4NF', '5NF'] as const;
  let highestNF = 'Not 1NF';
  for (const nf of nfOrder) {
    if (normalForms[nf].satisfied) {
      highestNF = nf;
    } else {
      break;
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Normalization Workbench</h2>
        <p className="text-slate-500">
          Analyzing <span className="font-mono font-semibold text-violet-700">{relation.name}</span>
        </p>
      </div>

      {/* Current Status */}
      <div className={`rounded-xl p-6 border-2 ${
        highestNF === 'BCNF' || highestNF === '4NF' || highestNF === '5NF'
          ? 'bg-green-50 border-green-300'
          : highestNF === '3NF'
          ? 'bg-blue-50 border-blue-300'
          : 'bg-amber-50 border-amber-300'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
            highestNF === 'BCNF' || highestNF === '4NF' || highestNF === '5NF'
              ? 'bg-green-200 text-green-800'
              : highestNF === '3NF'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-amber-200 text-amber-800'
          }`}>
            {highestNF === 'Not 1NF' ? '✗' : highestNF}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Current Normal Form: {highestNF}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {highestNF === 'Not 1NF'
                ? 'The relation does not satisfy First Normal Form.'
                : `The relation satisfies ${highestNF} but may not satisfy higher normal forms.`}
            </p>
          </div>
        </div>
      </div>

      {/* Normalization Pathway */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Normalization Pathway</h3>
        <div className="flex flex-col items-center gap-2">
          {nfOrder.map((nf, i) => {
            const check = normalForms[nf];
            const isHighest = nf === highestNF;
            return (
              <div key={nf} className="w-full flex flex-col items-center">
                <NormalFormCard
                  name={nf}
                  check={check}
                  isActive={isHighest}
                  isHighest={isHighest}
                />
                {i < nfOrder.length - 1 && (
                  <div className="flex flex-col items-center py-2">
                    <ArrowDown size={20} className={check.satisfied ? 'text-green-500' : 'text-red-400'} />
                    {!check.satisfied && (
                      <span className="text-xs text-red-500 font-medium mt-1">Stops here</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Explanations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Detailed Analysis</h3>
        <div className="space-y-4">
          {/* 1NF */}
          <div className="p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-700 flex items-center gap-2">
              {normalForms['1NF'].satisfied ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-500" />}
              First Normal Form (1NF)
            </h4>
            <p className="text-sm text-slate-600 mt-2">{normalForms['1NF'].details}</p>
          </div>

          {/* 2NF */}
          <div className="p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-700 flex items-center gap-2">
              {normalForms['2NF'].satisfied ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-500" />}
              Second Normal Form (2NF)
            </h4>
            <p className="text-sm text-slate-600 mt-2">{normalForms['2NF'].details}</p>
            {analysisResult.candidateKeys.some(ck => ck.length > 1) ? (
              <p className="text-xs text-blue-600 mt-2">
                ℹ️ This relation has composite candidate keys, so 2NF analysis is meaningful.
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-2">
                ℹ️ All candidate keys are single-attribute, so 2NF is automatically satisfied if 1NF is satisfied.
              </p>
            )}
          </div>

          {/* 3NF */}
          <div className="p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-700 flex items-center gap-2">
              {normalForms['3NF'].satisfied ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-500" />}
              Third Normal Form (3NF)
            </h4>
            <p className="text-sm text-slate-600 mt-2">{normalForms['3NF'].details}</p>
          </div>

          {/* BCNF */}
          <div className="p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-700 flex items-center gap-2">
              {normalForms.BCNF.satisfied ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-500" />}
              Boyce-Codd Normal Form (BCNF)
            </h4>
            <p className="text-sm text-slate-600 mt-2">{normalForms.BCNF.details}</p>
          </div>

          {/* 4NF */}
          <div className="p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-700 flex items-center gap-2">
              <HelpCircle size={18} className="text-blue-500" />
              Fourth Normal Form (4NF) — Educational
            </h4>
            <p className="text-sm text-slate-600 mt-2">{normalForms['4NF'].details}</p>
            <p className="text-xs text-amber-600 mt-2">
              ⚠️ Full 4NF verification requires explicit multivalued dependency declarations.
            </p>
          </div>

          {/* 5NF */}
          <div className="p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-700 flex items-center gap-2">
              <HelpCircle size={18} className="text-blue-500" />
              Fifth Normal Form (5NF) — Educational
            </h4>
            <p className="text-sm text-slate-600 mt-2">{normalForms['5NF'].details}</p>
            <p className="text-xs text-amber-600 mt-2">
              ⚠️ Full 5NF verification requires explicit join dependency declarations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
