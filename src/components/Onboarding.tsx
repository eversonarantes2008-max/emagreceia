import React, { useState } from 'react';
import { ArrowRight, ShieldAlert, ShieldCheck, Dumbbell, Apple } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoIcon } from './Logo';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (acceptedTerms) {
      onComplete();
    }
  };

  const stepsContent = [
    {
      title: "Boas-vindas ao LeveAI!",
      subtitle: "Seu Coach de Estilo de Vida Saudável Alimentado por Inteligência Artificial",
      description: "Esqueça dietas radicais, restrições impossíveis ou planilhas confusas. O LeveAI combina ciência de ponta, nutrição baseada em evidências e a IA avançada do Google Gemini para estruturar a jornada ideal para o seu perfil único.",
      illustration: (
        <div className="relative p-6 bg-gradient-to-tr from-blue-500/5 to-emerald-500/5 dark:from-blue-500/10 dark:to-emerald-500/10 rounded-3xl border border-blue-100/20 dark:border-blue-900/10 flex items-center justify-center h-48">
          <LogoIcon size={120} className="animate-pulse" />
        </div>
      )
    },
    {
      title: "Como Funciona?",
      subtitle: "Um Plano Dinâmico Adaptado ao Seu Dia a Dia",
      description: "Você responderá um questionário simples sobre seu corpo, metas, rotina e preferências alimentares. Nossa IA monta instantaneamente um plano completo de 30 dias com receitas práticas, rotina de exercícios físicos e lista de compras inteligente.",
      illustration: (
        <div className="grid grid-cols-3 gap-3 h-48 items-center">
          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-center">
            <Apple className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Dieta</span>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-center">
            <Dumbbell className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Treino</span>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-center font-bold text-emerald-600 flex flex-col justify-center items-center">
            <LogoIcon size={34} className="mb-2" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Foco IA</span>
          </div>
        </div>
      )
    },
    {
      title: "Compromisso com a Segurança",
      subtitle: "Limites Importantes para Proteger Sua Saúde",
      description: "O LeveAI é focado estritamente em educação alimentar, promoção de hábitos de vida ativos, motivação e organização pessoal. O aplicativo NÃO realiza diagnósticos médicos, NÃO substitui consultas com médicos ou nutricionistas qualificados e NÃO prescreve nenhum tipo de medicamento.",
      illustration: (
        <div className="relative p-6 bg-amber-500/5 dark:bg-amber-500/10 rounded-3xl border border-amber-200/50 dark:border-amber-900/30 flex flex-col items-center justify-center text-center h-48 gap-2">
          <ShieldAlert className="w-16 h-16 text-amber-600 dark:text-amber-500" />
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-500">Educação e Motivação • Sem Fins Médicos</p>
        </div>
      )
    },
    {
      title: "Termos e Privacidade",
      subtitle: "Sua Privacidade e Consentimento em Primeiro Lugar",
      description: "Para gerar o seu plano personalizado, os dados fornecidos no questionário serão processados de maneira segura pela IA do Google Gemini e armazenados de forma confidencial no Firestore. Ao continuar, você declara estar ciente de que o plano é educativo e aceita nossos termos de uso.",
      illustration: (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center h-48">
          <div className="flex items-start gap-3 mb-3 p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Armazenamento seguro criptografado no Firebase.</p>
          </div>
          <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none">
            <input 
              type="checkbox" 
              checked={acceptedTerms} 
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Li e concordo com os Termos e Privacidade
            </span>
          </label>
        </div>
      )
    }
  ];

  const currentStepData = stepsContent[step - 1];

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 relative overflow-hidden">
      
      {/* Background soft bubble */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Slide Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="space-y-6"
        >
          {currentStepData.illustration}

          <div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full">
              Passo {step} de 4
            </span>
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-3">
              {currentStepData.title}
            </h2>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
              {currentStepData.subtitle}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Control Actions */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        {/* Step dots */}
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-5 bg-blue-600 dark:bg-blue-500' : 'w-1.5 bg-slate-200 dark:bg-slate-800'
              }`} 
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          disabled={step === 4 && !acceptedTerms}
          className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {step === 4 ? "Começar Agora" : "Avançar"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
