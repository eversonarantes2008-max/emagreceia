import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sparkles, 
  Sun, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  Circle, 
  Zap, 
  ShieldAlert, 
  Thermometer, 
  EyeOff, 
  VolumeX, 
  Loader2,
  Bed,
  Flame,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface SleepHygieneCardProps {
  profile: UserProfile | null;
}

export type Chronotype = 'Matutino 🌅' | 'Intermediário ⛅' | 'Vespertino 🦉';

export function SleepHygieneCard({ profile }: SleepHygieneCardProps) {
  const userName = profile?.questionnaire?.nome || 'Atleta';
  const mainGoal = profile?.questionnaire?.objetivo || 'Emagrecimento e Definição';

  const [sleepTime, setSleepTime] = useState<string>(() => {
    return localStorage.getItem('emagreceia_sleep_time') || '22:30';
  });
  const [wakeTime, setWakeTime] = useState<string>(() => {
    return localStorage.getItem('emagreceia_wake_time') || '06:30';
  });
  const [chronotype, setChronotype] = useState<Chronotype>(() => {
    return (localStorage.getItem('emagreceia_chronotype') as Chronotype) || 'Intermediário ⛅';
  });

  const [tip, setTip] = useState<string>('');
  const [routineSteps, setRoutineSteps] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(() => {
    const saved = localStorage.getItem('emagreceia_sleep_completed_steps');
    return saved ? JSON.parse(saved) : {};
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDemo, setIsDemo] = useState<boolean>(false);

  // Fetch tip from server endpoint
  const fetchSleepTip = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sleep-hygiene-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          sleepTime,
          wakeTime,
          chronotype,
          mainGoal
        })
      });

      const data = await response.json();
      if (data.tip) {
        setTip(data.tip);
        if (Array.isArray(data.routineSteps) && data.routineSteps.length > 0) {
          setRoutineSteps(data.routineSteps);
        }
        setIsDemo(!!data.isDemo);
      }
    } catch (err) {
      console.error('Erro ao buscar orientação de sono:', err);
      setTip('Para otimizar o hormônio do crescimento (GH) e queimar gordura durante o sono, mantenha o quarto escuro, fresco (19°C-21°C) e evite telas 1 hora antes de dormir.');
      setRoutineSteps([
        'Encerrar consumo de café e energéticos 8h antes do sono',
        'Ativar o modo noturno nas telas e diminuir as luzes da casa',
        'Manter o quarto bem ventilado e totalmente escuro',
        'Tomar 10 minutos de sol logo após acordar'
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSleepTip();
  }, [sleepTime, wakeTime, chronotype]);

  const toggleStep = (index: number) => {
    const updated = { ...completedSteps, [index]: !completedSteps[index] };
    setCompletedSteps(updated);
    localStorage.setItem('emagreceia_sleep_completed_steps', JSON.stringify(updated));
  };

  const handleSleepTimeChange = (val: string) => {
    setSleepTime(val);
    localStorage.setItem('emagreceia_sleep_time', val);
  };

  const handleWakeTimeChange = (val: string) => {
    setWakeTime(val);
    localStorage.setItem('emagreceia_wake_time', val);
  };

  const handleChronotypeChange = (c: Chronotype) => {
    setChronotype(c);
    localStorage.setItem('emagreceia_chronotype', c);
  };

  // Calculate sleep duration in hours
  const calculateSleepHours = () => {
    const [sH, sM] = sleepTime.split(':').map(Number);
    const [wH, wM] = wakeTime.split(':').map(Number);
    let diff = (wH * 60 + wM) - (sH * 60 + sM);
    if (diff < 0) diff += 24 * 60; // crossover midnight
    return (diff / 60).toFixed(1);
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const sleepHours = calculateSleepHours();

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-[2rem] p-6 shadow-xl border border-indigo-500/20 space-y-5 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-md shadow-indigo-500/20 text-indigo-100">
            <Moon className="w-5 h-5 fill-current text-indigo-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-base text-white tracking-tight">
                Higiene do Sono & Ritmo Circadiano
              </h3>
              <span className="px-2 py-0.5 bg-indigo-400/20 text-indigo-300 border border-indigo-400/30 rounded-full text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" /> Gemini AI
              </span>
            </div>
            <p className="text-[11px] text-indigo-200/80">
              Otimize sua melatonina, regulagem de cortisol e queima de gordura noturna
            </p>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchSleepTip}
          disabled={isLoading}
          className="p-2 bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 hover:text-white rounded-xl border border-indigo-700/50 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="Regerar análise de sono com Gemini"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-300' : ''}`} />
          <span className="hidden sm:inline">Atualizar Dica</span>
        </button>
      </div>

      {/* INPUTS: SLEEP SCHEDULE & CHRONOTYPE */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-indigo-900/30 p-3.5 rounded-2xl border border-indigo-500/20">
        
        {/* Sleep time picker */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-extrabold text-indigo-300 tracking-wider flex items-center gap-1">
            <Moon className="w-3 h-3 text-indigo-400" /> Horário de Dormir
          </label>
          <input
            type="time"
            value={sleepTime}
            onChange={(e) => handleSleepTimeChange(e.target.value)}
            className="w-full bg-slate-900/80 text-xs font-bold text-white px-3 py-1.5 rounded-xl border border-indigo-500/30 focus:outline-none focus:border-indigo-400"
          />
        </div>

        {/* Wake time picker */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-extrabold text-indigo-300 tracking-wider flex items-center gap-1">
            <Sun className="w-3 h-3 text-amber-400" /> Horário de Acordar
          </label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => handleWakeTimeChange(e.target.value)}
            className="w-full bg-slate-900/80 text-xs font-bold text-white px-3 py-1.5 rounded-xl border border-indigo-500/30 focus:outline-none focus:border-indigo-400"
          />
        </div>

        {/* Chronotype selector */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-extrabold text-indigo-300 tracking-wider flex items-center justify-between">
            <span>Cronotipo</span>
            <span className="text-emerald-400 font-mono font-bold text-[11px]">{sleepHours}h de sono</span>
          </label>
          <select
            value={chronotype}
            onChange={(e) => handleChronotypeChange(e.target.value as Chronotype)}
            className="w-full bg-slate-900/80 text-xs font-bold text-white px-2.5 py-1.5 rounded-xl border border-indigo-500/30 focus:outline-none focus:border-indigo-400 cursor-pointer"
          >
            <option value="Matutino 🌅">Matutino 🌅 (Acorda cedo)</option>
            <option value="Intermediário ⛅">Intermediário ⛅ (Padrão)</option>
            <option value="Vespertino 🦉">Vespertino 🦉 (Noturno)</option>
          </select>
        </div>

      </div>

      {/* AI AI TIP BOX */}
      <div className="relative z-10 bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-indigo-500/30 space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
            <p className="text-xs text-indigo-200 font-medium animate-pulse">
              Analisando seu ritmo circadiano ({sleepTime} ➔ {wakeTime}) com o Gemini...
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-xl shrink-0">🌙</span>
              <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                "{tip}"
              </p>
            </div>

            {/* Checklist Header */}
            {routineSteps.length > 0 && (
              <div className="pt-2 border-t border-indigo-900/80 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-purple-400" /> Ritual Diário Circadiano
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    {completedCount} / {routineSteps.length} Concluídos
                  </span>
                </div>

                {/* Steps List */}
                <div className="space-y-1.5">
                  {routineSteps.map((step, idx) => {
                    const isDone = !!completedSteps[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all border flex items-center gap-2.5 cursor-pointer ${
                          isDone
                            ? 'bg-emerald-950/40 text-emerald-200 border-emerald-500/30 line-through opacity-80'
                            : 'bg-slate-800/60 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className="leading-tight">{step}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

    </div>
  );
}
