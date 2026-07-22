import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  ChevronRight, 
  Target, 
  Eye, 
  Sliders,
  Layers,
  Activity,
  Video,
  X,
  Tv,
  ArrowUpRight,
  ShieldAlert,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type WorkoutCategory = 'push' | 'pull' | 'legs';

export interface ExerciseDetail {
  id: string;
  category: WorkoutCategory;
  name: string;
  muscleGroup: string;
  targetMuscles: { name: string; percentage: number; color: string }[];
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  recommendedSets: string;
  recommendedReps: string;
  restTime: string;
  description: string;
  gifUrl: string;
  youtubeVideoId: string;
  animationType: 'bench_press' | 'shoulder_press' | 'pushup' | 'lateral_raise' | 'triceps_pushdown' | 'lat_pulldown' | 'bent_over_row' | 'biceps_curl' | 'squat' | 'leg_press' | 'stiff';
  frames: {
    step: number;
    title: string;
    description: string;
    visualCue: string;
    focusNote: string;
  }[];
  commonErrors: string[];
  proTips: string[];
}

export const ALL_PPL_EXERCISES_DATA: ExerciseDetail[] = [
  // ==================== PUSH (EMPURRAR) ====================
  {
    id: 'supino-reto',
    category: 'push',
    name: 'Supino Reto com Halteres / Barra',
    muscleGroup: 'Peitoral Maior (Anterior)',
    targetMuscles: [
      { name: 'Peitoral Maior', percentage: 85, color: '#10b981' },
      { name: 'Deltoide Anterior', percentage: 65, color: '#f59e0b' },
      { name: 'Tríceps Braquial', percentage: 50, color: '#3b82f6' }
    ],
    difficulty: 'Intermediário',
    recommendedSets: '4 Séries',
    recommendedReps: '8 a 12 Repetições',
    restTime: '60 - 90 seg',
    description: 'O exercício rei para construção de volume e força na região do peitoral, trabalhando sinergicamente com ombros e tríceps.',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjA1eDJmczN5MnF4ZG1lZmdsdDFtOHFkNHl3Yms0bzExMHdndmRweSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26uf432G92k4I0sM0/giphy.gif',
    youtubeVideoId: 'vthMCtgVtQM',
    animationType: 'bench_press',
    frames: [
      {
        step: 1,
        title: '1. Posição Inicial & Escápulas',
        description: 'Deite-se no banco plano. Retraia as escápulas (junte as pás das costas) e mantenha os pés firmes no chão.',
        visualCue: 'Olhar fixo no teto, peito estufado e leve arco lombar natural.',
        focusNote: 'Escápulas travadas no banco durante todo o movimento.'
      },
      {
        step: 2,
        title: '2. Descida Controlada (3 seg)',
        description: 'Abaixe o peso lentamente trazendo a barra/halteres em direção à linha média do esterno.',
        visualCue: 'Cotovelos posicionados em ângulo de ~45° a 60° em relação ao tronco (nunca a 90°).',
        focusNote: 'Inale ar profundamente enchendo o diafragma.'
      },
      {
        step: 3,
        title: '3. Ponto de Inflexão (Alongamento)',
        description: 'Faça uma breve pausa no ponto mais baixo para sentir o alongamento das fibras do peitoral.',
        visualCue: 'Os halteres devem estar ligeiramente acima da linha dos mamilos.',
        focusNote: 'Não toque a barra com violência no peito; mantenha a tensão muscular.'
      },
      {
        step: 4,
        title: '4. Empurrão Concéntrico Explosivo',
        description: 'Empurre o peso para cima com energia contratando o peitoral até a extensão quase total dos braços.',
        visualCue: 'Solte o ar pela boca no topo do movimento sem travar bruscamente os cotovelos.',
        focusNote: 'Imagine aproximar os cotovelos um do outro no topo.'
      }
    ],
    commonErrors: [
      'Abrir os cotovelos a 90° (Risco elevado de impacto nos ombros)',
      'Descolar as escápulas do banco no topo do movimento',
      'Descolar os pés do chão ou balançar o quadril',
      'Descer o peso rápido demais sem controle excêntrico'
    ],
    proTips: [
      'Pressione os calcanhares contra o chão (Leg Drive) para estabilização máxima.',
      'Mentalize contrair a parte interna do peito no topo de cada repetição.'
    ]
  },
  {
    id: 'desenvolvimento-ombros',
    category: 'push',
    name: 'Desenvolvimento Militar de Ombros',
    muscleGroup: 'Deltoides (Anterior & Lateral)',
    targetMuscles: [
      { name: 'Deltoide Anterior', percentage: 90, color: '#f59e0b' },
      { name: 'Deltoide Lateral', percentage: 70, color: '#10b981' },
      { name: 'Tríceps & Trapézio Superior', percentage: 55, color: '#6366f1' }
    ],
    difficulty: 'Intermediário',
    recommendedSets: '3 - 4 Séries',
    recommendedReps: '10 a 12 Repetições',
    restTime: '60 seg',
    description: 'Movimento fundamental vertical de empurrar para erguer ombros volumosos e esculpidos, além de fortalecer a cintura escapular.',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWZreTcxMmVsOGc0a3VrdzVseXQ5YzRkdnFwdzY2a24xNXp3b3llOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufdipQqU2lhNA4g/giphy.gif',
    youtubeVideoId: '2yjwXTZQDDI',
    animationType: 'shoulder_press',
    frames: [
      {
        step: 1,
        title: '1. Posição Base & Carga',
        description: 'Sentado ou em pé, segure os halteres na altura das orelhas, com palmas voltadas para a frente ou levemente convergentes.',
        visualCue: 'Abdômen e glúteos contraídos para proteger a coluna lombar.',
        focusNote: 'Cotovelos alinhados diretamente abaixo dos punhos.'
      },
      {
        step: 2,
        title: '2. Empurrão Vertical',
        description: 'Eleve os halteres em trajetória suave para cima e ligeiramente para dentro até estender os braços.',
        visualCue: 'Os pesos se aproximam suavemente no topo sem se chocarem.',
        focusNote: 'Exale durante o empurrão mantendo o olhar para a frente.'
      },
      {
        step: 3,
        title: '3. Retorno Excêntrico Controlado',
        description: 'Retorne o peso de forma cadenciada até a linha do queixo/orelhas.',
        visualCue: 'Evite despencar os pesos; mantenha os deltoides sob tensão constante.',
        focusNote: 'Inale na descida preenchendo o abdômen.'
      }
    ],
    commonErrors: [
      'Arquear excessivamente a coluna lombar para trás para compensar carga pesada',
      'Não descer o peso abaixo da linha dos olhos (Amplitude incompleta)',
      'Travar abruptamente as articulações dos cotovelos no topo'
    ],
    proTips: [
      'Mantenha a rotação neutra dos punhos (ângulo de 30° na pegada) para poupar os manguitos rotadores.'
    ]
  },
  {
    id: 'flexao-braco',
    category: 'push',
    name: 'Flexão de Braço (Push-Up) Técnica',
    muscleGroup: 'Peito, Core & Tríceps',
    targetMuscles: [
      { name: 'Peitoral Maior', percentage: 80, color: '#10b981' },
      { name: 'Core & Abdômen', percentage: 75, color: '#ec4899' },
      { name: 'Tríceps Braquial', percentage: 60, color: '#3b82f6' }
    ],
    difficulty: 'Iniciante',
    recommendedSets: '3 Séries',
    recommendedReps: '12 a 15 Repetições',
    restTime: '45 seg',
    description: 'Exercício calistênico indispensável que ativa peito, braços e todo o cinturão de estabilização do core.',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXVxbW93N3ptYXFtdnRqd3Zmcjh1bHJicXVqOHBtb25reGZ6azR3OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKT7gSMywy138oU/giphy.gif',
    youtubeVideoId: 'IODxDxX7oi4',
    animationType: 'pushup',
    frames: [
      {
        step: 1,
        title: '1. Prancha Perfeita',
        description: 'Apoie as mãos ligeiramente mais abertas que a largura dos ombros, corpo em linha reta da cabeça aos calcanhares.',
        visualCue: 'Ative o core e aperte os glúteos para evitar a queda do quadril.',
        focusNote: 'Pescoço neutro, alinhado com a espinha.'
      },
      {
        step: 2,
        title: '2. Flexão e Descida',
        description: 'Dobre os cotovelos levando o peito quase a tocar o chão.',
        visualCue: 'Cotovelos apontam a 45° para trás formando uma seta (e não uma letra T).',
        focusNote: 'Mantenha o corpo rígido como uma tábua única.'
      },
      {
        step: 3,
        title: '3. Extensão Explosiva',
        description: 'Empurre o chão com força, estendendo os braços e voltando à posição inicial de prancha.',
        visualCue: 'Mantenha as omoplatas firmes e o abdômen travado.',
        focusNote: 'Expire no momento de empurrar o solo.'
      }
    ],
    commonErrors: [
      'Deixar o quadril selar/cair em direção ao solo',
      'Elevar demais o bumbum formando uma pirâmide',
      'Mover apenas a cabeça sem mover o tronco'
    ],
    proTips: [
      'Coloque os joelhos no chão caso precise ajustar a intensidade no início.'
    ]
  },
  {
    id: 'elevacao-lateral',
    category: 'push',
    name: 'Elevação Lateral com Halteres',
    muscleGroup: 'Deltoide Lateral (V-Taper)',
    targetMuscles: [
      { name: 'Deltoide Lateral', percentage: 95, color: '#f59e0b' },
      { name: 'Deltoide Anterior', percentage: 35, color: '#10b981' },
      { name: 'Trapézio Superior', percentage: 25, color: '#8b5cf6' }
    ],
    difficulty: 'Iniciante',
    recommendedSets: '4 Séries',
    recommendedReps: '12 a 15 Repetições',
    restTime: '45 seg',
    description: 'O exercício definitivo para dar a ilusão de ombros largos, linha de cintura fina e aspecto estético em V.',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGJ3cmZ4NmxjdzA0cXl3ZnY2M3ZqNnYwaGRvM3Q4cGtvaWRxZXB6YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l378r37Ushxly4Rhu/giphy.gif',
    youtubeVideoId: '3VcKaXpzqRo',
    animationType: 'lateral_raise',
    frames: [
      {
        step: 1,
        title: '1. Posição Neutra',
        description: 'Em pé, pés na largura dos ombros, segure um halter em cada mão ao lado do corpo com os cotovelos levemente flexionados.',
        visualCue: 'Tronco ereto, ombros relaxados e longe das orelhas.',
        focusNote: 'Cotovelos destravados em ângulo constante de ~15°.'
      },
      {
        step: 2,
        title: '2. Elevação em Arco',
        description: 'Eleve os braços para os lados até a altura dos ombros, como se estivesse vertendo água de uma garrafa.',
        visualCue: 'Lidere o movimento pelos cotovelos e não pelas mãos.',
        focusNote: 'Não ultrapasse a linha paralela dos ombros para proteger as articulações.'
      },
      {
        step: 3,
        title: '3. Controle Gravitacional',
        description: 'Desça os halteres devagar resistindo à gravidade por 2 a 3 segundos.',
        visualCue: 'Sinta a queimação concentrada nas laterais dos ombros.',
        focusNote: 'Não use impulso do tronco nem balance as costas.'
      }
    ],
    commonErrors: [
      'Usar impulso das pernas ou tronco (Roubo biomecânico)',
      'Encolher os ombros ativando excessivamente o trapézio',
      'Subir as mãos mais alto do que os cotovelos'
    ],
    proTips: [
      'Projete as mãos levemente para a frente no plano escapular (30° à frente da linha do tronco).'
    ]
  },
  {
    id: 'triceps-pulley',
    category: 'push',
    name: 'Tríceps Pulley / Pulley Cordeiro',
    muscleGroup: 'Tríceps Braquial (Cabeças Lateral & Longa)',
    targetMuscles: [
      { name: 'Tríceps (Cabeça Lateral)', percentage: 90, color: '#3b82f6' },
      { name: 'Tríceps (Cabeça Média/Longa)', percentage: 80, color: '#6366f1' },
      { name: 'Antebraços', percentage: 30, color: '#94a3b8' }
    ],
    difficulty: 'Iniciante',
    recommendedSets: '4 Séries',
    recommendedReps: '10 a 12 Repetições',
    restTime: '45 - 60 seg',
    description: 'Isolamento de precisão para a musculatura posterior do braço, garantindo formato e definição volumosa no tríceps.',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjdhOGY3cmF5aWN6YnJyc2p0NG41Zm8yNzA1NmpidmhocWRyOXE0dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0xezQGU5xCDJuCPe/giphy.gif',
    youtubeVideoId: 'vB5OHsJ3EME',
    animationType: 'triceps_pushdown',
    frames: [
      {
        step: 1,
        title: '1. Ajuste e Posição do Cotovelo',
        description: 'Fique de frente para a polia alta. Segure a corda/barra e cole os cotovelos nas laterais do tronco.',
        visualCue: 'Cotovelos permanecem totalmente estáticos como dobradiças de porta.',
        focusNote: 'Joelho levemente flexionado e tronco inclinado ~5° à frente.'
      },
      {
        step: 2,
        title: '2. Extensão e Abertura',
        description: 'Puxe a carga para baixo até estender completamente os braços. No final da corda, abra levemente as mãos para fora.',
        visualCue: 'Contração máxima do tríceps por 1 segundo no ponto mais baixo.',
        focusNote: 'Mantenha os ombros abaixados e peito aberto.'
      },
      {
        step: 3,
        title: '3. Flexão Negativa Controlada',
        description: 'Permita que a carga suba até a altura do peito, mantendo o controle total.',
        visualCue: 'Não deixe os cotovelos se projetarem para a frente nem se afastarem do corpo.',
        focusNote: 'Apenas os antebraços se movem durante todo o trajeto.'
      }
    ],
    commonErrors: [
      'Mover os cotovelos para a frente e para trás transformando em empurrão de peito',
      'Usar o peso do corpo para "socar" a carga para baixo',
      'Dobrar os punhos para dentro ou para fora de forma dolorosa'
    ],
    proTips: [
      'Esmague o tríceps no final da extensão por 1 segundo a cada repetição.'
    ]
  },

  // ==================== PULL (PUXAR) ====================
  {
    id: 'puxada-alta',
    category: 'pull',
    name: 'Puxada Alta Frente (Lat Pulldown)',
    muscleGroup: 'Dorsais (Latíssimos do Dorso)',
    targetMuscles: [
      { name: 'Latíssimo do Dorso', percentage: 90, color: '#3b82f6' },
      { name: 'Romboide & Trapézio', percentage: 70, color: '#8b5cf6' },
      { name: 'Bíceps Braquial', percentage: 60, color: '#10b981' }
    ],
    difficulty: 'Iniciante',
    recommendedSets: '4 Séries',
    recommendedReps: '10 a 12 Repetições',
    restTime: '60 seg',
    description: 'Movimento vertical fundamental para construir costas em formato de V, fortalecendo a postura e a envergadura dorsal.',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZkZjJkZjVvM2twbzRjcXdrNmtwdjh4OG41bzJ5MmxqY2sydDlsOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif',
    youtubeVideoId: 'CAwf7n6Luuc',
    animationType: 'lat_pulldown',
    frames: [
      {
        step: 1,
        title: '1. Pegada e Ajuste',
        description: 'Ajuste as almofadas sobre as coxas. Segure a barra com pegada aberta e pronada (palmas para a frente).',
        visualCue: 'Peito estufado, leve inclinação do tronco para trás (~15°).',
        focusNote: 'Deprima as escápulas antes de iniciar a puxada.'
      },
      {
        step: 2,
        title: '2. Puxada em Direção ao Peito',
        description: 'Puxe a barra em direção ao topo do peitoral guiando o movimento pelos cotovelos.',
        visualCue: 'Cotovelos apontam diretamente para o chão e para trás.',
        focusNote: 'Contraia as costas ao máximo no ponto inferior.'
      },
      {
        step: 3,
        title: '3. Extensão Excêntrica',
        description: 'Retorne a barra suavemente controlando a subida das dorsais.',
        visualCue: 'Sinta o alongamento completo do latíssimo do dorso no topo.',
        focusNote: 'Inale enquanto a barra retorna.'
      }
    ],
    commonErrors: [
      'Puxar a barra por trás do pescoço (Risco gravíssimo à coluna cervical e manguito)',
      'Balançar o corpo excessivamente usando impulso lombar',
      'Liderar a puxada com os punhos e não com as dorsais'
    ],
    proTips: [
      'Pense em "guardar os cotovelos nos bolsos de trás das calças" para ativar o latíssimo.'
    ]
  },
  {
    id: 'remada-curvada',
    category: 'pull',
    name: 'Remada Curvada com Barra / Halteres',
    muscleGroup: 'Dorsal Média, Romboides e Trapézio',
    targetMuscles: [
      { name: 'Romboides & Trapézio Médio', percentage: 90, color: '#8b5cf6' },
      { name: 'Latíssimo do Dorso', percentage: 80, color: '#3b82f6' },
      { name: 'Eretores da Espinha (Lombar)', percentage: 65, color: '#f59e0b' }
    ],
    difficulty: 'Intermediário',
    recommendedSets: '4 Séries',
    recommendedReps: '8 a 10 Repetições',
    restTime: '75 seg',
    description: 'Exercício composto horizontal para densidade e espessura da musculatura das costas.',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWVmZmIyeGFubjlmdXR5dW5icjFiYml4cnJqdGJwMmpqcHhpdjZxbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufpT6f8p4e7R49O/giphy.gif',
    youtubeVideoId: 'VKFeB7jy8vU',
    animationType: 'bent_over_row',
    frames: [
      {
        step: 1,
        title: '1. Posição da Coluna (Hinge)',
        description: 'Flexione ligeiramente os joelhos e incline o tronco para a frente a ~45° mantendo a coluna completamente neutra.',
        visualCue: 'Cintura e core travados, olhar ligeiramente à frente no chão.',
        focusNote: 'Não arredonde a lombar em hipótese alguma.'
      },
      {
        step: 2,
        title: '2. Puxada Rente às Coxas',
        description: 'Puxe a barra em direção ao umbigo projetando os cotovelos para trás.',
        visualCue: 'Imagine espremer uma noz entre as pás das costas no topo.',
        focusNote: 'Expire na subida da carga.'
      },
      {
        step: 3,
        title: '3. Alongamento Controlado',
        description: 'Abaixe a barra devagar estendendo os braços sem perca da postura neutra.',
        visualCue: 'Manutenção da tensão muscular nas dorsais.',
        focusNote: 'Inale na fase descendente.'
      }
    ],
    commonErrors: [
      'Arredondar a coluna torácica e lombar durante o movimento',
      'Elevar o tronco transformando a remada num encolhimento de ombros',
      'Usar impulso dos joelhos para dar "trancos" na carga'
    ],
    proTips: [
      'Gire os cotovelos levemente para dentro ao puxar para focar no miolo das costas.'
    ]
  },
  {
    id: 'rosca-direta',
    category: 'pull',
    name: 'Rosca Direta com Barra W / Halteres',
    muscleGroup: 'Bíceps Braquial & Braquial',
    targetMuscles: [
      { name: 'Bíceps (Cabeça Longa & Curtas)', percentage: 95, color: '#10b981' },
      { name: 'Braquiorradial (Antebraço)', percentage: 60, color: '#6366f1' }
    ],
    difficulty: 'Iniciante',
    recommendedSets: '4 Séries',
    recommendedReps: '10 a 12 Repetições',
    restTime: '45 seg',
    description: 'O clássico construtor de picos e força no bíceps, focado na flexão e supinação dos braços.',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTYxejNmMXkzdnhrbHJydG81YjhreGtzcGF5NXo4MnlubXp2enU1bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufaU91M0Jz1J4hG/giphy.gif',
    youtubeVideoId: 'in7PaeYlhrM',
    animationType: 'biceps_curl',
    frames: [
      {
        step: 1,
        title: '1. Posição Inicial Fixo',
        description: 'Em pé, pés na largura dos quadris, segure a barra com pegada supinada (palmas para cima) e cotovelos colados ao tronco.',
        visualCue: 'Peito aberto, ombros travados para trás.',
        focusNote: 'Cotovelos permanecem no mesmo ponto o tempo todo.'
      },
      {
        step: 2,
        title: '2. Flexão de Braço',
        description: 'Eleve a barra flexionando os cotovelos até a contratada máxima do bíceps no topo.',
        visualCue: 'Movimento exclusivo dos antebraços sem balançar o quadril.',
        focusNote: 'Não projete os cotovelos para a frente.'
      },
      {
        step: 3,
        title: '3. Descida Excêntrica Suave',
        description: 'Desça a carga controlando a gravidade em 2 a 3 segundos.',
        visualCue: 'Alongamento completo no ponto final sem soltar o peso.',
        focusNote: 'Não trave bruscamente na extensão.'
      }
    ],
    commonErrors: [
      'Balançar o tronco para trás (Gangorra/Roubo lombar)',
      'Levantar os cotovelos transformando o exercício em elevação frontal',
      'Fazer apenas meia repetição (Amplitude reduzida)'
    ],
    proTips: [
      'Aperte a barra com firmeza e gire suavemente os mindinhos para cima no topo para pico de contração.'
    ]
  },

  // ==================== LEGS (PERNAS) ====================
  {
    id: 'agachamento-livre',
    category: 'legs',
    name: 'Agachamento Livre com Barra / Halteres',
    muscleGroup: 'Quadríceps, Glúteos e Posterior',
    targetMuscles: [
      { name: 'Quadríceps', percentage: 95, color: '#10b981' },
      { name: 'Glúteo Máximo', percentage: 85, color: '#f59e0b' },
      { name: 'Posterior & Core', percentage: 70, color: '#ec4899' }
    ],
    difficulty: 'Avançado',
    recommendedSets: '4 Séries',
    recommendedReps: '8 a 10 Repetições',
    restTime: '90 seg',
    description: 'O rei dos treinos de perna. Ativação sistêmica massiva de membros inferiores, fortalecimento ósseo e queima calórica intensa.',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZqNXZ2eXdkbnM1a2t3NWRvZnlxajMwcjlhbnYybTR3MjhzaXVzaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufp3X2Yv38E227C/giphy.gif',
    youtubeVideoId: 'ultWZbUMPL8',
    animationType: 'squat',
    frames: [
      {
        step: 1,
        title: '1. Apoio e Base',
        description: 'Pés ligeiramente mais abertos que a largura dos ombros, pontas apontando ligeiramente para fora (~30°). Apoie a barra no trapézio.',
        visualCue: 'Olhar horizonte, peito estufado e abdômen pressurizado (Manobra de Valsalva).',
        focusNote: 'Pés totalmente plantados no chão (pressão no calcanhar e dedão).'
      },
      {
        step: 2,
        title: '2. Agachamento Profundo',
        description: 'Inicie o movimento dobrando quadris e joelhos simultaneamente, descendo até as coxas ficarem paralelas ao chão (ou abaixo).',
        visualCue: 'Os joelhos acompanham a direção das pontas dos pés sem "valgo dinâmico" (não fecham para dentro).',
        focusNote: 'Mantenha a curvatura natural da lombar.'
      },
      {
        step: 3,
        title: '3. Subida Tripla Extensão',
        description: 'Empurre o chão com força total através dos calcanhares, estendendo joelhos e quadris até a posição inicial.',
        visualCue: 'Expiração ao passar do ponto de travamento.',
        focusNote: 'Mantenha o peito elevado durante toda a subida.'
      }
    ],
    commonErrors: [
      'Valgo Dinâmico: Deixar os joelhos colapsarem para dentro na subida',
      'Retroversão Pélvica ("Butt Wink"): Arredondar a lombar no fundo',
      'Tirar os calcanhares do chão projetando todo o peso na ponta dos pés'
    ],
    proTips: [
      'Empurre o chão como se quisesse "rasgar a terra" com os pés para fora para ativar os glúteos médios.'
    ]
  },
  {
    id: 'leg-press',
    category: 'legs',
    name: 'Leg Press 45°',
    muscleGroup: 'Quadríceps & Glúteos',
    targetMuscles: [
      { name: 'Quadríceps (Vasto Lateral e Medial)', percentage: 90, color: '#10b981' },
      { name: 'Glúteo Máximo', percentage: 75, color: '#f59e0b' },
      { name: 'Panturrilhas', percentage: 30, color: '#94a3b8' }
    ],
    difficulty: 'Intermediário',
    recommendedSets: '4 Séries',
    recommendedReps: '10 a 12 Repetições',
    restTime: '60 - 90 seg',
    description: 'Permite trabalhar volume de carga elevado em quadríceps com segurança e suporte completo para a coluna.',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3ptYWtwdTN6NmRmcGVseDdkb3kzdWRsdzFydjRzazR2NHhrNGpzNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufb8D0aA2cQ723m/giphy.gif',
    youtubeVideoId: 'IZxyjW7MPJQ',
    animationType: 'leg_press',
    frames: [
      {
        step: 1,
        title: '1. Posição dos Pés na Plataforma',
        description: 'Apoie as costas e o quadril firmemente no encosto. Pés na largura do quadril na metade da plataforma.',
        visualCue: 'Lombar totalmente colada ao banco sem espaço.',
        focusNote: 'Destrave a trava de segurança segurando os apoios laterais.'
      },
      {
        step: 2,
        title: '2. Flexão de Joelhos (Excêntrica)',
        description: 'Desça a plataforma dobrando os joelhos em direção ao peito em ângulo de ~90°.',
        visualCue: 'Controle o peso sem deixar a plataforma despencar.',
        focusNote: 'Não descole o quadril do encosto no ponto mais baixo.'
      },
      {
        step: 3,
        title: '3. Empurrão de Calcanhar',
        description: 'Empurre a plataforma de volta sem travar totalmente as articulações dos joelhos no topo.',
        visualCue: 'Manutenção da tensão constante no quadríceps.',
        focusNote: 'Expire durante a força de empurrão.'
      }
    ],
    commonErrors: [
      'Descolar o quadril e a lombar do encosto (Compressão gravíssima nos discos L4-L5)',
      'Travar totalmente e hiperestender os joelhos no topo (Risco de lesão articular)',
      'Colocar as mãos sobre os joelhos para empurrar'
    ],
    proTips: [
      'Ajuste o ângulo do encosto do banco para 45° e mantenha as mãos firmes nas pegadas de apoio.'
    ]
  },
  {
    id: 'stiff-rdl',
    category: 'legs',
    name: 'Stiff / Levantamento Terra Romeno (RDL)',
    muscleGroup: 'Posterior de Coxa (Isquiotibiais) & Glúteos',
    targetMuscles: [
      { name: 'Isquiotibiais (Posterior)', percentage: 95, color: '#ec4899' },
      { name: 'Glúteo Máximo', percentage: 90, color: '#f59e0b' },
      { name: 'Eretores da Espinha', percentage: 70, color: '#6366f1' }
    ],
    difficulty: 'Intermediário',
    recommendedSets: '4 Séries',
    recommendedReps: '10 a 12 Repetições',
    restTime: '60 seg',
    description: 'Exercício mestre de extensão de quadril para modelar os posteriores de coxa e erguer a linha do glúteo.',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGJ3cmZ4NmxjdzA0cXl3ZnY2M3ZqNnYwaGRvM3Q4cGtvaWRxZXB6YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKT7gSMywy138oU/giphy.gif',
    youtubeVideoId: 'XowKKeBInU0',
    animationType: 'stiff',
    frames: [
      {
        step: 1,
        title: '1. Posição Inicial e Dobradiça de Quadril',
        description: 'Em pé, pés na largura dos quadris, segure a barra/halteres junto às coxas. Joelhos levemente destravados (~15°).',
        visualCue: 'Coluna perfeitamente neutra e escápulas retraídas.',
        focusNote: 'O movimento ocorre no quadril, não nos joelhos.'
      },
      {
        step: 2,
        title: '2. Projeção do Quadril para Trás',
        description: 'Empurre o bumbum para trás como se quisesse tocar a parede atrás de você, deslizando a carga rente às pernas.',
        visualCue: 'Desça até sentir o alongamento máximo dos posteriores de coxa.',
        focusNote: 'Mantenha a barra colada nas canelas.'
      },
      {
        step: 3,
        title: '3. Retorno com Contração de Glúteos',
        description: 'Empurre o quadril para a frente contraindo os glúteos e posteriores para retornar à posição ereta.',
        visualCue: 'Finalize o movimento em pé sem hiperextender a lombar para trás.',
        focusNote: 'Expire no topo da subida.'
      }
    ],
    commonErrors: [
      'Arredondar as costas na descida querendo encostar a barra no chão a qualquer custo',
      'Dobrar demais os joelhos transformando o Stiff num agachamento',
      'Afastar a barra das pernas aumentando o braço de alavanca na lombar'
    ],
    proTips: [
      'Pense no Stiff como um movimento de "ir para trás com o quadril" e não de "ir para baixo com as mãos".'
    ]
  }
];

interface PushWorkoutGuideProps {
  onApplyWorkoutToPlan?: (exerciseNames: string[]) => void;
  onStartTimerForExercise?: (exerciseName: string) => void;
}

export function PushWorkoutGuide({ onApplyWorkoutToPlan, onStartTimerForExercise }: PushWorkoutGuideProps) {
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory>('push');
  
  // Filter list by selected category
  const filteredExercises = ALL_PPL_EXERCISES_DATA.filter(e => e.category === selectedCategory);
  
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDetail>(filteredExercises[0]);
  const [activeFrameIdx, setActiveFrameIdx] = useState<number>(0);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState<boolean>(true);
  const [animSpeed, setAnimSpeed] = useState<number>(1); // 0.5x, 1x, 1.5x
  const [animPhase, setAnimPhase] = useState<'concentric' | 'pause' | 'eccentric'>('concentric');
  const [animProgress, setAnimProgress] = useState<number>(0); // 0 to 100%

  // Failed GIFs fallback tracker
  const [failedGifs, setFailedGifs] = useState<Set<string>>(new Set());
  
  // Visual Mode Switch: 'gif' (GIF & Video Embed) vs 'vector' (SVG Biomechanical Engine)
  const [visualMode, setVisualMode] = useState<'gif' | 'vector'>('gif');

  // Video Modal State for 1-Click Play
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);
  const [activeVideoId, setActiveVideoId] = useState<string>('');
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>('');

  // Update selected exercise when category changes if needed
  useEffect(() => {
    const list = ALL_PPL_EXERCISES_DATA.filter(e => e.category === selectedCategory);
    if (list.length > 0 && !list.some(e => e.id === selectedExercise.id)) {
      setSelectedExercise(list[0]);
      setActiveFrameIdx(0);
      setAnimProgress(0);
    }
  }, [selectedCategory]);

  // Simulation loop for vector biomechanical simulator
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlayingAnimation && visualMode === 'vector') {
      const stepTime = 30 / animSpeed;
      interval = setInterval(() => {
        setAnimProgress((prev) => {
          if (prev >= 100) {
            setAnimPhase((p) => {
              if (p === 'concentric') return 'pause';
              if (p === 'pause') return 'eccentric';
              return 'concentric';
            });
            return 0;
          }
          return prev + 2;
        });
      }, stepTime);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingAnimation, animSpeed, animPhase, visualMode]);

  // Sync activeFrameIdx with progress if vector mode is playing
  useEffect(() => {
    if (!isPlayingAnimation || visualMode !== 'vector') return;
    const totalFrames = selectedExercise.frames.length;
    const calcFrame = Math.floor((animProgress / 100) * totalFrames);
    if (calcFrame < totalFrames) {
      setActiveFrameIdx(calcFrame);
    }
  }, [animProgress, isPlayingAnimation, selectedExercise, visualMode]);

  const handleSelectExercise = (ex: ExerciseDetail) => {
    setSelectedExercise(ex);
    setActiveFrameIdx(0);
    setAnimProgress(0);
    setAnimPhase('concentric');
  };

  const handleOpenVideo = (videoId: string, title: string) => {
    setActiveVideoId(videoId);
    setActiveVideoTitle(title);
    setVideoModalOpen(true);
  };

  const categoryLabels: Record<WorkoutCategory, { name: string; desc: string; color: string; icon: string }> = {
    push: { name: 'Push (Empurrar)', desc: 'Peitoral • Ombros • Tríceps', color: 'from-indigo-600 to-blue-600', icon: '💪' },
    pull: { name: 'Pull (Puxar)', desc: 'Costas • Bíceps • Antebraços', color: 'from-purple-600 to-indigo-600', icon: '🪢' },
    legs: { name: 'Legs (Pernas)', desc: 'Quadríceps • Posteriores • Glúteos', color: 'from-emerald-600 to-teal-600', icon: '🦵' }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER WITH PPL SWITCHER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-indigo-500/20">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Dumbbell className="w-48 h-48 text-indigo-400" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" /> Guia Interativo PPL • Animações & Vídeos HD
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">
              Push / Pull / Legs
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight mb-2">
            Central Biomecânica de Exercícios com GIFs & Player de Vídeo
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6">
            Alterne entre as divisões de treino Push (Empurrar), Pull (Puxar) e Legs (Pernas). Assista a vídeos de execução técnica com 1-clique, GIFs de alta definição e simulações biomecânicas.
          </p>

          {/* PPL CATEGORY SELECTOR BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {(['push', 'pull', 'legs'] as WorkoutCategory[]).map((cat) => {
              const isSelected = selectedCategory === cat;
              const meta = categoryLabels[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 relative overflow-hidden ${
                    isSelected
                      ? `bg-gradient-to-r ${meta.color} text-white border-white/20 shadow-lg shadow-indigo-500/20 scale-[1.02]`
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                  }`}
                >
                  <span className="text-2xl">{meta.icon}</span>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wide">{meta.name}</h4>
                    <p className="text-[10px] text-slate-300 opacity-90">{meta.desc}</p>
                  </div>
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Action Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (onApplyWorkoutToPlan) {
                  const listNames = filteredExercises.map(e => `${e.name} (${e.recommendedSets} - ${e.recommendedReps})`);
                  onApplyWorkoutToPlan(listNames);
                } else {
                  alert(`Treino ${categoryLabels[selectedCategory].name} ativado no seu plano!`);
                }
              }}
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              Aplicar Ficha {categoryLabels[selectedCategory].name} Completa ao Meu Plano
            </button>

            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-indigo-400" /> {filteredExercises.length} Exercícios nesta divisão
            </span>
          </div>

        </div>
      </div>

      {/* EXERCISE SELECTION CHIPS FOR ACTIVE CATEGORY */}
      <div className="flex overflow-x-auto gap-2.5 pb-2 scrollbar-none">
        {filteredExercises.map((ex) => {
          const isSelected = selectedExercise.id === ex.id;
          return (
            <button
              key={ex.id}
              onClick={() => handleSelectExercise(ex)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <Dumbbell className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
              <span>{ex.name}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN VISUALIZER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: GIF / VIDEO & BIOMECHANICAL SIMULATOR (7 COLS) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          
          {/* Top Title, Muscle Tags & View Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 dark:text-indigo-400">
                {selectedExercise.muscleGroup}
              </span>
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">
                {selectedExercise.name}
              </h3>
            </div>

            {/* View Mode Toggle Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setVisualMode('gif')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  visualMode === 'gif'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>GIF & Vídeo HD</span>
              </button>

              <button
                type="button"
                onClick={() => setVisualMode('vector')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  visualMode === 'vector'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-amber-300" />
                <span>Simulação VETOR</span>
              </button>
            </div>
          </div>

          {/* VISUAL DISPLAY CONTAINER (GIF MODE OR VECTOR MODE) */}
          {visualMode === 'gif' ? (
            /* GIF / YOUTUBE THUMBNAIL CONTAINER WITH AUTOMATIC FALLBACK */
            <div className="relative w-full h-80 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 group shadow-inner flex items-center justify-center">
              
              {/* Check if GIF has failed or fallback is active */}
              {failedGifs.has(selectedExercise.id) ? (
                /* YOUTUBE THUMBNAIL FALLBACK */
                <div className="relative w-full h-full">
                  <img
                    src={`https://img.youtube.com/vi/${selectedExercise.youtubeVideoId}/hqdefault.jpg`}
                    alt={`Execução técnica de ${selectedExercise.name}`}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Fallback Notice */}
                  <div className="absolute top-3 left-3 bg-amber-500/20 backdrop-blur-md border border-amber-500/40 px-3 py-1 rounded-full text-[10px] font-bold text-amber-300 flex items-center gap-1 z-10">
                    <ShieldAlert className="w-3.5 h-3.5" /> Thumbnail do Vídeo Técnico (GIF Fallback)
                  </div>
                </div>
              ) : (
                /* ANIMATED DEMO GIF */
                <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                  <img
                    src={selectedExercise.gifUrl}
                    alt={`Animação GIF ${selectedExercise.name}`}
                    onError={() => {
                      setFailedGifs(prev => new Set(prev).add(selectedExercise.id));
                    }}
                    className="w-full h-full object-cover max-h-80 opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* OVERLAY PLAY BUTTON FOR EMBEDDED VIDEO MODAL */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 pointer-events-none">
                <button
                  type="button"
                  onClick={() => handleOpenVideo(selectedExercise.youtubeVideoId, selectedExercise.name)}
                  className="p-4 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-2xl shadow-red-600/50 transform group-hover:scale-110 transition-all pointer-events-auto flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </button>
                <span className="mt-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-white text-xs font-black rounded-xl border border-slate-700 pointer-events-auto flex items-center gap-1.5 shadow-md">
                  <Video className="w-3.5 h-3.5 text-red-500" /> Clique para assistir o Vídeo Técnico Completo
                </span>
              </div>

              {/* Top badge */}
              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[10px] font-mono text-slate-300">
                HD 1080p • 1-Click Play
              </div>
            </div>
          ) : (
            /* VECTOR BIOMECANICAL ENGINE (SVG ANIMATED SIMULATOR) */
            <div className="relative w-full h-80 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-4">
              
              {/* Grid background effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

              {/* Animation Phase Indicator Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  animPhase === 'concentric' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : animPhase === 'pause'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                  Fase: {animPhase === 'concentric' ? 'Subida / Concéntrica' : animPhase === 'pause' ? 'Pausa / Isometria' : 'Descida / Excêntrica'}
                </span>
              </div>

              {/* Live Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 z-20">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-indigo-500 transition-all duration-75"
                  style={{ width: `${animProgress}%` }}
                />
              </div>

              {/* SVG WORKOUT ANIMATION COMPONENT */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 400 300" className="w-full h-full max-h-64 select-none">
                  <defs>
                    <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="barbellGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="50%" stopColor="#f8fafc" />
                      <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>
                  </defs>

                  {/* DEFAULT BIOMECHANICAL VECTOR PRESENTATION */}
                  <g>
                    {/* Bench / Platform */}
                    <rect x="100" y="210" width="200" height="16" rx="4" fill="#334155" />
                    <rect x="130" y="226" width="12" height="40" fill="#1e293b" />
                    <rect x="250" y="226" width="12" height="40" fill="#1e293b" />

                    {/* Human Body Representation */}
                    <circle cx="130" cy="195" r="14" fill="#cbd5e1" />
                    <rect x="144" y="188" width="110" height="22" rx="10" fill="#475569" />
                    
                    {/* Muscle Highlight Area */}
                    <circle cx="185" cy="198" r="16" fill="#10b981" opacity={0.8} filter="url(#glow-emerald)" />

                    {/* Motion Barbell */}
                    {(() => {
                      const factor = animPhase === 'concentric' ? (animProgress / 100) : animPhase === 'pause' ? 1 : 1 - (animProgress / 100);
                      const barY = 165 - (factor * 50);

                      return (
                        <g>
                          <line x1="175" y1="195" x2="175" y2={barY} stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                          <line x1="215" y1="195" x2="215" y2={barY} stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                          <rect x="80" y={barY - 4} width="240" height="8" rx="2" fill="url(#barbellGrad)" />
                          <rect x="85" y={barY - 20} width="12" height="40" rx="3" fill="#10b981" />
                          <rect x="303" y={barY - 20} width="12" height="40" rx="3" fill="#10b981" />
                        </g>
                      );
                    })()}
                  </g>
                </svg>
              </div>

              {/* Vector Controls Toolbar */}
              <div className="absolute bottom-3 left-3 right-3 z-20 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlayingAnimation(!isPlayingAnimation)}
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {isPlayingAnimation ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlayingAnimation ? 'Pausar' : 'Reproduzir'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAnimProgress(0);
                      setAnimPhase('concentric');
                    }}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-bold transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-mono mr-1">Velocidade:</span>
                  {[0.5, 1, 1.5].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setAnimSpeed(spd)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer ${
                        animSpeed === spd
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Muscle Activation Progress Bars */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-500" />
              Ativação Muscular Alvo (Análise Biomecânica de IA)
            </h4>

            <div className="space-y-2.5">
              {selectedExercise.targetMuscles.map((tm, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{tm.name}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{tm.percentage}% Ativação</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${tm.percentage}%`, backgroundColor: tm.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: STEP-BY-STEP FRAME SEQUENCE & PRO TIPS (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* STEP-BY-STEP FRAME BREAKDOWN CARDS */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                Sequência Quadro-a-Quadro ({selectedExercise.frames.length} Etapas)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Passe para analisar</span>
            </div>

            <div className="space-y-3">
              {selectedExercise.frames.map((frame, idx) => {
                const isActive = activeFrameIdx === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setIsPlayingAnimation(false);
                      setActiveFrameIdx(idx);
                      setAnimProgress(((idx + 1) / selectedExercise.frames.length) * 100);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500/80 shadow-sm'
                        : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className={`text-xs font-bold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-white'}`}>
                        {frame.title}
                      </span>
                      {isActive && (
                        <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-extrabold rounded-md uppercase tracking-wider shrink-0">
                          Em Foco
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                      {frame.description}
                    </p>

                    <div className="p-2 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                      <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-300 font-semibold">
                        <Eye className="w-3.5 h-3.5 shrink-0" />
                        <span>Ponto Visual: {frame.visualCue}</span>
                      </div>
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                        💡 {frame.focusNote}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COMMON ERRORS & PRO TIPS */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            
            {/* Common Errors */}
            <div>
              <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Erros Frequentes a Evitar (Biossegurança)
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedExercise.commonErrors.map((err, i) => (
                  <li key={i} className="flex items-start gap-2 bg-rose-50/50 dark:bg-rose-950/20 p-2 rounded-xl border border-rose-100 dark:border-rose-900/30">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Tips */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Dica de Ouro de Biomecânica da IA
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedExercise.proTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleOpenVideo(selectedExercise.youtubeVideoId, selectedExercise.name)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Video className="w-4 h-4" />
                Assistir Vídeo de Execução Técnica no YouTube
              </button>

              <button
                onClick={() => {
                  if (onStartTimerForExercise) {
                    onStartTimerForExercise(selectedExercise.name);
                  } else {
                    alert(`Iniciando cronômetro guiado para: ${selectedExercise.name}`);
                  }
                }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Iniciar Cronômetro Guiado de {selectedExercise.name.split(' ')[0]}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* EMBEDDED YOUTUBE VIDEO MODAL */}
      <AnimatePresence>
        {videoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-600/20 text-red-500 rounded-xl">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">
                      {activeVideoTitle}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Execução Técnica & Biomecânica em Vídeo HD
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* YouTube Player Iframe */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={`Vídeo técnico ${activeVideoTitle}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Observação: Mantenha a cadência de 3 segundos na fase excêntrica.
                </span>

                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Fechar Vídeo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
