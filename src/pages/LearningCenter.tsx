import { useState } from 'react';
import { BookOpen, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { learningTopics, quizQuestions } from '../data/samples';

export default function LearningCenter() {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizComplete(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Learning Center</h2>
        <p className="text-slate-500">
          Master database normalization concepts with clear explanations and test your understanding.
        </p>
      </div>

      {/* Topics */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <BookOpen size={20} className="text-violet-500" />
          Study Topics
        </h3>
        {learningTopics.map((topic) => (
          <div key={topic.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <button
              onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
              className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
            >
              <span className="text-2xl">{topic.icon}</span>
              <span className="flex-1 font-semibold text-slate-800">{topic.title}</span>
              {expandedTopic === topic.id ? (
                <ChevronUp size={20} className="text-slate-400" />
              ) : (
                <ChevronDown size={20} className="text-slate-400" />
              )}
            </button>
            {expandedTopic === topic.id && (
              <div className="px-5 pb-5 border-t border-slate-100">
                <div className="mt-4 prose prose-sm max-w-none text-slate-600">
                  {topic.content.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={i} className="font-bold text-slate-800 mt-3">{line.replace(/\*\*/g, '')}</p>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={i} className="ml-4">{line.slice(2)}</li>;
                    }
                    if (line.trim() === '') return <br key={i} />;
                    return <p key={i} className="mt-1">{line}</p>;
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quiz Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">📝 Test Your Understanding</h3>
        
        {!quizStarted && !quizComplete && (
          <div className="text-center py-8">
            <p className="text-slate-600 mb-4">
              Take a quiz with {quizQuestions.length} multiple-choice questions to test your knowledge of database normalization concepts.
            </p>
            <button
              onClick={() => setQuizStarted(true)}
              className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors"
            >
              Start Quiz
            </button>
          </div>
        )}

        {quizStarted && !quizComplete && (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <span className="text-sm font-medium text-violet-600">
                Score: {score}/{currentQuestion + (selectedAnswer !== null ? 1 : 0)}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
              <div
                className="bg-violet-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="mb-6">
              <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded">
                {quizQuestions[currentQuestion].topic}
              </span>
              <h4 className="text-lg font-semibold text-slate-800 mt-3">
                {quizQuestions[currentQuestion].question}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {quizQuestions[currentQuestion].options.map((option, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrect = i === quizQuestions[currentQuestion].correctAnswer;
                const showResult = selectedAnswer !== null;

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      showResult && isCorrect
                        ? 'border-green-400 bg-green-50'
                        : showResult && isSelected && !isCorrect
                        ? 'border-red-400 bg-red-50'
                        : isSelected
                        ? 'border-violet-400 bg-violet-50'
                        : 'border-slate-200 hover:border-violet-300 hover:bg-violet-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        showResult && isCorrect ? 'bg-green-200 text-green-800' :
                        showResult && isSelected ? 'bg-red-200 text-red-800' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {showResult && isCorrect ? <CheckCircle size={16} /> :
                         showResult && isSelected ? <XCircle size={16} /> :
                         String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm text-slate-700">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Explanation:</strong> {quizQuestions[currentQuestion].explanation}
                </p>
              </div>
            )}

            {/* Next Button */}
            {selectedAnswer !== null && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={nextQuestion}
                  className="px-6 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors"
                >
                  {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              </div>
            )}
          </div>
        )}

        {quizComplete && (
          <div className="text-center py-8">
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 ${
              score >= quizQuestions.length * 0.7 ? 'bg-green-100 text-green-600' :
              score >= quizQuestions.length * 0.5 ? 'bg-amber-100 text-amber-600' :
              'bg-red-100 text-red-600'
            }`}>
              {score}/{quizQuestions.length}
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">
              {score >= quizQuestions.length * 0.7 ? '🎉 Excellent!' :
               score >= quizQuestions.length * 0.5 ? '👍 Good effort!' :
               '📚 Keep studying!'}
            </h4>
            <p className="text-slate-600 mb-6">
              You scored {score} out of {quizQuestions.length} questions correctly.
            </p>
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
