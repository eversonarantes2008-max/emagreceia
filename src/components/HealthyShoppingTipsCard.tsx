import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  Lightbulb, 
  ShieldCheck, 
  Tag, 
  DollarSign, 
  Apple, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface HealthyShoppingTipsCardProps {
  profile: UserProfile | null;
}

interface ItemSwap {
  original: string;
  healthier: string;
  reason: string;
}

export function HealthyShoppingTipsCard({ profile }: HealthyShoppingTipsCardProps) {
  const userGoal = profile?.questionnaire?.objetivo || 'Emagrecimento e Definição';

  const [queryItem, setQueryItem] = useState('');
  const [perimeterStrategy, setPerimeterStrategy] = useState<string>('Priorize as bordas do supermercado (Hortifrúti, Açougue e Laticínios magros). O centro é onde ficam 90% dos alimentos ultraprocessados.');
  const [labelRule, setLabelRule] = useState<string>('Quanto menor a lista de ingredientes, melhor. Se o açúcar (ou xarope de milho, maltodextrina) for um dos 3 primeiros ingredientes, evite!');
  const [topSwaps, setTopSwaps] = useState<ItemSwap[]>([
    { original: 'Refrigerante / Suco de Caixinha', healthier: 'Água com gás + limão espremido', reason: 'Economiza até 250 kcal vazias e evita surtos de insulina' },
    { original: 'Biscoito Recheado / Barrinha Doce', healthier: 'Chocolate 70% + Castanhas do Pará', reason: 'Oferece magnésio, gordura boa e saciedade real' },
    { original: 'Molho Pronto de Tomate', healthier: 'Tomate Pelado em lata + orégano', reason: 'Livre de açúcares escondidos e sódio excessivo' },
    { original: 'Pão de Forma Tradicional', healthier: 'Pão 100% Integral com grãos ou Tapioca com ovo', reason: 'Menor índice glicêmico e maior teor de fibras' }
  ]);
  const [itemAnalysis, setItemAnalysis] = useState<string>('Dica de Ouro: Nunca vá ao supermercado com fome! Isso reduz compras impulsivas de doces em até 65%.');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchShoppingAdvice = async (itemToSearch?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/healthy-shopping-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userGoal,
          dietaryPreference: 'Geral/Equilibrada',
          queriedItem: itemToSearch || queryItem
        })
      });

      const data = await response.json();
      if (data.perimeterStrategy) setPerimeterStrategy(data.perimeterStrategy);
      if (data.labelRule) setLabelRule(data.labelRule);
      if (Array.isArray(data.topSwaps) && data.topSwaps.length > 0) setTopSwaps(data.topSwaps);
      if (data.itemAnalysis) setItemAnalysis(data.itemAnalysis);
    } catch (err) {
      console.error('Erro ao buscar dicas de compras:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryItem.trim()) return;
    fetchShoppingAdvice(queryItem.trim());
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800/60 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-slate-800 dark:text-white">
                Dicas de Compras Saudáveis & Economia
              </h3>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Guia Inteligente
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Aprenda a fugir das armadilhas dos rótulos e a fazer trocas nutritivas e baratas
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchShoppingAdvice()}
          disabled={isLoading}
          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
          <span className="hidden sm:inline">Novas Dicas Gemini</span>
        </button>
      </div>

      {/* SEARCH / ASK AI ABOUT AN ITEM */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Dúvida sobre um produto? Ex: Pão integral, Iogurte, Whey, Margarina..."
              value={queryItem}
              onChange={(e) => setQueryItem(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !queryItem.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Analisar Alimento</span>
          </button>
        </div>
      </form>

      {/* AI AI INSIGHT BOX IF QUERY OR CUSTOM RESPONSE */}
      {itemAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50/70 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-3"
        >
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 dark:text-emerald-300">
              Parecer Nutricional Gemini AI
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              "{itemAnalysis}"
            </p>
          </div>
        </motion.div>
      )}

      {/* 2 STRATEGY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Percurso Periférico */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
            <Apple className="w-4 h-4" />
            <span>Regra do Percurso Periférico</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {perimeterStrategy}
          </p>
        </div>

        {/* Card 2: Leitura de Rótulos */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Como Ler o Rótulo sem Enganação</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {labelRule}
          </p>
        </div>

      </div>

      {/* TOP SWAPS / SUBSTITUIÇÕES INTELIGENTES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
            <ArrowRightLeft className="w-4 h-4 text-emerald-500" />
            <span>Tabela de Trocas Inteligentes no Mercado</span>
          </h4>
          <span className="text-[10px] text-slate-400">Economize calorias e dinheiro</span>
        </div>

        <div className="space-y-2">
          {topSwaps.map((swap, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-lg font-bold text-[10px] shrink-0 line-through">
                  {swap.original}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-lg font-bold text-[10px] shrink-0">
                  {swap.healthier}
                </span>
              </div>

              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                💡 {swap.reason}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
