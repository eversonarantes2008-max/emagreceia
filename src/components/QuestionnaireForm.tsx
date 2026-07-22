import React, { useState } from 'react';
import { QuestionnaireData } from '../types';
import { ArrowRight, ArrowLeft, Heart, User, Dumbbell, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuestionnaireFormProps {
  onSubmit: (data: QuestionnaireData) => void;
  isGenerating: boolean;
}

export function QuestionnaireForm({ onSubmit, isGenerating }: QuestionnaireFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<QuestionnaireData>>({
    nome: '',
    sexo: 'Feminino',
    idade: 28,
    peso: 70,
    altura: 165,
    metaPeso: 62,
    nivelAtividade: 'Moderadamente ativo',
    restricoesAlimentares: 'Nenhuma',
    alimentosPreferidos: '',
    alimentosNaoGosta: '',
    quantidadeRefeicoes: 4,
    objetivo: 'Perda sustentável de gordura',
    rotina: '',
    quantidadeAgua: 1500,
    sono: 7,
    tempoExercicios: 30,
    equipamentosDisponiveis: 'Apenas peso corporal'
  });

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (field: keyof QuestionnaireData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 4) {
      onSubmit(formData as QuestionnaireData);
    } else {
      nextStep();
    }
  };

  // Progress percentage
  const progressPercent = (step / 4) * 100;

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300">
      
      {/* Header and indicator bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
          <span>ETAPA {step} DE 4</span>
          <span>{Math.round(progressPercent)}% Concluído</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-600 dark:text-blue-400">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                  Dados Antropométricos
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Qual é o seu nome completo?
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Maria Silva"
                  value={formData.nome || ''}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Sexo Biológico
                  </label>
                  <select
                    value={formData.sexo}
                    onChange={(e) => handleChange('sexo', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                  >
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Sua Idade (anos)
                  </label>
                  <input
                    type="number"
                    required
                    min={15}
                    max={100}
                    value={formData.idade || ''}
                    onChange={(e) => handleChange('idade', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min={35}
                    max={250}
                    value={formData.peso || ''}
                    onChange={(e) => handleChange('peso', parseFloat(e.target.value))}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    max={240}
                    value={formData.altura || ''}
                    onChange={(e) => handleChange('altura', parseInt(e.target.value))}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Meta Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min={35}
                    max={250}
                    value={formData.metaPeso || ''}
                    onChange={(e) => handleChange('metaPeso', parseFloat(e.target.value))}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-600 dark:text-blue-400">
                  <Coffee className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                  Rotina & Estilo de Vida
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Breve descrição da sua rotina diária
                </label>
                <textarea
                  placeholder="Ex: Trabalho sentado o dia todo, rotina corrida, janto tarde..."
                  value={formData.rotina || ''}
                  onChange={(e) => handleChange('rotina', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Água atual (ml/dia)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={100}
                    value={formData.quantidadeAgua || ''}
                    onChange={(e) => handleChange('quantidadeAgua', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Horas de Sono/noite
                  </label>
                  <input
                    type="number"
                    required
                    min={3}
                    max={15}
                    value={formData.sono || ''}
                    onChange={(e) => handleChange('sono', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Nível de Atividade Física Geral
                </label>
                <select
                  value={formData.nivelAtividade}
                  onChange={(e) => handleChange('nivelAtividade', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                >
                  <option value="Sedentário">Sedentário (Trabalho sentado, sem exercícios)</option>
                  <option value="Levemente ativo">Levemente ativo (Caminha um pouco, exercícios 1-2x/semana)</option>
                  <option value="Moderadamente ativo">Moderadamente ativo (Exercícios frequentes 3-5x/semana)</option>
                  <option value="Muito ativo">Muito ativo (Exercícios pesados quase todo dia)</option>
                  <option value="Extremamente ativo">Extremamente ativo (Atleta profissional, trabalho pesado)</option>
                </select>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-600 dark:text-blue-400">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                  Atividade Física & Equipamentos
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Tempo disponível para exercícios (minutos por dia)
                </label>
                <input
                  type="number"
                  required
                  min={10}
                  max={180}
                  step={5}
                  value={formData.tempoExercicios || ''}
                  onChange={(e) => handleChange('tempoExercicios', parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Equipamentos que você tem disponíveis
                </label>
                <select
                  value={formData.equipamentosDisponiveis}
                  onChange={(e) => handleChange('equipamentosDisponiveis', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                >
                  <option value="Apenas peso corporal">Apenas peso corporal (Sem equipamentos)</option>
                  <option value="Halteres e elásticos">Halteres leves / Caneleiras / Elásticos de treino</option>
                  <option value="Acesso a Academia completa">Acesso a Academia completa / Estúdio</option>
                  <option value="Esteira ou Bicicleta Ergométrica">Apenas esteira ou bicicleta ergométrica</option>
                </select>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                <strong>💡 Dica:</strong> Nossos planos de exercícios inteligentes de 30 dias se adaptam tanto para quem quer treinar em casa com o peso do próprio corpo quanto para quem frequenta a academia!
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-600 dark:text-blue-400">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                  Foco Alimentar & Objetivos
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Número de Refeições/dia
                  </label>
                  <input
                    type="number"
                    required
                    min={3}
                    max={6}
                    value={formData.quantidadeRefeicoes || ''}
                    onChange={(e) => handleChange('quantidadeRefeicoes', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Objetivo Principal
                  </label>
                  <select
                    value={formData.objetivo}
                    onChange={(e) => handleChange('objetivo', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                  >
                    <option value="Perda sustentável de gordura">Perda sustentável (Mais saudável)</option>
                    <option value="Definição muscular e queima rápida">Definição muscular e queima acelerada</option>
                    <option value="Recomposição corporal">Recomposição (Perder gordura, manter massa)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Restrições alimentares (Alergias ou dietas especiais)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Nenhuma, Sem lactose, Vegano, Glúten-free..."
                  value={formData.restricoesAlimentares || ''}
                  onChange={(e) => handleChange('restricoesAlimentares', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Alimentos preferidos
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: banana, frango, ovos..."
                    value={formData.alimentosPreferidos || ''}
                    onChange={(e) => handleChange('alimentosPreferidos', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Alimentos que detesta
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: coentro, cebola, jiló..."
                    value={formData.alimentosNaoGosta || ''}
                    onChange={(e) => handleChange('alimentosNaoGosta', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form controls */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1 || isGenerating}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              step === 1 || isGenerating
                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>

          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all hover:opacity-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <span>Gerando com Gemini...</span>
            ) : step === 4 ? (
              <>
                Criar Plano Inteligente <Heart className="w-4 h-4 fill-current" />
              </>
            ) : (
              <>
                Avançar <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
