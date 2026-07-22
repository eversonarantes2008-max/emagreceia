import React, { useState } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  Scale, 
  Calendar, 
  ArrowDownRight, 
  ArrowUpRight, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Activity, 
  Info, 
  ChevronRight,
  Sparkles,
  Trophy
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

interface WeeklyProgressCardProps {
  profile: UserProfile | null;
}

export function WeeklyProgressCard({ profile }: WeeklyProgressCardProps) {
  const history = profile?.weightHistory || [];
  const currentWeight = profile?.currentWeight || profile?.questionnaire?.peso || 70;
  const startWeight = profile?.questionnaire?.peso || history[0]?.peso || 75;
  const targetWeight = profile?.questionnaire?.metaPeso || 60;

  // Function to compute weekly averages from history or realistic trajectory
  const calculateWeeklyStats = () => {
    if (!history || history.length === 0) {
      // Fallback baseline when history is empty
      const prevWeekAvg = startWeight;
      const currWeekAvg = currentWeight;
      const diff = currWeekAvg - prevWeekAvg;
      return {
        currWeekAvg: Number(currWeekAvg.toFixed(1)),
        prevWeekAvg: Number(prevWeekAvg.toFixed(1)),
        diff: Number(diff.toFixed(1)),
        percentChange: Number(((diff / prevWeekAvg) * 100).toFixed(1)),
        currCount: 1,
        prevCount: 1,
        isSimulated: true
      };
    }

    // Sort history by date ascending (or index order)
    const sorted = [...history];

    // Split into last 7 entries (current week) and previous 7 entries (prior week)
    const totalCount = sorted.length;
    let currWeekEntries = [];
    let prevWeekEntries = [];

    if (totalCount >= 14) {
      currWeekEntries = sorted.slice(totalCount - 7);
      prevWeekEntries = sorted.slice(totalCount - 14, totalCount - 7);
    } else if (totalCount >= 2) {
      const half = Math.floor(totalCount / 2);
      currWeekEntries = sorted.slice(half);
      prevWeekEntries = sorted.slice(0, half);
    } else {
      // Single entry in history
      currWeekEntries = sorted;
      prevWeekEntries = [{ data: 'Início', peso: startWeight }];
    }

    const currSum = currWeekEntries.reduce((acc, curr) => acc + curr.peso, 0);
    const currAvg = currSum / currWeekEntries.length;

    const prevSum = prevWeekEntries.reduce((acc, curr) => acc + curr.peso, 0);
    const prevAvg = prevSum / prevWeekEntries.length;

    const diff = currAvg - prevAvg;
    const percentChange = (diff / prevAvg) * 100;

    return {
      currWeekAvg: Number(currAvg.toFixed(1)),
      prevWeekAvg: Number(prevAvg.toFixed(1)),
      diff: Number(diff.toFixed(1)),
      percentChange: Number(percentChange.toFixed(1)),
      currCount: currWeekEntries.length,
      prevCount: prevWeekEntries.length,
      isSimulated: totalCount < 4
    };
  };

  const stats = calculateWeeklyStats();

  // Is weight going down (positive result for weight loss)?
  const isLoss = stats.diff <= 0;
  const absDiff = Math.abs(stats.diff).toFixed(1);
  const remainingToGoal = Math.max(0, currentWeight - targetWeight).toFixed(1);

  // Calculate estimated weeks to reach goal at current rate
  const weeklyLossRate = Math.abs(stats.diff);
  const weeksToGoal = weeklyLossRate > 0 ? Math.ceil(parseFloat(remainingToGoal) / weeklyLossRate) : null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between relative overflow-hidden space-y-4">
      {/* Subtle decorative background gradient */}
      <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-bold text-base text-slate-800 dark:text-white">
                Progresso Semanal
              </h3>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-[9px] font-extrabold uppercase tracking-wider">
                Últimos 7 dias
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Comparativo da média de peso desta semana x semana anterior
            </p>
          </div>
        </div>

        {/* Badge status */}
        <div className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shrink-0 ${
          isLoss
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
        }`}>
          {isLoss ? (
            <>
              <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>-{absDiff} kg / sem</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+{absDiff} kg / sem</span>
            </>
          )}
        </div>
      </div>

      {/* COMPARISON METRICS GRID */}
      <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
        
        {/* Previous Week Average */}
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Semana Anterior
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-slate-700 dark:text-slate-300">
              {stats.prevWeekAvg}
            </span>
            <span className="text-xs text-slate-400 font-bold">kg (média)</span>
          </div>
          <p className="text-[10px] text-slate-400">
            {stats.isSimulated ? 'Peso inicial de referência' : `${stats.prevCount} registros`}
          </p>
        </div>

        {/* Current Week Average */}
        <div className="space-y-1 border-l border-slate-200 dark:border-slate-700/60 pl-3">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3" /> Esta Semana (7d)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {stats.currWeekAvg}
            </span>
            <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-bold">kg (média)</span>
          </div>
          <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-bold">
            {isLoss ? `Perda média de -${absDiff} kg (${stats.percentChange}%)` : `Variação de +${absDiff} kg (${stats.percentChange}%)`}
          </p>
        </div>

      </div>

      {/* FOOTER MOTIVATIONAL INSIGHT */}
      <div className="flex items-center justify-between text-xs bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-slate-700 dark:text-slate-200 font-medium text-[11px]">
            {isLoss
              ? `Ótimo ritmo! Você está perdendo em média ${absDiff} kg por semana.`
              : `Mantenha a consistência de água e treinos para estabilizar o peso.`}
          </span>
        </div>

        {weeksToGoal && isLoss && (
          <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 font-mono shrink-0 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-1 rounded-lg">
            ~{weeksToGoal} sem. p/ meta ({targetWeight}kg)
          </div>
        )}
      </div>
    </div>
  );
}
