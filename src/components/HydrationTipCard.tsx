import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Sparkles, 
  Sun, 
  CloudSun, 
  Snowflake, 
  Wind, 
  RefreshCw, 
  Check, 
  Plus, 
  Flame, 
  Activity, 
  Zap,
  Loader2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface HydrationTipCardProps {
  profile: UserProfile | null;
  todayWater: number;
  waterTarget: number;
  onAddWater: (amountMl: number) => void;
}

export type WeatherOption = 'Quente' | 'Ameno' | 'Frio' | 'Ar Seco';

export function HydrationTipCard({ profile, todayWater, waterTarget, onAddWater }: HydrationTipCardProps) {
  const [weather, setWeather] = useState<WeatherOption>('Quente');
  const [tip, setTip] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [waterAddedNotification, setWaterAddedNotification] = useState<boolean>(false);

  const userName = profile?.questionnaire?.nome || 'Atleta';
  const activityLevel = profile?.questionnaire?.nivelAtividade || 'Moderadamente ativo';
  const currentWeight = profile?.currentWeight || 70;

  const weatherOptions: { id: WeatherOption; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'Quente', label: 'Quente / Sol ☀️', icon: <Sun className="w-3.5 h-3.5 text-amber-500" />, color: 'hover:border-amber-400' },
    { id: 'Ameno', label: 'Ameno ⛅', icon: <CloudSun className="w-3.5 h-3.5 text-blue-400" />, color: 'hover:border-blue-400' },
    { id: 'Frio', label: 'Frio ❄️', icon: <Snowflake className="w-3.5 h-3.5 text-sky-400" />, color: 'hover:border-sky-400' },
    { id: 'Ar Seco', label: 'Ar Seco 🏜️', icon: <Wind className="w-3.5 h-3.5 text-orange-400" />, color: 'hover:border-orange-400' }
  ];

  const fetchHydrationTip = async (selectedWeather: WeatherOption) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/hydration-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          activityLevel,
          weather: selectedWeather,
          currentWeight,
          todayWater
        })
      });

      const data = await response.json();
      if (data.tip) {
        setTip(data.tip);
        setIsDemo(!!data.isDemo);
      } else {
        setTip(`Dica para dia ${selectedWeather.toLowerCase()}: Mantenha garrafas de água visíveis e beba ao menos 250ml a cada 1 hora para manter o metabolismo ativo.`);
      }
    } catch (err) {
      console.error('Erro ao buscar dica de hidratação:', err);
      setTip(`Aumente sua ingestão de água em dias de clima ${selectedWeather.toLowerCase()}! Mantenha uma garrafinha de 500ml por perto.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial tip on component mount or weather change
  useEffect(() => {
    fetchHydrationTip(weather);
  }, [weather]);

  const handleQuickAddWater = (amount: number) => {
    onAddWater(amount);
    setWaterAddedNotification(true);
    setTimeout(() => {
      setWaterAddedNotification(false);
    }, 2500);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-[2rem] p-6 shadow-xl border border-blue-500/20 flex flex-col justify-between relative overflow-hidden space-y-4">
      {/* Background Decorative Glow */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Title */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl shadow-md shadow-blue-500/20 text-white">
            <Droplet className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-black text-base text-white tracking-tight">
                Dicas de Hidratação
              </h3>
              <span className="px-2 py-0.5 bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 rounded-full text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" /> Gemini AI
              </span>
            </div>
            <p className="text-[11px] text-blue-200/80">
              Sugestão diária personalizada pelo seu clima e treino
            </p>
          </div>
        </div>

        {/* Refresh Tip Button */}
        <button
          onClick={() => fetchHydrationTip(weather)}
          disabled={isLoading}
          className="p-2 bg-blue-900/60 hover:bg-blue-800/80 text-blue-200 hover:text-white rounded-xl border border-blue-700/50 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="Regerar dica de hidratação com a IA"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-300' : ''}`} />
          <span className="hidden sm:inline">Atualizar</span>
        </button>
      </div>

      {/* Interactive Weather Selector */}
      <div className="relative z-10 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-blue-300 font-bold">
          <span>Selecione o Clima Atual:</span>
          <span className="text-[10px] text-blue-400/80 font-normal">
            Atividade: <strong className="text-cyan-300">{activityLevel}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {weatherOptions.map((opt) => {
            const isSelected = weather === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setWeather(opt.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-cyan-300 shadow-md shadow-blue-600/30 font-black'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60 ' + opt.color
                }`}
              >
                {opt.icon}
                <span className="truncate">{opt.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Output Tip Display Box */}
      <div className="relative z-10 bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-blue-500/30 min-h-[100px] flex flex-col justify-between shadow-inner">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            <p className="text-xs text-blue-200 font-medium animate-pulse">
              Consultando o Gemini para calcular sua hidratação ideal ({weather})...
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-xl shrink-0 mt-0.5">💧</span>
              <p className="text-xs text-slate-100 leading-relaxed font-medium">
                "{tip}"
              </p>
            </div>

            {/* Quick action buttons & meta indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-blue-900/60">
              <div className="flex items-center gap-1 text-[10px] text-cyan-300 font-mono">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>Consumo Hoje: <strong>{(todayWater / 1000).toFixed(1)}L</strong> / {(waterTarget / 1000).toFixed(1)}L</span>
              </div>

              <button
                onClick={() => handleQuickAddWater(250)}
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-[11px] rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>+250ml Água</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Success Notification Banner when water is logged from tip */}
      <AnimatePresence>
        {waterAddedNotification && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-20 bg-emerald-500 text-slate-950 px-3 py-2 rounded-xl text-xs font-black flex items-center justify-between shadow-lg"
          >
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 stroke-[3]" /> +250ml adicionados ao seu progresso diário!
            </span>
            <span className="text-[10px] opacity-80">💧 Excelente!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
