import { useState } from 'react';
import {
  LayoutDashboard,
  Table2,
  Link2,
  AlertTriangle,
  Layers,
  GitBranch,
  Database,
  BookOpen,
  FileText,
  Menu,
  X,
  Stethoscope,
} from 'lucide-react';
import type { PageId } from '../types';

interface LayoutProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  children: React.ReactNode;
}

const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'relation-designer', label: 'Relation Designer', icon: <Table2 size={20} /> },
  { id: 'fd-analyzer', label: 'FD Analyzer', icon: <Link2 size={20} /> },
  { id: 'anomaly-detection', label: 'Anomaly Detection', icon: <AlertTriangle size={20} /> },
  { id: 'normalization', label: 'Normalization', icon: <Layers size={20} /> },
  { id: 'decomposition', label: 'Decomposition', icon: <GitBranch size={20} /> },
  { id: 'sample-database', label: 'Sample Database', icon: <Database size={20} /> },
  { id: 'learning-center', label: 'Learning Center', icon: <BookOpen size={20} /> },
  { id: 'analysis-report', label: 'Analysis Report', icon: <FileText size={20} /> },
];

export default function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Stethoscope size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">DBE Doctor</h1>
              <p className="text-xs text-slate-400">Database Design Analysis</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === item.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-500 text-center">
            <p>B.Tech CSE — Database Engineering</p>
            <p className="mt-1">Module II & III Project</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 mr-4"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {navItems.find(n => n.id === currentPage)?.label || 'Dashboard'}
            </h2>
            <p className="text-xs text-slate-500">
              Interactive Database Anomaly Detection & Normalization System
            </p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
