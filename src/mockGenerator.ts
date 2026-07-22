import { QuestionnaireData, LevePlan, DayPlan, Meal, Recipe, Workout, ShoppingCategory } from './types';

export function generateMealsForDay(dayNumber: number, data: QuestionnaireData, caloriasAlvo: number): Meal[] {
  const isVegano = data.restricoesAlimentares.toLowerCase().includes('vegan') || data.restricoesAlimentares.toLowerCase().includes('vegetar');

  const refeicoesEsquema = [
    { nome: 'Café da Manhã', horario: '07:30', caloriasPct: 0.25 },
    { nome: 'Lanche da Manhã', horario: '10:00', caloriasPct: 0.10 },
    { nome: 'Almoço', horario: '12:30', caloriasPct: 0.35 },
    { nome: 'Lanche da Tarde', horario: '16:00', caloriasPct: 0.15 },
    { nome: 'Jantar', horario: '19:30', caloriasPct: 0.15 }
  ];

  let refeicoesDefinidas = [];
  if (data.quantidadeRefeicoes === 3) {
    refeicoesDefinidas = [refeicoesEsquema[0], refeicoesEsquema[2], refeicoesEsquema[4]];
  } else if (data.quantidadeRefeicoes === 4) {
    refeicoesDefinidas = [refeicoesEsquema[0], refeicoesEsquema[2], refeicoesEsquema[3], refeicoesEsquema[4]];
  } else {
    refeicoesDefinidas = [...refeicoesEsquema];
  }

  const cafeVariations = [
    ['Ovos mexidos com chia (2 unid)', 'Torrada 100% integral', 'Mamão papaia (1/2 unid) com aveia', 'Café preto ou chá sem açúcar'],
    ['Crepioca recheada com ricota e orégano', '1/2 abacate com gotas de limão', 'Chá verde gelado com hortelã', '1 mexerica'],
    ['Panqueca de banana, aveia e canela', 'Ovo pochê preparado com pimenta do reino', 'Café com leite vegetal ou desnatado', '5 morangos'],
    ['Pão de forma integral tostado com gergelim', 'Ovos estalados na água (2 unid)', '1 kiwi fresco', 'Chá de hibisco'],
    ['Smoothie proteico de banana, aveia e cacau 100%', 'Torrada com pasta de gergelim (tahine)', 'Chá de erva-doce', '1 fatia de melão'],
    ['Tapioca leve com sementes de chia e queijo branco', '1 ovo mexido com cúrcuma', 'Suco verde detox (couve, limão e gengibre)', '1 pera'],
    ['Mingau quente de aveia com morango e canela', 'Chá de camomila morno', '1 colher de sobremesa de castanhas moídas'],
    ['Omelete de claras com espinafre e tomate cereja', 'Pão de centeio integral (1 fatia)', 'Café preto', '1/2 mamão papaia'],
    ['Waffle saudável de aveia e ovo', 'Geleia de frutas vermelhas sem açúcar', '1 copo de água de coco', 'Nectarina ou ameixa'],
    ['Pão integral com patê de atum/ricota leve', 'Chá mate com gotas de limão', '1 banana pequena salpicada com canela']
  ];

  const lancheManhaVariations = [
    ['Iogurte natural desnatado/vegetal', '5 morangos frescos', 'Punhado pequeno de castanhas de caju (15g)'],
    ['1 maçã verde com casca', '4 nozes secas', 'Chá de erva-cidreira'],
    ['Salada de frutas frescas (mamão, kiwi e laranja)', '1 colher de chá de sementes de chia'],
    ['Mix de castanhas e amêndoas (20g)', '1 ameixa fresca', 'Água aromatizada com hortelã'],
    ['Biscoito de arroz integral com pasta de amendoim sem açúcar', 'Chá verde gelado'],
    ['Smoothie leve de morango com leite de amêndoas', '1 colher de farelo de linhaça'],
    ['1 banana pequena assada com canela', '2 castanhas do Pará'],
    ['Iogurte proteico zero lactose', 'Mirtilos frescos (10 unid)'],
    ['1 mexerica ou bergamota fresca', 'Amêndoas tostadas sem sal (10 unid)'],
    ['Chips de maçã assada crocante', 'Chá de camomila bem gelado']
  ];

  const almocoVariations = [
    ['Peito de frango grelhado (120g)', 'Arroz integral (3 col de sopa)', 'Feijão preto temperado', 'Salada de alface, tomate e brócolis ao vapor'],
    ['Tilápia assada ao limão e ervas', 'Purê de batata-doce leve', 'Aspargos salteados e salada verde com pepino'],
    ['Carne moída magra (patinho) com abobrinha', 'Quinoa cozida com legumes', 'Salada de rúcula com manga e azeite extra virgem'],
    ['Iscas de filé mignon suíno magro', 'Mandioca cozida com salsinha', 'Couve refogada no alho e salada colorida'],
    ['Sobrecoxa de frango assada sem pele', 'Arroz de couve-flor e lentilhas', 'Salada de acelga, cenoura ralada e gergelim'],
    ['Filé de peixe grelhado na manteiga clarificada', 'Batata assada com alecrim e azeite', 'Mix de folhas crespas e pimentões'],
    ['Strogonoff fit de frango com creme de ricota', 'Arroz integral cozido', 'Salada de tomate, orégano e palmito'],
    ['Escondidinho de purê de abóbora com carne desfiada magra', 'Mix de folhas verdes', 'Brócolis e vagem no vapor'],
    ['Hambúrguer caseiro de patinho grelhado', 'Purê de mandioquinha leve', 'Salada de repolho roxo e verde com cenoura'],
    ['Moqueca leve de peixe com leite de coco light', 'Arroz integral', 'Salada de alface americana com tomate cereja']
  ];

  const lancheTardeVariations = [
    ['Panqueca de ovo e aveia com canela', 'Chá de hibisco gelado com limão', '1 maçã pequena'],
    ['Ovos de codorna temperados (5 unid)', 'Chá verde morno', '1 fatia de melancia'],
    ['Cookie caseiro de aveia, cacau e banana', 'Chá de erva-doce sem açúcar'],
    ['Pão integral leve com patê de frango e cenoura', 'Suco de limão natural'],
    ['Vitamina de banana, leite de amêndoas e aveia', '1 colher de sobremesa de sementes de girassol'],
    ['Wrap integral leve com queijo cottage e espinafre', 'Chá mate gelado'],
    ['Omelete simples de 1 ovo com cheiro verde', 'Chá de camomila', '1 pera com casca'],
    ['Bolinho de caneca fit de banana e cacau 70%', 'Chá de hortelã fresco'],
    ['Iogurte natural com sementes de abóbora tostadas', '5 morangos'],
    ['Torrada integral com guacamole artesanal (abacate + tomate)', 'Chá verde']
  ];

  const jantarVariations = [
    ['Sopa cremosa de legumes com frango desfiado', 'Salada de folhas verdes com azeite de oliva', 'Chá de camomila antes de dormir'],
    ['Tilápia grelhada no azeite', 'Salada morna de brócolis, couve-flor e cenoura', 'Chá de erva-cidreira'],
    ['Omelete recheado com peito de frango e tomate', 'Salada de alface e pepino', 'Chá de hortelã'],
    ['Sopa de abóbora cabotiá com gengibre e patinho moído', 'Sementes de girassol tostadas por cima'],
    ['Salada completa: folhas verdes, atum em água, ovo cozido e azeite', 'Chá de melissa morno'],
    ['Crepioca leve de espinafre e ricota', 'Salada de tomate e orégano', 'Chá de camomila'],
    ['Filé de frango ao molho de tomate caseiro', 'Purê de batata-doce (2 colheres)', 'Salada de rúcula'],
    ['Caldo verde fit com couve fatiada e lombo desfiado magro', 'Azeite extra virgem'],
    ['Shakshuka leve (ovos pochê em molho de tomate com pimentão)', 'Mix de folhas verdes'],
    ['Ensopado de peixe com legumes variados', 'Salada de acelga fatiada com limão']
  ];

  const index = (dayNumber - 1) % 10;

  return refeicoesDefinidas.map((r) => {
    let rawList: string[] = [];
    if (r.nome === 'Café da Manhã') rawList = cafeVariations[index];
    else if (r.nome === 'Lanche da Manhã') rawList = lancheManhaVariations[index];
    else if (r.nome === 'Almoço') rawList = almocoVariations[index];
    else if (r.nome === 'Lanche da Tarde') rawList = lancheTardeVariations[index];
    else if (r.nome === 'Jantar') rawList = jantarVariations[index];

    if (isVegano) {
      rawList = rawList.map(item => 
        item.replace(/frango|carne|patinho|peixe|tilápia|salmon|lombo|atum/gi, 'tofu/cogumelos/proteína de ervilha')
            .replace(/ovos|ovo/gi, 'tofu mexido/grãomelete')
            .replace(/iogurte|queijo|ricota|cottage/gi, 'iogurte vegetal/queijo de castanhas')
      );
    }

    const cal = Math.round(caloriasAlvo * r.caloriasPct);
    return {
      nome: r.nome,
      horario: r.horario,
      alimentos: rawList,
      calorias: cal
    };
  });
}

export function generateMockPlan(data: QuestionnaireData): LevePlan {
  // Calculando hidratação recomendada: 35ml por kg de peso
  const metaAgua = Math.max(2000, Math.round(data.peso * 35));
  
  // Calculando calorias aproximadas (Taxa Metabólica Basal simplificada + nível atividade)
  let tmb = data.sexo === 'Masculino' 
    ? (10 * data.peso) + (6.25 * data.altura) - (5 * data.idade) + 5
    : (10 * data.peso) + (6.25 * data.altura) - (5 * data.idade) - 161;
  
  let fatorAtividade = 1.2;
  if (data.nivelAtividade === 'Levemente ativo') fatorAtividade = 1.375;
  else if (data.nivelAtividade === 'Moderadamente ativo') fatorAtividade = 1.55;
  else if (data.nivelAtividade === 'Muito ativo') fatorAtividade = 1.725;
  else if (data.nivelAtividade === 'Extremamente ativo') fatorAtividade = 1.9;

  const tdee = tmb * fatorAtividade;
  // Déficit calórico saudável de ~500 kcal para perda de peso
  const caloriasAlvo = Math.max(1200, Math.round(tdee - 500));

  // 1. Gerando Plano de 30 Dias
  const plano30Dias: DayPlan[] = [];
  const focos = [
    'Adaptação Alimentar e Organização',
    'Foco na Hidratação e Termogênese',
    'Consciência da Fome vs. Vontade de Comer',
    'Aumento de Fibra e Saciedade',
    'Introdução à Rotina de Exercícios',
    'Consistência e Qualidade do Sono',
    'Avaliação de Medidas e Ajustes',
    'Combate à Retenção de Líquidos',
    'Trocas Inteligentes (Substituições)',
    'Foco em Proteínas de Alta Qualidade',
    'Mindful Eating (Comer com Atenção)',
    'Fortalecimento Mental e Disciplina',
    'Constância nos Exercícios',
    'Revisão da Primeira Quinzena',
    'Desafio de Alimentos Integrais',
    'Higiene do Sono para Controle do Cortisol',
    'Otimização do Treino Diário',
    'Lidando com Situações Sociais',
    'Prevenção de Beliscos Noturnos',
    'Aceleração do Metabolismo Saudável',
    'Consistência no Plano Alimentar',
    'Foco em Alimentos Naturais (Descascar mais, desembalar menos)',
    'Ajuste fino de Carboidratos Complexos',
    'Melhoria do Desempenho Físico',
    'Preparo Antecipado (Marmitas)',
    'Controle da Ansiedade e Prática de Respiração',
    'Redução de Ultraprocessados',
    'Consolidação de Hábitos de Hidratação',
    'Foco na Resiliência e Metas de Longo Prazo',
    'Vitória dos 30 Dias e Planejamento Futuro'
  ];

  const frasesMotivacionais = [
    "O primeiro passo para vencer é decidir que você não vai ficar onde está.",
    "A constância supera a intensidade. Faça o seu melhor hoje!",
    "Cada refeição saudável é um voto para a pessoa que você deseja se tornar.",
    "Beba água! Seu corpo muitas vezes confunde sede com fome.",
    "O exercício não é um castigo pelo que você comeu, é uma celebração do que seu corpo pode fazer.",
    "Grandes resultados requerem pequenas ações consistentes diárias.",
    "Você não precisa ser perfeito, você só precisa ser constante.",
    "O peso na balança é apenas um número, foque em como você se sente e nas suas roupas.",
    "Durma bem hoje. O descanso de qualidade regula os hormônios da fome e saciedade.",
    "Planeje suas refeições. Quem não planeja, planeja falhar.",
    "Substitua a motivação pela disciplina. A motivação passa, o hábito fica.",
    "Um deslize não anula todo o seu esforço. Recomece na próxima refeição.",
    "Foque em adicionar alimentos saudáveis em vez de apenas cortar os ruins.",
    "Parabéns por chegar à metade do desafio! Sua determinação é inspiradora.",
    "O ingrediente mais saudável em qualquer refeição é a paciência.",
    "O sono de qualidade é o herói silencioso do emagrecimento.",
    "Desafie-se a ir um pouco mais longe hoje no seu treino.",
    "Aprenda a ouvir os sinais de saciedade do seu próprio corpo.",
    "Sua saúde é um investimento a longo prazo, não um gasto de curto prazo.",
    "Apenas continue. O progresso pode ser lento, mas desistir não vai acelerar nada.",
    "Comer saudável é uma forma de autorrespeito.",
    "Evite ultraprocessados hoje. Escolha comida de verdade.",
    "Carboidratos complexos são seus aliados para ter energia sustentada.",
    "O movimento cura. Mexa-se por prazer e saúde.",
    "Prepare seus lanches com antecedência para evitar escolhas impulsivas.",
    "Respire fundo. O estresse eleva o cortisol, dificultando a perda de gordura.",
    "Olhe no espelho e reconheça a sua evolução até aqui.",
    "Hidratação correta melhora seu foco, sua pele e sua digestão.",
    "Você está muito perto de concluir seu primeiro ciclo. Sinta orgulho!",
    "Parabéns pelos 30 dias de foco e dedicação! Este é apenas o começo da sua jornada de bem-estar."
  ];

  for (let i = 1; i <= 30; i++) {
    plano30Dias.push({
      dia: i,
      foco: focos[i - 1] || 'Constância e Bem-estar',
      checklist: [
        `Beber pelo menos ${Math.round(metaAgua / 100) * 100} ml de água pura`,
        `Seguir o cardápio recomendado (${data.quantidadeRefeicoes} refeições)`,
        `Fazer o treino de hoje (${data.tempoExercicios} minutos)`,
        i % 7 === 1 ? 'Registrar peso semanal e tirar fotos de progresso' : 'Dormir de 7 a 8 horas de forma reparadora',
        'Evitar açúcares refinados e frituras'
      ],
      mensagemMotivacional: frasesMotivacionais[i - 1] || 'Siga firme no seu propósito!',
      caloriasAlvo: caloriasAlvo,
      cardapio: generateMealsForDay(i, data, caloriasAlvo)
    });
  }

  // 2. Cardápio Diário Padrão (Dia 1)
  const cardapioDiario: Meal[] = plano30Dias[0].cardapio || [];

  // 3. Gerando Receitas Personalizadas
  const receitas: Recipe[] = [
    {
      id: 'rec_1',
      nome: 'Crepioca Fit Super Proteica',
      tempoPreparo: '10 min',
      calorias: 280,
      ingredientes: [
        '1 ovo inteiro + 1 clara',
        '1 colher de sopa cheia de goma de tapioca',
        '2 colheres de sopa de frango desfiado temperado',
        '1 colher de sobremesa de creme de ricota light (ou queijo vegano)',
        'Orégano e sal a gosto'
      ],
      instrucoes: [
        'Bata bem os ovos e a tapioca em um recipiente com um garfo.',
        'Aqueça uma frigideira antiaderente em fogo baixo e despeje a mistura.',
        'Deixe dourar de um lado e vire.',
        'Adicione o frango desfiado e o creme de ricota de um lado da massa, salpique orégano e dobre ao meio.',
        'Deixe aquecer por mais 1 minuto até derreter e sirva quente.'
      ]
    },
    {
      id: 'rec_2',
      nome: 'Sorvete Natural de Banana e Cacau',
      tempoPreparo: '5 min (mais congelamento)',
      calorias: 180,
      ingredientes: [
        '2 bananas maduras cortadas em rodelas e congeladas',
        '1 colher de sopa rasa de cacau em pó 100%',
        '2 colheres de sopa de leite vegetal ou desnatado para ajudar a bater',
        'Canela em pó a gosto'
      ],
      instrucoes: [
        'Retire as rodelas de banana do congelador 5 minutos antes do preparo.',
        'Coloque as bananas no processador ou liquidificador potente.',
        'Adicione o cacau em pó e as colheres de leite aos poucos.',
        'Bata no modo pulsar até obter uma consistência ultra cremosa de sorvete de massa.',
        'Sirva imediatamente salpicado com canela em pó.'
      ]
    },
    {
      id: 'rec_3',
      nome: 'Frango Assado Crocante com Ervas',
      tempoPreparo: '35 min',
      calorias: 240,
      ingredientes: [
        '150g de peito de frango cortado em cubos médios',
        '1 colher de sopa de farelo de aveia',
        'Suco de 1/2 limão',
        '1 dente de alho amassado',
        'Azeite, páprica defumada, sal e alecrim fresco a gosto'
      ],
      instrucoes: [
        'Tempere os cubos de frango com limão, alho, páprica, sal e alecrim. Deixe marinar por 10 minutos.',
        'Passe os cubos levemente no farelo de aveia para criar uma crosta.',
        'Disponha os cubos em uma assadeira antiaderente untada com gotas de azeite.',
        'Leve ao forno preaquecido a 200°C ou Airfryer por 20 a 25 minutos até dourar e ficar crocante.',
        'Sirva acompanhado de rodelas de limão fresco.'
      ]
    },
    {
      id: 'rec_4',
      nome: 'Chips de Abobrinha Crocante',
      tempoPreparo: '20 min',
      calorias: 65,
      ingredientes: [
        '1 abobrinha italiana média',
        '1 colher de chá de azeite de oliva',
        'Sal marinho, pimenta-do-reino e orégano a gosto',
        '1 colher de sopa de queijo parmesão ralado fino (opcional)'
      ],
      instrucoes: [
        'Fatie a abobrinha em rodelas muito finas (utilize um fatiador/mandoline se tiver).',
        'Seque bem as rodelas com papel toalha para retirar o excesso de umidade.',
        'Misture as rodelas com o azeite, sal, pimenta e orégano em uma tigela.',
        'Disponha as fatias em uma única camada na assadeira ou cesto da Airfryer (sem sobrepor).',
        'Asse a 180°C por cerca de 15 minutos, virando na metade, até que as bordas fiquem douradas e sequinhas.',
        'Salpique o parmesão ralado nos últimos 2 minutos de cozimento e aproveite morno.'
      ]
    },
    {
      id: 'rec_5',
      nome: 'Quinoa Colorida de Forno',
      tempoPreparo: '25 min',
      calorias: 210,
      ingredientes: [
        '1 xícara de quinoa cozida',
        '1/2 xícara de cenoura ralada',
        '1/4 de xícara de ervilhas frescas',
        '1/2 tomate picado sem sementes',
        '100g de tofu grelhado ou peito de frango desfiado',
        'Cheiro-verde picado, azeite e sal a gosto'
      ],
      instrucoes: [
        'Em um refratário pequeno, misture a quinoa cozida, os vegetais picados e a fonte de proteína escolhida.',
        'Tempere com cheiro-verde, sal e regue com um fio pequeno de azeite de oliva.',
        'Leve ao forno médio a 180°C por 15 minutos para integrar os sabores.',
        'Sirva morno como uma refeição nutritiva de baixo índice glicêmico.'
      ]
    }
  ];

  // 4. Plano de Hidratação
  const planoHidratacao = {
    metaDiariaMl: metaAgua,
    recomendacoes: [
      `Beba um copo cheio de água (300ml) imediatamente após acordar para despertar o metabolismo.`,
      `Mantenha uma garrafa de 1 litro visível ao seu lado no trabalho/estudos e trace metas de esvaziá-la até o meio-dia e outra até as 17h.`,
      `Saborize sua água com rodelas de limão, folhas de hortelã ou lascas de gengibre para facilitar a ingestão.`,
      `Instale um alarme ou use o rastreador de hidratação do LeveAI para registrar a cada 2 horas.`
    ]
  };

  // 5. Plano de Exercícios Adaptado
  // Criamos treinos baseados no tempo disponível e equipamentos do usuário
  const treinos: Workout[] = [
    {
      id: 'treino_a',
      nome: 'Treino A - Cardio e Core (Aceleração)',
      duracao: `${data.tempoExercicios} min`,
      equipamentos: data.equipamentosDisponiveis,
      exercicios: [
        { nome: 'Polichinelos rápidos', series: 3, repeticoes: '45 segundos', descanso: '30s' },
        { nome: 'Agachamento livre peso corporal', series: 4, repeticoes: '15 repetições', descanso: '45s' },
        { nome: 'Flexão de braço (de joelhos se necessário)', series: 3, repeticoes: '10 a 12 repetições', descanso: '45s' },
        { nome: 'Prancha abdominal estática', series: 3, repeticoes: '45 segundos', descanso: '30s' },
        { nome: 'Escalador de montanha (Mountain Climbers)', series: 3, repeticoes: '30 segundos', descanso: '30s' }
      ]
    },
    {
      id: 'treino_b',
      nome: 'Treino B - Fortalecimento Global (Força & Tonificação)',
      duracao: `${data.tempoExercicios} min`,
      equipamentos: data.equipamentosDisponiveis,
      exercicios: [
        { nome: 'Passada/Afundo alternado', series: 3, repeticoes: '12 repetições por perna', descanso: '45s' },
        { nome: 'Tríceps no banco ou cadeira', series: 3, repeticoes: '12 repetições', descanso: '45s' },
        { nome: 'Agachamento Sumô com pausa (2s embaixo)', series: 3, repeticoes: '12 repetições', descanso: '45s' },
        { nome: 'Abdominal infra deitado', series: 4, repeticoes: '15 repetições', descanso: '30s' },
        { nome: 'Super Homem (fortalecimento lombar)', series: 3, repeticoes: '15 repetições', descanso: '30s' }
      ]
    }
  ];

  // 6. Lista de Compras Categorizada
  const isSemLactose = data.restricoesAlimentares.toLowerCase().includes('lactose') || data.restricoesAlimentares.toLowerCase().includes('leite');
  const listaCompras: ShoppingCategory[] = [
    {
      categoria: 'Proteínas Magras',
      itens: [
        data.restricoesAlimentares.toLowerCase().includes('vegan') ? 'Tofu orgânico firme' : 'Peito de frango fresco (1.5kg)',
        data.restricoesAlimentares.toLowerCase().includes('vegan') ? 'Grão-de-bico e lentilhas secas' : 'Ovos caipiras (2 a 3 dúzias)',
        data.restricoesAlimentares.toLowerCase().includes('vegan') ? 'Proteína isolada de ervilha' : 'Filés de peito de frango ou peixe branco magro',
        isSemLactose ? 'Leite vegetal de aveia ou amêndoas enriquecido com cálcio' : 'Iogurte natural desnatado ou queijo cottage light'
      ]
    },
    {
      categoria: 'Hortifrúti (Legumes & Verduras)',
      itens: [
        'Brócolis ninja fresco',
        'Abobrinha italiana',
        'Cenoura orgânica',
        'Tomate italiano maduro',
        'Folhas frescas (rúcula, alface crespa, espinafre)',
        'Limão siciliano ou tahiti'
      ]
    },
    {
      categoria: 'Frutas Frescas de Baixo IG',
      itens: [
        'Mamão papaia pequeno',
        'Morangos frescos (ou frutas vermelhas congeladas)',
        'Maçã gala ou verde',
        'Banana prata madura'
      ]
    },
    {
      categoria: 'Cereais Integrais & Sementes',
      itens: [
        'Aveia em flocos finos',
        'Arroz integral de grão longo ou quinoa real',
        'Sementes de chia e de linhaça dourada',
        'Pão 100% integral rico em fibras'
      ]
    },
    {
      categoria: 'Gorduras Saudáveis e Especiarias',
      itens: [
        'Azeite de oliva extra virgem de baixa acidez',
        'Castanhas do pará ou nozes',
        'Páprica defumada e cúrcuma em pó',
        'Canela em pau e em pó'
      ]
    }
  ];

  // 7. Guias Nutricionais Baseados em Evidências
  const guiasNutricionais = [
    'Densidade Calórica: Priorize alimentos de baixa densidade energética (como vegetais e frutas de água), pois eles oferecem grande volume estomacal com pouquíssimas calorias, auxiliando na saciedade imediata.',
    'Consumo de Proteínas: As proteínas aumentam a liberação do peptídeo YY e GLP-1 (hormônios de saciedade) e possuem alto efeito térmico, gastando até 30% das suas calorias apenas para serem digeridas.',
    'A Importância das Fibras: Consuma pelo menos 25g de fibras diariamente. Elas retardam o esvaziamento gástrico, evitam picos bruscos de insulina no sangue e nutrem a microbiota intestinal saudável.',
    'Fome Emocional vs. Fome Fisiológica: A fome real aparece gradualmente, aceita variados tipos de comida e cessa quando estamos cheios. A fome emocional é súbita, exige alimentos ultraespecíficos e hiperpalatáveis (doces/frituras) e gera culpa.',
    'Durma para Emagrecer: A restrição crônica de sono eleva a grelina (hormônio da fome) e reduz a leptina (hormônio da saciedade), além de aumentar a preferência do cérebro por alimentos densos em calorias.'
  ];

  // 8. Perguntas Frequentes Desmistificadas
  const perguntasFrequentes = [
    {
      pergunta: 'Preciso cortar carboidratos para emagrecer?',
      resposta: 'Não! O emagrecimento ocorre pelo déficit calórico (gastar mais do que consome). Carboidratos complexos (como aveia, batata-doce e arroz integral) fornecem energia essencial para os treinos e fibras que dão saciedade prolongada.'
    },
    {
      pergunta: 'Água com limão em jejum queima gordura?',
      resposta: 'Mito científico. A água com limão é excelente para hidratação e fornece vitamina C, mas não possui nenhuma propriedade ativa capaz de derreter células de gordura. O emagrecimento é resultado da consistência diária no balanço calórico geral.'
    },
    {
      pergunta: 'Se eu comer à noite, vou acumular mais gordura?',
      resposta: 'Não. O corpo não desliga o metabolismo ao pôr do sol ou às 18h. O que importa é o total de calorias ingeridas ao longo de 24h. No entanto, refeições pesadas tarde da noite podem prejudicar a qualidade do sono, o que indiretamente afeta o ganho de gordura.'
    },
    {
      pergunta: 'Suar muito emagrece?',
      resposta: 'O suor é um mecanismo de resfriamento corporal composto de água e eletrólitos, não de gordura. A perda de peso imediata na balança após suar muito é apenas desidratação líquida temporária, recuperada ao beber água.'
    }
  ];

  return {
    plano30Dias,
    cardapioDiario,
    receitas,
    planoHidratacao,
    planoExercicios: treinos,
    listaCompras,
    guiasNutricionais,
    perguntasFrequentes
  };
}

export function generateMockDailyVariation(questionnaire: any, activeDay: number) {
  const isVegetarian = questionnaire?.restricoesAlimentares?.toLowerCase().includes('vegan') || 
                       questionnaire?.restricoesAlimentares?.toLowerCase().includes('vegetar');
  const preferido = questionnaire?.alimentosPreferidos || 'temperos naturais';

  const receitas = [
    {
      id: `daily_rec_${activeDay}_1`,
      nome: isVegetarian ? `Salada de Quinoa Real com ${preferido}` : `Tiras de Frango Grelhado com Limão e ${preferido}`,
      tempoPreparo: '15 min',
      calorias: 320,
      ingredientes: isVegetarian 
        ? ['1 xícara de quinoa cozida', '1/2 pepino picado', 'Tomate cereja a gosto', '1 colher de sopa de azeite', 'Salsinha picada']
        : ['150g de peito de frango', 'Suco de 1 limão', '1 dente de alho picado', 'Azeite de oliva', 'Sal e páprica a gosto', `Ingrediente preferido: ${preferido}`],
      instrucoes: isVegetarian
        ? ['Cozinhe a quinoa.', 'Misture com os vegetais picados.', 'Tempere com azeite, limão e sal.', 'Sirva gelado.']
        : ['Tempere as tiras de frango com limão, alho, sal e páprica.', 'Aqueça uma frigideira antiaderente.', 'Grelhe o frango até dourar.', 'Sirva quente.']
    },
    {
      id: `daily_rec_${activeDay}_2`,
      nome: `Smoothie Funcional de Banana e Chia`,
      tempoPreparo: '5 min',
      calorias: 240,
      ingredientes: ['200ml de leite desnatado ou bebida vegetal', '1/2 banana congelada', '1 colher de sopa de aveia em flocos', '1 colher de sopa de sementes de chia'],
      instrucoes: ['Coloque todos os ingredientes no liquidificador.', 'Bata até obter uma textura homogênea.', 'Beba imediatamente para preservar os nutrientes.']
    }
  ];

  const planoExercicios = [
    {
      id: `daily_workout_${activeDay}`,
      nome: `Treino Especial Dia ${activeDay} - Diversidade e Mobilidade`,
      duracao: `${questionnaire?.tempoExercicios || 30} min`,
      equipamentos: questionnaire?.equipamentosDisponiveis || 'Apenas peso corporal',
      exercicios: [
        {
          nome: 'Polichinelos de Alta Intensidade',
          series: 3,
          repeticoes: '45 segundos',
          descanso: '30s'
        },
        {
          nome: 'Agachamento com Salto Dinâmico',
          series: 3,
          repeticoes: '12 a 15 repetições',
          descanso: '45s'
        },
        {
          nome: 'Flexões de Braço Alinhadas',
          series: 3,
          repeticoes: '10 a 12 repetições',
          descanso: '45s'
        },
        {
          nome: 'Prancha Abdominal Clássica',
          series: 3,
          repeticoes: '45 segundos',
          descanso: '30s'
        }
      ]
    }
  ];

  return { receitas, planoExercicios };
}

