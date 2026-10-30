import { useState } from 'react';
import { Plus, Trash2, Play, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Relation, Attribute, FunctionalDependency, AnalysisResult, PageId } from '../types';
import { analyzeRelation } from '../lib/algorithms';
import { sampleDatabases } from '../data/samples';

interface RelationDesignerProps {
  onNavigate: (page: PageId) => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
  currentRelation: Relation | null;
  onRelationChange: (relation: Relation) => void;
}

export default function RelationDesigner({ onNavigate, onAnalysisComplete, currentRelation, onRelationChange }: RelationDesignerProps) {
  const [relationName, setRelationName] = useState(currentRelation?.name || '');
  const [attributes, setAttributes] = useState<Attribute[]>(currentRelation?.attributes || [{ name: '', dataType: 'VARCHAR', isPrimaryKey: false }]);
  const [fds, setFds] = useState<FunctionalDependency[]>(currentRelation?.functionalDependencies || []);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState('');

  const addAttribute = () => {
    setAttributes([...attributes, { name: '', dataType: 'VARCHAR', isPrimaryKey: false }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (index: number, field: keyof Attribute, value: string | boolean) => {
    const updated = [...attributes];
    updated[index] = { ...updated[index], [field]: value };
    setAttributes(updated);
  };

  const addFD = () => {
    setFds([...fds, { id: `fd-${Date.now()}`, determinant: [''], dependent: [''] }]);
  };

  const removeFD = (index: number) => {
    setFds(fds.filter((_, i) => i !== index));
  };

  const updateFD = (index: number, field: 'determinant' | 'dependent', value: string[]) => {
    const updated = [...fds];
    updated[index] = { ...updated[index], [field]: value };
    setFds(updated);
  };

  const loadSample = (id: string) => {
    const sample = sampleDatabases.find(s => s.id === id);
    if (sample) {
      setRelationName(sample.relation.name);
      setAttributes([...sample.relation.attributes]);
      setFds([...sample.relation.functionalDependencies]);
      setErrors([]);
      setSuccess(`Loaded "${sample.name}" example successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const validate = (): boolean => {
    const errs: string[] = [];

    if (!relationName.trim()) {
      errs.push('Relation name is required.');
    }

    const validAttrs = attributes.filter(a => a.name.trim());
    if (validAttrs.length === 0) {
      errs.push('At least one attribute is required.');
    }

    // Check for duplicate attribute names
    const names = validAttrs.map(a => a.name.trim().toLowerCase());
    const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
    if (duplicates.length > 0) {
      errs.push(`Duplicate attribute names: ${[...new Set(duplicates)].join(', ')}`);
    }

    // Validate FDs
    const attrNames = validAttrs.map(a => a.name.trim());
    for (const fd of fds) {
      const det = fd.determinant.filter(d => d.trim());
      const dep = fd.dependent.filter(d => d.trim());
      if (det.length === 0) {
        errs.push('A functional dependency must have at least one determinant attribute.');
        break;
      }
      if (dep.length === 0) {
        errs.push('A functional dependency must have at least one dependent attribute.');
        break;
      }
      for (const d of [...det, ...dep]) {
        if (!attrNames.includes(d.trim())) {
          errs.push(`Attribute "${d}" in functional dependency does not exist in the relation.`);
          break;
        }
      }
    }

    setErrors(errs);
    return errs.length === 0;
  };

  const runAnalysis = () => {
    if (!validate()) return;

    const validAttrs = attributes.filter(a => a.name.trim()).map(a => ({
      ...a,
      name: a.name.trim(),
    }));

    const validFds: FunctionalDependency[] = fds
      .filter(fd => fd.determinant.some(d => d.trim()) && fd.dependent.some(d => d.trim()))
      .map(fd => ({
        ...fd,
        determinant: fd.determinant.filter(d => d.trim()).map(d => d.trim()),
        dependent: fd.dependent.filter(d => d.trim()).map(d => d.trim()),
      }));

    const relation: Relation = {
      name: relationName.trim(),
      attributes: validAttrs,
      functionalDependencies: validFds,
    };

    onRelationChange(relation);
    const result = analyzeRelation(relation);
    onAnalysisComplete(result);
    setSuccess('Analysis complete! Navigate to other sections to view results.');
    setTimeout(() => setSuccess(''), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Relation Designer</h2>
          <p className="text-slate-500">Define your relational schema, attributes, and functional dependencies.</p>
        </div>
        <div className="flex gap-2">
          <select
            onChange={(e) => loadSample(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm bg-white"
            defaultValue=""
          >
            <option value="" disabled>Load a sample...</option>
            {sampleDatabases.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Validation Errors</p>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-green-500" />
          <p className="text-green-800 font-medium">{success}</p>
        </div>
      )}

      {/* Relation Name */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Relation Schema</h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={relationName}
            onChange={(e) => setRelationName(e.target.value)}
            placeholder="e.g., STUDENT_COURSE"
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none text-sm"
          />
          <span className="text-slate-400 text-sm">(</span>
          <span className="text-sm text-slate-600">
            {attributes.filter(a => a.name.trim()).map(a => a.name.trim()).join(', ') || '...'}
          </span>
          <span className="text-slate-400 text-sm">)</span>
        </div>
      </div>

      {/* Attributes */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Attributes</h3>
          <button
            onClick={addAttribute}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
          >
            <Plus size={16} /> Add Attribute
          </button>
        </div>

        <div className="space-y-3">
          {attributes.map((attr, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <input
                type="text"
                value={attr.name}
                onChange={(e) => updateAttribute(i, 'name', e.target.value)}
                placeholder="Attribute name"
                className="flex-1 px-3 py-2 rounded-md border border-slate-300 text-sm focus:border-violet-500 outline-none"
              />
              <select
                value={attr.dataType || 'VARCHAR'}
                onChange={(e) => updateAttribute(i, 'dataType', e.target.value)}
                className="px-3 py-2 rounded-md border border-slate-300 text-sm bg-white"
              >
                <option value="VARCHAR">VARCHAR</option>
                <option value="INT">INT</option>
                <option value="DATE">DATE</option>
                <option value="FLOAT">FLOAT</option>
                <option value="TEXT">TEXT</option>
                <option value="BOOLEAN">BOOLEAN</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={attr.isPrimaryKey || false}
                  onChange={(e) => updateAttribute(i, 'isPrimaryKey', e.target.checked)}
                  className="rounded border-slate-300 text-violet-600"
                />
                PK
              </label>
              <button
                onClick={() => removeAttribute(i)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Functional Dependencies */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Functional Dependencies</h3>
          <button
            onClick={addFD}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Plus size={16} /> Add FD
          </button>
        </div>

        <p className="text-sm text-slate-500 mb-4">
          Enter functional dependencies as: Determinant → Dependent. Multiple attributes can be comma-separated.
        </p>

        <div className="space-y-3">
          {fds.map((fd, i) => (
            <div key={fd.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <input
                type="text"
                value={fd.determinant.join(', ')}
                onChange={(e) => updateFD(i, 'determinant', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Determinant (e.g., StudentID)"
                className="flex-1 px-3 py-2 rounded-md border border-slate-300 text-sm focus:border-violet-500 outline-none"
              />
              <span className="text-violet-600 font-bold text-lg">→</span>
              <input
                type="text"
                value={fd.dependent.join(', ')}
                onChange={(e) => updateFD(i, 'dependent', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Dependent (e.g., StudentName)"
                className="flex-1 px-3 py-2 rounded-md border border-slate-300 text-sm focus:border-violet-500 outline-none"
              />
              <button
                onClick={() => removeFD(i)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {fds.length === 0 && (
            <p className="text-center text-slate-400 py-4 text-sm">
              No functional dependencies defined. Add some to enable full analysis.
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={runAnalysis}
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
        >
          <Play size={18} /> Run Analysis
        </button>
        <button
          onClick={() => onNavigate('normalization')}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          View Normalization Results
        </button>
      </div>
    </div>
  );
}
