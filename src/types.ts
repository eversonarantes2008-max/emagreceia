export interface QuestionnaireData {
  nome: string;
  sexo: 'Masculino' | 'Feminino' | 'Outro';
  idade: number;
  peso: number; // in kg
  altura: number; // in cm
  metaPeso: number; // in kg
  nivelAtividade: 'Sedentário' | 'Levemente ativo' | 'Moderadamente ativo' | 'Muito ativo' | 'Extremamente ativo';
  restricoesAlimentares: string; // e.g., vegano, sem lactose, nenhuma
  alimentosPreferidos: string;
  alimentosNaoGosta: string;
  quantidadeRefeicoes: number;
  objetivo: string; // e.g., perda rápida, perda sustentável, ganho de massa/recomposição
  rotina: string;
  quantidadeAgua: number; // ml
  sono: number; // hours
  tempoExercicios: number; // minutes per day
  equipamentosDisponiveis: string; // e.g., peso corporal, halteres, academia completa
}

export interface Meal {
  nome: string; // e.g., Café da Manhã, Almoço
  horario: string; // e.g., 08:00
  alimentos: string[];
  calorias: number;
}

export interface DayPlan {
  dia: number;
  foco: string; // e.g., "Foco em Hidratação", "Treino de Cardio"
  checklist: string[];
  mensagemMotivacional: string;
  caloriasAlvo: number;
  cardapio?: Meal[];
}

export interface Recipe {
  id: string;
  nome: string;
  tempoPreparo: string;
  calorias: number;
  ingredientes: string[];
  instrucoes: string[];
}

export interface Exercise {
  nome: string;
  series: number;
  repeticoes: string; // e.g., "12" ou "30s"
  descanso: string; // e.g., "45s"
}

export interface Workout {
  id: string;
  nome: string; // e.g., Treino A - Pernas e Glúteos
  duracao: string; // e.g., "30 min"
  equipamentos: string;
  exercicios: Exercise[];
}

export interface ShoppingCategory {
  categoria: string; // e.g., Proteínas, Legumes & Verduras
  itens: string[];
}

export interface LevePlan {
  plano30Dias: DayPlan[];
  cardapioDiario: Meal[];
  receitas: Recipe[];
  planoHidratacao: {
    metaDiariaMl: number;
    recomendacoes: string[];
  };
  planoExercicios: Workout[];
  listaCompras: ShoppingCategory[];
  guiasNutricionais: string[];
  perguntasFrequentes: { pergunta: string; resposta: string }[];
}

export interface UserProfile {
  uid: string;
  email: string;
  questionnaire?: QuestionnaireData | null;
  plan?: LevePlan | null;
  createdAt: string;
  streakDays: number;
  lastActiveDate?: string;
  currentWeight: number;
  weightHistory: { data: string; peso: number }[];
  waterLogs: { [date: string]: number }; // date (YYYY-MM-DD) -> ml consumed
  completedChecklist: { [date: string]: string[] }; // date -> completed tasks
  isApproved?: boolean;
  planType?: 'basic' | 'premium';
  paymentMethod?: 'pix' | 'credit_card';
  paymentStatus?: 'pending' | 'paid' | 'pending_confirmation';
  isPremium?: boolean;
  premiumStatus?: 'none' | 'pending' | 'approved' | 'pending_admin_confirmation';
  premiumPasswordSent?: string;
  hasEnteredPremiumPassword?: boolean;
  hasCompletedOnboarding?: boolean;
  dailyVariations?: {
    [date: string]: {
      receitas: Recipe[];
      planoExercicios: Workout[];
    };
  } | null;
}
