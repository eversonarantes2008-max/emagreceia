import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Flame } from 'lucide-react';
import { Exercise } from '../types';

interface WorkoutTimerProps {
  exercises: Exercise[];
  onComplete?: () => void;
}

export function WorkoutTimer({ exercises, onComplete }: WorkoutTimerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // Default 30s
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentExercise = exercises[currentIdx];

  // Initialize time when exercise or rest changes
  useEffect(() => {
    if (!currentExercise) return;

    if (isResting) {
      // Parse resting time (e.g. "45s" -> 45)
      const restSeconds = parseInt(currentExercise.descanso) || 30;
      setTimeLeft(restSeconds);
    } else {
      // Parse duration time if it specifies seconds (e.g., "45 segundos" -> 45). Otherwise default to 45s for standard reps
      const isSeconds = currentExercise.repeticoes.includes('segundo') || currentExercise.repeticoes.includes('s');
      if (isSeconds) {
        setTimeLeft(parseInt(currentExercise.repeticoes) || 45);
      } else {
        setTimeLeft(45); // Default 45s for executing reps
      }
    }
  }, [currentIdx, isResting, currentSet, currentExercise]);

  // Countdown clock loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerEnd();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleTimerEnd = () => {
    // Play sound beep
    if (soundEnabled) {
      playBeep();
    }

    if (isResting) {
      // Rest is over, start next set or move to next exercise
      setIsResting(false);
      if (currentSet < currentExercise.series) {
        setCurrentSet((prev) => prev + 1);
      } else {
        // Next exercise
        if (currentIdx < exercises.length - 1) {
          setCurrentIdx((prev) => prev + 1);
          setCurrentSet(1);
        } else {
          // All workouts done!
          setIsActive(false);
          if (onComplete) onComplete();
        }
      }
    } else {
      // Exercise set completed, start rest
      setIsResting(true);
    }
  };

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(isResting ? 880 : 440, audioCtx.currentTime); // High pitch for work start, lower for rest
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Browsers block autoplay context
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentExercise) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-1 rounded-full">
          <Flame className="w-3.5 h-3.5 fill-current" />
          Cronômetro Interativo
        </span>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      <div className="text-center py-4">
        <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-1">
          {isResting ? 'Descanso Ativo' : currentExercise.nome}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isResting 
            ? `Prepare-se para a Série ${currentSet}` 
            : `Série ${currentSet} de ${currentExercise.series} • Meta: ${currentExercise.repeticoes}`}
        </p>

        {/* Big Countdown Timer Display */}
        <div className={`my-6 font-mono text-5xl font-bold tracking-tight transition-colors duration-300 ${
          isResting ? 'text-amber-500' : 'text-blue-600 dark:text-blue-400'
        }`}>
          {formatTime(timeLeft)}
        </div>

        {/* Circular Progress Bar (Visual indicator) */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
          <div 
            className={`h-full transition-all duration-1000 rounded-full ${
              isResting ? 'bg-amber-500' : 'bg-blue-600 dark:bg-blue-500'
            }`}
            style={{ 
              width: `${(timeLeft / (isResting ? (parseInt(currentExercise.descanso) || 30) : 45)) * 100}%` 
            }}
          />
        </div>

        {/* Buttons Controls */}
        <div className="flex justify-center gap-4 items-center">
          <button
            onClick={() => {
              setIsActive(false);
              setTimeLeft(45);
              setIsResting(false);
              setCurrentSet(1);
              setCurrentIdx(0);
            }}
            className="p-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 rounded-full text-slate-600 dark:text-slate-200 transition-all active:scale-95"
            title="Reiniciar Treino"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 text-white ${
              isActive 
                ? 'bg-slate-800 hover:bg-slate-900' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> {timeLeft === 0 ? 'Iniciar' : 'Começar'}
              </>
            )}
          </button>

          <button
            onClick={handleTimerEnd}
            className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold"
          >
            Pular
          </button>
        </div>
      </div>
    </div>
  );
}
