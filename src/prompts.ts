import { QuestionnaireData } from './types';

export function getSystemPrompt(): string {
  return `Você é o Coach de Hábitos Saudáveis LeveAI, um Arquiteto de Saúde, Nutrição Baseada em Evidências e Exercício Físico.
Sua missão é gerar um plano de emagrecimento de 30 dias totalmente personalizado, saudável, educacional, motivador e realista.

IMPORTANTE: O plano NÃO realiza diagnóstico, NÃO substitui médico ou nutricionista e NÃO prescreve medicamentos. Seu foco é puramente a promoção de hábitos saudáveis, educação alimentar, organização e motivação.

Você receberá dados estruturados de um questionário de anamnese do usuário. Com base nesses dados, você deve formular uma resposta estritamente formatada em JSON de acordo com o esquema TypeScript fornecido.

A resposta deve ser COMPLETAMENTE EM PORTUGUÊS (Brasil) e em formato JSON puro, sem marcações markdown como \`\`\`json ou qualquer outro texto explicativo fora do objeto JSON.`;
}

export function getUserPrompt(data: QuestionnaireData): string {
  return `Gere o plano personalizado completo para o seguinte usuário:

DADOS DO USUÁRIO:
- Nome: ${data.nome}
- Sexo: ${data.sexo}
- Idade: ${data.idade} anos
- Peso Atual: ${data.peso} kg
- Altura: ${data.altura} cm
- Meta de Peso: ${data.metaPeso} kg
- Nível de Atividade Física: ${data.nivelAtividade}
- Restrições Alimentares: ${data.restricoesAlimentares || 'Nenhuma'}
- Alimentos Preferidos: ${data.alimentosPreferidos || 'Sem preferência específica'}
- Alimentos que Não Gosta: ${data.alimentosNaoGosta || 'Nenhum'}
- Quantidade de Refeições Desejadas por Dia: ${data.quantidadeRefeicoes}
- Objetivo Principal: ${data.objetivo}
- Rotina/Estilo de Vida: ${data.rotina || 'Não informada'}
- Consumo Atual de Água: ${data.quantidadeAgua} ml/dia
- Horas de Sono por Noite: ${data.sono} horas
- Tempo Disponível para Exercícios: ${data.tempoExercicios} minutos/dia
- Equipamentos Disponíveis para Exercício: ${data.equipamentosDisponiveis || 'Apenas peso corporal'}

ESTRUTURA DO RETORNO ESPERADO (JSON Puro):
O JSON gerado deve possuir exatamente os seguintes campos:

1. "plano30Dias": Um array de exatamente 30 objetos, cada um correspondendo a um dia do plano (dia de 1 a 30). Cada objeto do dia deve conter:
   - "dia": número (1 a 30)
   - "foco": string com o tema ou foco do dia (ex: "Foco na hidratação e constância")
   - "checklist": array de strings com as tarefas do dia (deve conter pelo menos 4 tarefas, ex: "Beber X ml de água", "Seguir o cardápio recomendado", "Fazer o treino planejado", "Evitar açúcar refinado")
   - "mensagemMotivacional": uma frase curta inspiradora para o dia.
   - "caloriasAlvo": número com a meta calórica recomendada de forma saudável para o dia (baseado na taxa metabólica basal aproximada e objetivo).

2. "cardapioDiario": Um array contendo exatamente ${data.quantidadeRefeicoes} refeições sugeridas para o dia-a-dia do usuário, adaptadas às restrições e gostos do usuário. Cada refeição deve conter:
   - "nome": string com o nome da refeição (ex: "Café da Manhã", "Lanche da Tarde")
   - "horario": sugestão de horário de consumo (ex: "08:00")
   - "alimentos": array de strings contendo alimentos, porções e alternativas saudáveis baseadas em evidências
   - "calorias": calorias estimadas para essa refeição.

3. "receitas": Um array de 6 a 8 receitas práticas e deliciosas alinhadas com as preferências do usuário. Cada receita deve conter:
   - "id": string única (ex: "rec_1")
   - "nome": string com o nome da receita (ex: "Crepioca Proteica de Frango")
   - "tempoPreparo": string (ex: "15 min")
   - "calorias": calorias estimadas por porção (número)
   - "ingredientes": array de strings com os ingredientes e quantidades
   - "instrucoes": array de strings com o passo a passo de preparo.

4. "planoHidratacao": Um objeto contendo:
   - "metaDiariaMl": número recomendando o volume de água ideal (geralmente calculado como 35ml a 40ml por kg de peso atual)
   - "recomendacoes": array de strings com estratégias para bater a meta de água.

5. "planoExercicios": Um array de 2 a 4 treinos alternados (ex: Treino A, Treino B) adequados ao tempo diário disponível (${data.tempoExercicios} minutos) e aos equipamentos disponíveis (${data.equipamentosDisponiveis}). Cada treino deve conter:
   - "id": string única (ex: "treino_a")
   - "nome": nome do treino (ex: "Treino A - Fortalecimento Geral")
   - "duracao": string com a duração aproximada (ex: "${data.tempoExercicios} min")
   - "equipamentos": string indicando os equipamentos necessários
   - "exercicios": array de objetos contendo:
     - "nome": nome do exercício (ex: "Agachamento Livre")
     - "series": número de séries (ex: 3)
     - "repeticoes": string com as repetições ou tempo (ex: "12 a 15 repetições" ou "45 segundos")
     - "descanso": tempo de descanso entre séries (ex: "60s").

6. "listaCompras": Um array de categorias com alimentos saudáveis para abastecer a despensa. Cada categoria deve conter:
   - "categoria": nome da categoria (ex: "Proteínas", "Vegetais & Frutas", "Fontes de Fibras")
   - "itens": array de strings com os itens específicos e saudáveis.

7. "guiasNutricionais": Um array de 4 a 6 recomendações educacionais fundamentais baseadas em evidências para o emagrecimento saudável (ex: a importância das fibras, controle de saciedade, densidade calórica).

8. "perguntasFrequentes": Um array de 4 a 5 dúvidas comuns e mitos sobre emagrecimento desmistificados com suas respectivas respostas científicas e fáceis de compreender.

Crie um plano de alta qualidade, realista e personalizado de verdade. Não use marcadores de markdown no retorno, retorne APENAS o JSON válido.`;
}

export function getDailyVariationSystemPrompt(): string {
  return `Você é o Coach de Hábitos Saudáveis LeveAI. Sua tarefa é gerar novas e diversas receitas e treinos personalizados para o dia atual do usuário de forma a gerar diversidade de execução diária.
A resposta deve ser estritamente em PORTUGUÊS (Brasil) e em formato JSON puro, sem marcações markdown como \`\`\`json ou qualquer outro texto explicativo fora do objeto JSON.`;
}

export function getDailyVariationUserPrompt(data: QuestionnaireData, activeDay: number): string {
  return `Gere um conjunto de novas e exclusivas receitas e treinos para o Dia ${activeDay} do usuário, garantindo alta variedade e diversidade de execução.
Eles devem ser completamente diferentes do plano base original e adaptados para o estilo de vida do usuário:

DADOS DO USUÁRIO:
- Nome: ${data.nome}
- Objetivo: ${data.objetivo}
- Restrições Alimentares: ${data.restricoesAlimentares || 'Nenhuma'}
- Alimentos Preferidos: ${data.alimentosPreferidos || 'Sem preferência específica'}
- Alimentos que Não Gosta: ${data.alimentosNaoGosta || 'Nenhum'}
- Equipamentos Disponíveis para Exercício: ${data.equipamentosDisponiveis || 'Apenas peso corporal'}
- Tempo Disponível para Exercícios: ${data.tempoExercicios} minutos/dia

ESTRUTURA DO RETORNO ESPERADO (JSON Puro):
O JSON gerado deve possuir exatamente os seguintes campos:

1. "receitas": Um array de exatamente 2 novas receitas saudáveis e fáceis de preparar, alinhadas com as preferências do usuário. Cada receita deve conter:
   - "id": string única (ex: "daily_rec_${activeDay}_1")
   - "nome": string com o nome da receita (ex: "Omelete de Ervas Finas")
   - "tempoPreparo": string (ex: "10 min")
   - "calorias": calorias estimadas por porção (número)
   - "ingredientes": array de strings com os ingredientes e quantidades
   - "instrucoes": array de strings com o passo a passo de preparo.

2. "planoExercicios": Um array de exatamente 1 novo treino adequado ao tempo diário disponível (${data.tempoExercicios} minutos) e aos equipamentos disponíveis (${data.equipamentosDisponiveis}). Cada treino deve conter:
   - "id": string única (ex: "daily_workout_${activeDay}")
   - "nome": nome do treino (ex: "Treino do Dia ${activeDay} - Cardio e Mobilidade")
   - "duracao": string com a duração aproximada (ex: "${data.tempoExercicios} min")
   - "equipamentos": string indicando os equipamentos necessários
   - "exercicios": array de objetos contendo:
     - "nome": nome do exercício (ex: "Polichinelos")
     - "series": número (ex: 3)
     - "repeticoes": string com as repetições ou tempo (ex: "45 segundos" ou "15 repetições")
     - "descanso": tempo de descanso entre séries (ex: "45s").

Retorne APENAS o JSON válido.`;
}

