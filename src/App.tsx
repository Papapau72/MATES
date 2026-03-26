/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Star,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---
type Operation = '+' | '-' | '*' | '/';

interface Question {
  expression: string;
  answer: number;
  steps: string[];
}

// --- Math Logic ---
const generateQuestion = (level: number): Question => {
  // 5th Grade Level: Combined operations with parentheses
  // Hierarchy: Parentheses -> Mul/Div -> Add/Sub
  
  const ops: Operation[] = ['+', '-', '*', '/'];
  
  const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Simple generator for 5th grade
  // Pattern 1: (a + b) * c
  // Pattern 2: a * b + c / d
  // Pattern 3: a + (b * c) - d
  
  const pattern = getRandomInt(1, 3);
  let expression = '';
  let answer = 0;

  if (pattern === 1) {
    const a = getRandomInt(2, 20);
    const b = getRandomInt(2, 20);
    const c = getRandomInt(2, 10);
    expression = `(${a} + ${b}) × ${c}`;
    answer = (a + b) * c;
  } else if (pattern === 2) {
    const a = getRandomInt(2, 12);
    const b = getRandomInt(2, 10);
    const d = getRandomInt(2, 10);
    const c = d * getRandomInt(2, 10); // Ensure integer division
    expression = `${a} × ${b} + ${c} ÷ ${d}`;
    answer = (a * b) + (c / d);
  } else {
    const b = getRandomInt(2, 10);
    const c = getRandomInt(2, 10);
    const a = getRandomInt(b * c, 100);
    const d = getRandomInt(2, 20);
    expression = `${a} - (${b} × ${c}) + ${d}`;
    answer = a - (b * c) + d;
  }

  return {
    expression,
    answer,
    steps: [] // We could add steps for hints later
  };
};

export default function App() {
  const [gameState, setGameState] = useState<'home' | 'playing' | 'result'>('home');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [streak, setStreak] = useState(0);

  const startNewGame = () => {
    setScore(0);
    setQuestionCount(0);
    setStreak(0);
    nextQuestion();
    setGameState('playing');
  };

  const nextQuestion = useCallback(() => {
    const q = generateQuestion(1);
    setCurrentQuestion(q);
    setUserAnswer('');
    setFeedback(null);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || feedback) return;

    const numericAnswer = parseInt(userAnswer);
    if (numericAnswer === currentQuestion.answer) {
      setFeedback('correct');
      setScore(s => s + 1);
      setStreak(s => s + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#15803d', '#f59e0b', '#ffffff']
      });
    } else {
      setFeedback('incorrect');
      setStreak(0);
    }

    setQuestionCount(c => c + 1);
  };

  const handleNext = () => {
    if (questionCount >= 10) {
      setGameState('result');
    } else {
      nextQuestion();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Header / Logo Section */}
      <header className="fixed top-0 left-0 w-full p-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
            {/* Placeholder for the school logo provided by user */}
            <img 
              src="https://raw.githubusercontent.com/pbenlar/ceip-gloria-fuertes-logo/main/logo.png" 
              alt="Logo CEIP Gloria Fuertes" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback if the URL doesn't work (since I don't have a real URL yet)
                (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/school/100/100';
              }}
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary leading-tight">CEIP Gloria Fuertes</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Córdoba • 5º Primaria</p>
          </div>
        </div>
        
        {gameState === 'playing' && (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 uppercase">Puntos</span>
              <span className="text-xl font-bold text-primary">{score}</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 uppercase">Racha</span>
              <span className="text-xl font-bold text-accent">🔥 {streak}</span>
            </div>
          </div>
        )}
      </header>

      <main className="w-full max-w-2xl mt-20">
        <AnimatePresence mode="wait">
          {gameState === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="math-card text-center space-y-8"
            >
              <div className="inline-flex p-4 bg-green-50 rounded-full text-primary mb-2">
                <GraduationCap size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-slate-900">¡Genio de las Mates!</h2>
                <p className="text-slate-600 text-lg max-w-md mx-auto">
                  Demuestra lo que sabes sobre operaciones combinadas. ¿Estás listo para el reto?
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-primary flex items-center gap-2 mb-1">
                    <CheckCircle2 size={18} /> Jerarquía
                  </h3>
                  <p className="text-sm text-slate-500">Paréntesis, luego ×/÷ y al final +/-.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-primary flex items-center gap-2 mb-1">
                    <Star size={18} /> 10 Retos
                  </h3>
                  <p className="text-sm text-slate-500">Resuelve 10 operaciones para ganar tu trofeo.</p>
                </div>
              </div>

              <button 
                onClick={startNewGame}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Empezar Desafío <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && currentQuestion && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="math-card space-y-8"
            >
              <div className="flex justify-between items-center">
                <span className="px-4 py-1 bg-slate-100 rounded-full text-sm font-bold text-slate-500">
                  Pregunta {questionCount + 1} de 10
                </span>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 w-4 rounded-full transition-colors ${
                        i < questionCount ? 'bg-primary' : 'bg-slate-200'
                      }`} 
                    />
                  ))}
                </div>
              </div>

              <div className="py-12 text-center">
                <motion.h3 
                  key={currentQuestion.expression}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-6xl font-bold text-slate-800 tracking-tight"
                >
                  {currentQuestion.expression}
                </motion.h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input 
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={!!feedback}
                    placeholder="Escribe tu respuesta..."
                    className={`w-full text-center text-3xl font-bold p-6 rounded-2xl border-4 transition-all outline-none
                      ${feedback === 'correct' ? 'border-primary bg-green-50 text-primary' : 
                        feedback === 'incorrect' ? 'border-red-500 bg-red-50 text-red-500' : 
                        'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'}
                    `}
                    autoFocus
                  />
                  {feedback === 'correct' && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                    >
                      <CheckCircle2 size={40} />
                    </motion.div>
                  )}
                  {feedback === 'incorrect' && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500"
                    >
                      <XCircle size={40} />
                    </motion.div>
                  )}
                </div>

                {!feedback ? (
                  <button 
                    type="submit"
                    disabled={!userAnswer}
                    className="btn-primary w-full disabled:opacity-50 disabled:scale-100"
                  >
                    Comprobar
                  </button>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className={`p-4 rounded-2xl text-center font-bold ${
                      feedback === 'correct' ? 'bg-green-100 text-primary' : 'bg-red-100 text-red-600'
                    }`}>
                      {feedback === 'correct' ? '¡Excelente trabajo!' : `¡Casi! La respuesta era ${currentQuestion.answer}`}
                    </div>
                    <button 
                      type="button"
                      onClick={handleNext}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      Siguiente <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}
              </form>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="math-card text-center space-y-8"
            >
              <div className="relative inline-block">
                <Trophy size={80} className="text-accent mx-auto" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 text-primary"
                >
                  <Star size={32} fill="currentColor" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-slate-900">¡Reto Completado!</h2>
                <p className="text-slate-500 text-lg">Has terminado tu sesión de práctica.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-green-50 rounded-3xl border border-green-100">
                  <span className="block text-sm font-bold text-green-600 uppercase mb-1">Aciertos</span>
                  <span className="text-4xl font-bold text-primary">{score} / 10</span>
                </div>
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                  <span className="block text-sm font-bold text-amber-600 uppercase mb-1">Nota</span>
                  <span className="text-4xl font-bold text-accent">{(score * 10).toFixed(0)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={startNewGame}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} /> Jugar de nuevo
                </button>
                <button 
                  onClick={() => setGameState('home')}
                  className="btn-secondary w-full"
                >
                  Volver al inicio
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-12 text-slate-400 text-sm font-medium">
        © 2026 CEIP Gloria Fuertes • Córdoba
      </footer>
    </div>
  );
}
