import {
  Database,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Table2,
  BarChart3,
} from 'lucide-react';
import type { PageId, AnalysisResult } from '../types';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
  analysisHistory: AnalysisResult[];
}

export default function Dashboard({ onNavigate, analysisHistory }: DashboardProps) {
  const totalAnalyzed = analysisHistory.length;
  const totalIssues = analysisHistory.reduce((acc, r) => {
    let count = 0;
    if (!r.normalForms['3NF'].satisfied) count++;
    if (!r.normalForms.BCNF.satisfied) count++;
    if (!r.normalForms['2NF'].satisfied) count++;
    count += r.anomalies.length;
    return acc + count;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to DBE Doctor</h1>
        <p className="text-violet-100 text-lg mb-6">
          Interactive Database Design Analysis & Normalization Assistant
        </p>
        <p className="text-violet-200 mb-8 max-w-2xl">
          Analyze database table designs, detect anomalies, understand functional dependencies,
          and learn normalization through interactive demonstrations.
        </p>
        <button
          onClick={() => onNavigate('relation-designer')}
          className="bg-white text-violet-700 font-semibold px-6 py-3 rounded-xl hover:bg-violet-50 transition-colors flex items-center gap-2"
        >
          Start Database Analysis
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Database size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalAnalyzed}</p>
              <p className="text-sm text-slate-500">Relations Analyzed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalIssues}</p>
              <p className="text-sm text-slate-500">Design Issues Detected</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {analysisHistory.filter(r => r.normalForms.BCNF.satisfied).length}
              </p>
              <p className="text-sm text-slate-500">BCNF Compliant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('relation-designer')}
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all text-left group"
          >
            <Table2 size={24} className="text-violet-600 mb-3" />
            <h3 className="font-semibold text-slate-800 group-hover:text-violet-700">Analyze a Relation</h3>
            <p className="text-sm text-slate-500 mt-1">Design and analyze your own database schema</p>
          </button>

          <button
            onClick={() => onNavigate('sample-database')}
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all text-left group"
          >
            <Database size={24} className="text-blue-600 mb-3" />
            <h3 className="font-semibold text-slate-800 group-hover:text-violet-700">Try Sample Database</h3>
            <p className="text-sm text-slate-500 mt-1">Load pre-built examples to explore</p>
          </button>

          <button
            onClick={() => onNavigate('learning-center')}
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all text-left group"
          >
            <BookOpen size={24} className="text-green-600 mb-3" />
            <h3 className="font-semibold text-slate-800 group-hover:text-violet-700">Learn Normalization</h3>
            <p className="text-sm text-slate-500 mt-1">Study concepts with examples and quizzes</p>
          </button>

          <button
            onClick={() => onNavigate('analysis-report')}
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all text-left group"
          >
            <BarChart3 size={24} className="text-amber-600 mb-3" />
            <h3 className="font-semibold text-slate-800 group-hover:text-violet-700">View Report</h3>
            <p className="text-sm text-slate-500 mt-1">Generate comprehensive analysis report</p>
          </button>
        </div>
      </div>

      {/* Recent Analysis */}
      {analysisHistory.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Analyses</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Relation</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Attributes</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Normal Form</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analysisHistory.slice(-5).reverse().map((result, i) => {
                  const highestNF = !result.normalForms['1NF'].satisfied ? 'Not 1NF' :
                    !result.normalForms['2NF'].satisfied ? '1NF' :
                    !result.normalForms['3NF'].satisfied ? '2NF' :
                    !result.normalForms.BCNF.satisfied ? '3NF' : 'BCNF';
                  return (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{result.relation.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{result.relation.attributes.length}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          highestNF === 'BCNF' ? 'bg-green-100 text-green-700' :
                          highestNF === '3NF' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {highestNF}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{result.anomalies.length} anomalies</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">About This Project</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Syllabus Mapping</h3>
            <ul className="space-y-1">
              <li>• <strong>Module II:</strong> Relational model, tables, integrity constraints</li>
              <li>• <strong>Module III:</strong> Functional dependencies, Armstrong's axioms, normalization (1NF–5NF), lossless design, dependency preservation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Technology Stack</h3>
            <ul className="space-y-1">
              <li>• React + TypeScript (Frontend)</li>
              <li>• Tailwind CSS (Styling)</li>
              <li>• Lucide Icons (UI Icons)</li>
              <li>• Custom algorithms (Database analysis)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
