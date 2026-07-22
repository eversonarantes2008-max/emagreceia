import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  ArrowLeftRight, 
  Sliders, 
  Grid, 
  Sparkles, 
  Calendar, 
  Scale, 
  Trophy, 
  Download, 
  Share2, 
  RotateCcw, 
  Eye, 
  CheckCircle2, 
  Info,
  Maximize2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface BeforeAfterComparisonProps {
  profile: UserProfile | null;
}

export function BeforeAfterComparison({ profile }: BeforeAfterComparisonProps) {
  // Default placeholder images (fitness transformation aesthetic placeholders)
  const defaultBefore = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop';
  const defaultAfter = 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop';

  const [beforeImage, setBeforeImage] = useState<string>(() => {
    return localStorage.getItem('emagreceia_before_img') || defaultBefore;
  });
  const [afterImage, setAfterImage] = useState<string>(() => {
    return localStorage.getItem('emagreceia_after_img') || defaultAfter;
  });

  const [beforeDate, setBeforeDate] = useState<string>(() => {
    return localStorage.getItem('emagreceia_before_date') || 'Início da Jornada';
  });
  const [beforeWeight, setBeforeWeight] = useState<string>(() => {
    const startW = profile?.weightHistory?.[0]?.peso || profile?.currentWeight || 78;
    return localStorage.getItem('emagreceia_before_weight') || `${startW} kg`;
  });

  const [afterDate, setAfterDate] = useState<string>(() => {
    return localStorage.getItem('emagreceia_after_date') || 'Hoje / Atual';
  });
  const [afterWeight, setAfterWeight] = useState<string>(() => {
    const curW = profile?.currentWeight || 70;
    return localStorage.getItem('emagreceia_after_weight') || `${curW} kg`;
  });

  // Display view mode: 'slider' | 'sideBySide' | 'fadeOverlay'
  const [viewMode, setViewMode] = useState<'slider' | 'sideBySide' | 'fadeOverlay'>('slider');
  
  // Slider position (0 to 100)
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Overlay fade opacity (0 to 100)
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50);

  // Modal for full screen view
  const [fullscreenOpen, setFullscreenOpen] = useState<boolean>(false);

  // Calculate weight difference
  const startWeightNum = parseFloat(beforeWeight.replace(/[^0-9.]/g, '')) || 0;
  const currentWeightNum = parseFloat(afterWeight.replace(/[^0-9.]/g, '')) || 0;
  const weightDiff = (currentWeightNum - startWeightNum).toFixed(1);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        if (target === 'before') {
          setBeforeImage(result);
          localStorage.setItem('emagreceia_before_img', result);
        } else {
          setAfterImage(result);
          localStorage.setItem('emagreceia_after_img', result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Slider Mouse/Touch movement logic
  const handleMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const resetPhotos = () => {
    if (confirm('Deseja restaurar as fotos de exemplo padrão?')) {
      setBeforeImage(defaultBefore);
      setAfterImage(defaultAfter);
      localStorage.removeItem('emagreceia_before_img');
      localStorage.removeItem('emagreceia_after_img');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-500" /> Comparativo Visual Evolução
            </span>
            {startWeightNum > 0 && currentWeightNum > 0 && (
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono ${
                parseFloat(weightDiff) <= 0 
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'bg-amber-500 text-slate-950'
              }`}>
                {parseFloat(weightDiff) <= 0 ? `${weightDiff} kg` : `+${weightDiff} kg`}
              </span>
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-display font-black text-slate-900 dark:text-white mt-1">
            Evolução Corporal: Antes & Depois
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare suas fotos registradas no início e no estágio atual para visualizar seus resultados físicos.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'slider'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Slider Interativo</span>
          </button>

          <button
            onClick={() => setViewMode('sideBySide')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'sideBySide'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Lado a Lado</span>
          </button>

          <button
            onClick={() => setViewMode('fadeOverlay')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'fadeOverlay'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Sobreposição</span>
          </button>
        </div>
      </div>

      {/* PHOTO UPLOAD & METADATA EDITORS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Before Meta Input */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
              1. Foto "Antes" (Início)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={beforeDate}
                onChange={(e) => {
                  setBeforeDate(e.target.value);
                  localStorage.setItem('emagreceia_before_date', e.target.value);
                }}
                placeholder="Ex: 01 de Janeiro"
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-white border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-emerald-500 w-28"
              />
              <input
                type="text"
                value={beforeWeight}
                onChange={(e) => {
                  setBeforeWeight(e.target.value);
                  localStorage.setItem('emagreceia_before_weight', e.target.value);
                }}
                placeholder="Ex: 78 kg"
                className="bg-transparent text-xs font-bold text-emerald-600 dark:text-emerald-400 border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-emerald-500 w-20"
              />
            </div>
          </div>

          <label className="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shrink-0">
            <Camera className="w-3.5 h-3.5" />
            <span>Trocar Foto</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 'before')}
            />
          </label>
        </div>

        {/* After Meta Input */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
              2. Foto "Depois" (Atual)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={afterDate}
                onChange={(e) => {
                  setAfterDate(e.target.value);
                  localStorage.setItem('emagreceia_after_date', e.target.value);
                }}
                placeholder="Ex: Hoje"
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-white border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-emerald-500 w-28"
              />
              <input
                type="text"
                value={afterWeight}
                onChange={(e) => {
                  setAfterWeight(e.target.value);
                  localStorage.setItem('emagreceia_after_weight', e.target.value);
                }}
                placeholder="Ex: 70 kg"
                className="bg-transparent text-xs font-bold text-emerald-600 dark:text-emerald-400 border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-emerald-500 w-20"
              />
            </div>
          </div>

          <label className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-600/20">
            <Upload className="w-3.5 h-3.5" />
            <span>Nova Foto Atual</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 'after')}
            />
          </label>
        </div>
      </div>

      {/* MAIN VISUAL DISPLAY CANVAS */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-inner">
        
        {/* MODE 1: INTERACTIVE SPLIT SLIDER */}
        {viewMode === 'slider' && (
          <div
            ref={sliderContainerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchMove={handleTouchMove}
            className="relative w-full h-[400px] md:h-[500px] select-none cursor-ew-resize overflow-hidden"
          >
            {/* After Image (Background layer) */}
            <img
              src={afterImage}
              alt="Depois / Progresso Atual"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* After Label Badge */}
            <div className="absolute top-4 right-4 bg-emerald-600/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-black shadow-lg z-10 flex items-center gap-1.5">
              <span>DEPOIS</span>
              <span className="opacity-80 font-normal">({afterDate} • {afterWeight})</span>
            </div>

            {/* Before Image (Clipped Foreground layer) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={beforeImage}
                alt="Antes / Foto Inicial"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{
                  width: sliderContainerRef.current ? `${sliderContainerRef.current.clientWidth}px` : '100%',
                  height: '100%'
                }}
              />
              {/* Before Label Badge */}
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-black shadow-lg z-10 flex items-center gap-1.5 border border-slate-700">
                <span>ANTES</span>
                <span className="opacity-80 font-normal">({beforeDate} • {beforeWeight})</span>
              </div>
            </div>

            {/* Slider Divider Bar & Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)] z-20 cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-10 h-10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-full shadow-2xl flex items-center justify-center border-2 border-emerald-500 cursor-ew-resize transform -translate-x-1/2">
                <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            {/* Bottom instruction hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-300 px-4 py-1.5 rounded-full text-[11px] font-bold z-10 flex items-center gap-1.5 pointer-events-none shadow-md">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Arraste a barra para comparar o Antes e Depois
            </div>
          </div>
        )}

        {/* MODE 2: SIDE BY SIDE */}
        {viewMode === 'sideBySide' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 bg-slate-950">
            {/* Before Box */}
            <div className="relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden group">
              <img
                src={beforeImage}
                alt="Antes"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 left-3 bg-slate-900/90 text-white px-3 py-1 rounded-xl text-xs font-black border border-slate-700">
                ANTES
              </div>
              <div className="absolute bottom-3 left-3 text-white space-y-0.5">
                <p className="text-xs font-bold text-slate-300">{beforeDate}</p>
                <p className="text-lg font-black font-mono text-white">{beforeWeight}</p>
              </div>
            </div>

            {/* After Box */}
            <div className="relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden group">
              <img
                src={afterImage}
                alt="Depois"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-xl text-xs font-black shadow-lg">
                DEPOIS (ATUAL)
              </div>
              <div className="absolute bottom-3 left-3 text-white space-y-0.5">
                <p className="text-xs font-bold text-emerald-300">{afterDate}</p>
                <p className="text-lg font-black font-mono text-emerald-400">{afterWeight}</p>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: FADE OVERLAY WITH RANGE SLIDER */}
        {viewMode === 'fadeOverlay' && (
          <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-slate-950">
            {/* Base Image: Before */}
            <img
              src={beforeImage}
              alt="Antes"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay Image: After with variable opacity */}
            <img
              src={afterImage}
              alt="Depois"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-75"
              style={{ opacity: overlayOpacity / 100 }}
            />

            {/* Controls Bar at bottom */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 flex items-center gap-4 text-white z-10">
              <span className="text-xs font-black uppercase text-slate-400 shrink-0">Antes</span>
              <input
                type="range"
                min="0"
                max="100"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-xs font-black uppercase text-emerald-400 shrink-0">
                Depois ({overlayOpacity}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS & STATS BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFullscreenOpen(true)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Expandir Tela Cheia</span>
          </button>

          <button
            onClick={resetPhotos}
            className="px-3 py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Fotos Padrão</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          <span>Suas fotos são salvas com total privacidade no seu próprio navegador.</span>
        </div>
      </div>

      {/* FULLSCREEN PREVIEW MODAL */}
      <AnimatePresence>
        {fullscreenOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl p-4 md:p-8 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-black text-lg">
                  Sua Transformação Físico-Estética
                </h3>
              </div>

              <button
                onClick={() => setFullscreenOpen(false)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Side-by-Side Fullscreen view */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto max-w-5xl mx-auto w-full">
              <div className="relative h-[60vh] rounded-3xl overflow-hidden border border-slate-800">
                <img src={beforeImage} alt="Antes" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-slate-900/90 text-white px-4 py-1.5 rounded-full text-xs font-black border border-slate-700">
                  ANTES ({beforeDate} - {beforeWeight})
                </div>
              </div>

              <div className="relative h-[60vh] rounded-3xl overflow-hidden border border-emerald-500/40">
                <img src={afterImage} alt="Depois" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                  DEPOIS ({afterDate} - {afterWeight})
                </div>
              </div>
            </div>

            <div className="text-center text-slate-400 text-xs">
              Pressione a tecla ESC ou clique no botão X no topo para fechar a visualização.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
