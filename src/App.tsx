import { useState } from 'react';
import type { PageId, AnalysisResult, Relation } from './types';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RelationDesigner from './pages/RelationDesigner';
import FDAnalyzer from './pages/FDAnalyzer';
import AnomalyDetection from './pages/AnomalyDetection';
import NormalizationWorkbench from './pages/NormalizationWorkbench';
import DecompositionVisualizer from './pages/DecompositionVisualizer';
import SampleDatabase from './pages/SampleDatabase';
import LearningCenter from './pages/LearningCenter';
import AnalysisReport from './pages/AnalysisReport';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [currentRelation, setCurrentRelation] = useState<Relation | null>(null);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setAnalysisHistory(prev => [...prev, result]);
  };

  const handleRelationChange = (relation: Relation) => {
    setCurrentRelation(relation);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={setCurrentPage}
            analysisHistory={analysisHistory}
          />
        );
      case 'relation-designer':
        return (
          <RelationDesigner
            onNavigate={setCurrentPage}
            onAnalysisComplete={handleAnalysisComplete}
            currentRelation={currentRelation}
            onRelationChange={handleRelationChange}
          />
        );
      case 'fd-analyzer':
        return <FDAnalyzer analysisResult={analysisResult} />;
      case 'anomaly-detection':
        return <AnomalyDetection analysisResult={analysisResult} />;
      case 'normalization':
        return <NormalizationWorkbench analysisResult={analysisResult} />;
      case 'decomposition':
        return <DecompositionVisualizer analysisResult={analysisResult} />;
      case 'sample-database':
        return (
          <SampleDatabase
            onNavigate={setCurrentPage}
            onAnalysisComplete={handleAnalysisComplete}
            onRelationChange={handleRelationChange}
          />
        );
      case 'learning-center':
        return <LearningCenter />;
      case 'analysis-report':
        return <AnalysisReport analysisResult={analysisResult} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} analysisHistory={analysisHistory} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
