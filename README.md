# DBE Doctor — Interactive Database Anomaly Detection & Normalization System

## Abstract

DBE Doctor is an interactive educational web application designed to help students understand database design principles, detect data anomalies, and learn normalization theory through hands-on analysis. The application provides a complete workflow from defining a relational schema to generating a comprehensive analysis report.

## Problem Statement

Database normalization is a fundamental concept in database engineering, but students often struggle to understand:
- How poorly designed tables cause data anomalies
- How functional dependencies relate to normal forms
- How to decompose relations correctly
- Whether a decomposition is lossless and preserves dependencies

Traditional textbook examples are static and don't allow students to experiment with different schemas and see immediate results.

## Objectives

1. Provide an interactive tool for analyzing relational schemas
2. Detect and demonstrate insertion, update, and deletion anomalies
3. Calculate candidate keys, attribute closures, and superkeys
4. Check normal forms (1NF through BCNF) with clear explanations
5. Suggest and visualize decomposition
6. Verify lossless join and dependency preservation
7. Generate comprehensive analysis reports
8. Provide educational content and self-assessment quizzes

## Scope

### Implemented (Core Features)
- ✅ Relation Designer with attribute and FD input
- ✅ Functional Dependency Analyzer (closures, candidate keys, superkeys)
- ✅ Anomaly Detection Center with interactive examples
- ✅ Normalization Workbench (1NF, 2NF, 3NF, BCNF checks)
- ✅ Decomposition Visualizer
- ✅ Lossless Join and Dependency Preservation checks
- ✅ Sample Database Laboratory (3 built-in examples)
- ✅ Learning Center with topics and quiz
- ✅ Analysis Report generation

### Educational Content Only
- 4NF (requires explicit MVD declarations)
- 5NF (requires explicit JD declarations)

## DBE Syllabus Mapping

### Module II: Relational Model
- Relational model concepts ✅
- Relational tables ✅
- Integrity constraints (primary keys) ✅

### Module III: Normalization
- Functional dependencies ✅
- Armstrong's axioms ✅
- Attribute closure ✅
- Candidate keys and superkeys ✅
- 1NF, 2NF, 3NF, BCNF ✅
- 4NF, 5NF (educational explanations) ✅
- Lossless decomposition ✅
- Dependency preservation ✅

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Build Tool | Vite |
| Algorithms | Custom TypeScript implementation |

## System Architecture

```
src/
├── types/          # TypeScript type definitions
├── lib/
│   └── algorithms.ts  # Core database analysis algorithms
├── data/
│   └── samples.ts     # Sample databases and quiz questions
├── components/
│   └── Layout.tsx     # Application layout with sidebar
├── pages/
│   ├── Dashboard.tsx
│   ├── RelationDesigner.tsx
│   ├── FDAnalyzer.tsx
│   ├── AnomalyDetection.tsx
│   ├── NormalizationWorkbench.tsx
│   ├── DecompositionVisualizer.tsx
│   ├── SampleDatabase.tsx
│   ├── LearningCenter.tsx
│   └── AnalysisReport.tsx
└── App.tsx            # Main application component
```

## Algorithms Implemented

### 1. Attribute Closure
Computes X⁺ for any attribute set X under a given set of FDs.

### 2. Candidate Key Discovery
Uses exhaustive enumeration of attribute subsets (limited to ≤12 attributes for performance).

### 3. Normal Form Checks
- **1NF:** Checks for non-atomic values in sample data
- **2NF:** Detects partial dependencies on composite candidate keys
- **3NF:** Checks for transitive dependencies (non-superkey → non-prime)
- **BCNF:** Checks that every determinant is a superkey

### 4. Lossless Join Test
For binary decomposition: checks if R1 ∩ R2 → R1 or R1 ∩ R2 → R2.

### 5. Dependency Preservation Test
Checks if each original FD's attributes appear together in at least one decomposed relation.

## How to Run

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Type Check
```bash
npm run typecheck
```

## Feature Checklist

- [x] Dashboard with statistics and quick actions
- [x] Relation Designer with attribute and FD input
- [x] Load sample databases
- [x] Functional dependency analysis
- [x] Attribute closure computation
- [x] Candidate key discovery
- [x] Superkey identification
- [x] Prime/non-prime attribute classification
- [x] Armstrong's axioms demonstration
- [x] Update anomaly detection and explanation
- [x] Insertion anomaly detection and explanation
- [x] Deletion anomaly detection and explanation
- [x] 1NF check
- [x] 2NF check
- [x] 3NF check
- [x] BCNF check
- [x] 4NF educational explanation
- [x] 5NF educational explanation
- [x] Normalization pathway visualization
- [x] Decomposition suggestion
- [x] Lossless join verification
- [x] Dependency preservation check
- [x] Foreign key identification
- [x] Before/after comparison
- [x] Sample database laboratory (3 examples)
- [x] Learning center with 10 topics
- [x] Quiz with 10 questions and instant feedback
- [x] Analysis report generation
- [x] Print/export support
- [x] Responsive design (mobile, tablet, desktop)
- [x] Error handling and validation
- [x] Professional UI with sidebar navigation

## Limitations

1. Candidate key discovery is limited to schemas with ≤12 attributes
2. 4NF and 5NF require explicit MVD/JD declarations (educational explanations provided)
3. Superkey enumeration is limited to ≤10 attributes
4. Analysis is based on declared FDs, not inferred from sample data
5. Decomposition suggestions are heuristic-based, not exhaustive

## Future Enhancements

- Multi-valued dependency input and 4NF verification
- Join dependency input and 5NF verification
- SQL schema import/export
- Visual dependency graph (DAG)
- Interactive decomposition builder
- More sample databases
- Collaborative analysis features
- Backend persistence with SQLite

## College Presentation Outline

1. **Introduction** — What is DBE Doctor?
2. **Problem Statement** — Why do we need this tool?
3. **Objectives** — What does it accomplish?
4. **Methodology** — How does it work? (algorithms)
5. **Live Demonstration**
   - Load University Enrollment example
   - Show sample data and FDs
   - Detect anomalies
   - Analyze normal forms
   - Show decomposition
   - Verify lossless join and dependency preservation
6. **Results** — Analysis report
7. **Limitations** — What it cannot do yet
8. **Future Scope** — Planned improvements
9. **Conclusion** — Summary and learning outcomes

## License

Educational project for B.Tech Computer Science — Database Engineering course.
