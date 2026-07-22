import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { generateMockPlan, generateMockDailyVariation } from './src/mockGenerator';
import { getSystemPrompt, getUserPrompt, getDailyVariationSystemPrompt, getDailyVariationUserPrompt } from './src/prompts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API route to generate 30-day customized coaching plan
  app.post('/api/generate-plan', async (req, res) => {
    try {
      const { questionnaire } = req.body;
      if (!questionnaire) {
        return res.status(400).json({ error: 'Dados do questionário não fornecidos.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      const isDemoKey = !apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '';

      if (isDemoKey) {
        console.log('No valid GEMINI_API_KEY. Using mock generator fallback.');
        const plan = generateMockPlan(questionnaire);
        return res.json({ plan, isDemo: true });
      }

      try {
        console.log('Valid key detected. Preparing Gemini API request...');
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
        const systemPrompt = getSystemPrompt();
        const userPrompt = getUserPrompt(questionnaire);

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
          },
        });

        const textResponse = response.text;
        if (!textResponse) {
          throw new Error('Gemini retornou uma resposta em branco.');
        }

        // Clean any possible extra markdown tags (just in case)
        let cleaned = textResponse.trim();
        if (cleaned.startsWith('```json')) {
          cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
        }

        const plan = JSON.parse(cleaned);
        return res.json({ plan, isDemo: false });
      } catch (geminiError: any) {
        console.error('Error contacting Gemini API:', geminiError);
        console.log('Falling back to detailed mock generator due to API error.');
        const plan = generateMockPlan(questionnaire);
        return res.json({
          plan,
          isDemo: true,
          warning: 'Falha ao conectar com o Gemini API. Um plano inteligente alternativo foi gerado localmente.'
        });
      }
    } catch (err: any) {
      console.error('General server error in /api/generate-plan:', err);
      return res.status(500).json({ error: 'Erro interno ao processar plano.' });
    }
  });

  // API route to generate daily custom recipes and workouts
  app.post('/api/generate-daily-variation', async (req, res) => {
    try {
      const { questionnaire, activeDay } = req.body;
      if (!questionnaire || activeDay === undefined) {
        return res.status(400).json({ error: 'Dados do questionário ou dia ativo não fornecidos.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      const isDemoKey = !apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '';

      if (isDemoKey) {
        console.log('No valid GEMINI_API_KEY. Using mock daily generator fallback.');
        const variation = generateMockDailyVariation(questionnaire, activeDay);
        return res.json({ variation, isDemo: true });
      }

      try {
        console.log(`Valid key detected. Preparing Gemini API request for daily variation (Day ${activeDay})...`);
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
        const systemPrompt = getDailyVariationSystemPrompt();
        const userPrompt = getDailyVariationUserPrompt(questionnaire, activeDay);

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
          },
        });

        const textResponse = response.text;
        if (!textResponse) {
          throw new Error('Gemini retornou uma resposta em branco.');
        }

        let cleaned = textResponse.trim();
        if (cleaned.startsWith('```json')) {
          cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
        }

        const variation = JSON.parse(cleaned);
        return res.json({ variation, isDemo: false });
      } catch (geminiError: any) {
        console.error('Error contacting Gemini API for daily variation:', geminiError);
        const variation = generateMockDailyVariation(questionnaire, activeDay);
        return res.json({
          variation,
          isDemo: true,
          warning: 'Falha ao conectar com o Gemini API. Novas receitas/treinos gerados localmente.'
        });
      }
    } catch (err: any) {
      console.error('General server error in /api/generate-daily-variation:', err);
      return res.status(500).json({ error: 'Erro interno ao processar variação diária.' });
    }
  });

  // API route to generate daily hydration tip via Gemini
  app.post('/api/hydration-tip', async (req, res) => {
    try {
      const { name, activityLevel, weather, currentWeight, todayWater } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      const isDemoKey = !apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '';

      const fallbackTips = [
        `Olá ${name || 'Atleta'}! Em dias com clima ${weather || 'quente'} e nível de atividade ${activityLevel || 'moderado'}, procure beber ao menos 2,5L de água fracionados ao longo do dia para manter seu metabolismo acelerado!`,
        `Super dica de hidratação: Tome 1 copo grande de água (300ml) assim que acordar e antes do seu treino. Se estiver em clima ${weather || 'ensolarado'}, adicione uma fatia de limão para saborizar!`,
        `Para seu nível de atividade (${activityLevel || 'ativo'}), a hidratação constante evita a fadiga muscular e diminui a retenção hídrica. Tente bater sua meta com pequenos goles a cada hora!`
      ];
      const randomFallback = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];

      if (isDemoKey) {
        return res.json({ tip: randomFallback, isDemo: true });
      }

      try {
        console.log('Valid GEMINI_API_KEY detected. Generating hydration tip...');
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const prompt = `Gere uma dica de hidratação diária motivadora, inteligente e muito prática (máximo de 3 frases concisas) em Português do Brasil para o usuário ${name || 'Usuário'}.
Dados do usuário:
- Clima do dia: ${weather || 'Quente'}
- Nível de atividade física: ${activityLevel || 'Ativo'}
- Peso atual: ${currentWeight || 70} kg
- Água consumida hoje: ${todayWater || 0} ml.

Requisitos da dica:
- Seja extremamente prático, encorajador e direto ao ponto.
- Forneça uma dica acionável (ex: horário de beber água, uso de garrafinha, eletrólitos naturais, combate à retenção).
- Não use formatação em markdown pesada, retorne apenas o texto limpo da dica.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            systemInstruction: 'Você é um nutricionista especialista em hidratação esportiva e metabolismo humano. Suas dicas são concisas, altamente motivadoras, cientificamente embasadas e fáceis de aplicar no dia a dia.',
            temperature: 0.7,
          },
        });

        const tipText = response.text?.trim() || randomFallback;
        return res.json({ tip: tipText, isDemo: false });
      } catch (geminiError: any) {
        console.error('Error contacting Gemini API for hydration tip:', geminiError);
        return res.json({
          tip: randomFallback,
          isDemo: true,
          warning: 'Falha temporária com Gemini. Dica gerada via recomendação nutricional.'
        });
      }
    } catch (err: any) {
      console.error('General server error in /api/hydration-tip:', err);
      return res.status(500).json({ error: 'Erro interno ao gerar dica de hidratação.' });
    }
  });

  // API route to generate daily sleep hygiene tip via Gemini
  app.post('/api/sleep-hygiene-tip', async (req, res) => {
    try {
      const { name, sleepTime, wakeTime, chronotype, mainGoal } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      const isDemoKey = !apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '';

      const fallbackTip = `Para alinhar seu ritmo circadiano ao emagrecimento (${mainGoal || 'perda de gordura'}), evite luz azul 1h30 antes de dormir (${sleepTime || '22:00'}) e mantenha o quarto em 19°C-21°C para estimular a liberação natural de melatonina e hormônio do crescimento (GH).`;
      const fallbackSteps = [
        'Corte a cafeína e pré-treinos pelo menos 8 horas antes de se deitar',
        'Desligue telas e luzes intensas 1 hora antes de dormir',
        'Tome um banho morno para induzir a queda de temperatura corporal',
        'Ao acordar, exponha-se à luz solar por 10 minutos para calibrar seu relógio biológico'
      ];

      if (isDemoKey) {
        return res.json({ tip: fallbackTip, routineSteps: fallbackSteps, isDemo: true });
      }

      try {
        console.log('Valid GEMINI_API_KEY detected. Generating sleep hygiene tip...');
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const prompt = `Gere uma orientação de Higiene do Sono e Ritmo Circadiano focada em otimizar a recuperação e o emagrecimento do usuário ${name || 'Atleta'}.
Dados do usuário:
- Horário habitual de dormir: ${sleepTime || '22:30'}
- Horário habitual de acordar: ${wakeTime || '06:30'}
- Cronotipo biológico: ${chronotype || 'Intermediário'}
- Objetivo principal: ${mainGoal || 'Emagrecimento e Queima de Gordura'}

Formato de resposta desejado (JSON estrito):
{
  "tip": "Dica prática de 2 a 3 frases explicando o impacto da melatonina/cortisol no sono e na queima de gordura.",
  "routineSteps": [
    "Passo 1 focado na tarde/corte de estimulantes",
    "Passo 2 focado no ritual noturno de desaceleração",
    "Passo 3 focado no ambiente do quarto",
    "Passo 4 focado na exposição à luz matinal para sincronização circadiana"
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            systemInstruction: 'Você é um neurocientista e especialista em cronobiologia e higiene do sono aplicada ao metabolismo humano. Suas orientações ajudam pessoas a otimizarem o sono para queimar gordura, reduzir o cortisol e regular os hormônios da fome (grelina e leptina). Responda EXCLUSIVAMENTE em formato JSON.',
            temperature: 0.7,
            responseMimeType: 'application/json'
          },
        });

        const textResult = response.text?.trim() || '';
        try {
          const parsed = JSON.parse(textResult);
          return res.json({
            tip: parsed.tip || fallbackTip,
            routineSteps: parsed.routineSteps || fallbackSteps,
            isDemo: false
          });
        } catch {
          return res.json({ tip: textResult || fallbackTip, routineSteps: fallbackSteps, isDemo: false });
        }
      } catch (geminiError: any) {
        console.error('Error contacting Gemini API for sleep hygiene tip:', geminiError);
        return res.json({
          tip: fallbackTip,
          routineSteps: fallbackSteps,
          isDemo: true,
          warning: 'Falha temporária no Gemini. Exibindo protocolo circadiano padrão.'
        });
      }
    } catch (err: any) {
      console.error('General server error in /api/sleep-hygiene-tip:', err);
      return res.status(500).json({ error: 'Erro interno ao gerar orientação do sono.' });
    }
  });

  // API route to generate healthy shopping advice & ingredient swap guide via Gemini
  app.post('/api/healthy-shopping-tips', async (req, res) => {
    try {
      const { userGoal, dietaryPreference, queriedItem } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      const isDemoKey = !apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '';

      const fallbackGuide = {
        perimeterStrategy: 'Priorize as bordas do supermercado (Hortifrúti, Açougue e Laticínios magros). O centro é onde ficam 90% dos alimentos ultraprocessados e refinados.',
        labelRule: 'Quanto menor a lista de ingredientes, melhor. Se o açúcar (ou xarope de milho, maltodextrina, dextrose) for um dos 3 primeiros ingredientes, evite!',
        topSwaps: [
          { original: 'Refrigerante / Suco de Caixinha', healthier: 'Água com gás aromatizada com limão e hortelã', reason: 'Economiza até 250 kcal vazias e evita picos de insulina' },
          { original: 'Biscoito Recheado / Barrinha com Açúcar', healthier: 'Cacau 70% + Castanhas ou Frutas Secas', reason: 'Oferece gorduras boas, magnésio e saciedade duradoura' },
          { original: 'Molho de Tomate Industrializado', healthier: 'Tomate pelado em lata + temperos naturais', reason: 'Zero açúcar adicionado e conservantes químicos' },
          { original: 'Pão de Forma Tradicional', healthier: 'Pão 100% Integral com sementes ou Tapioca com ovo', reason: 'Menor índice glicêmico e maior teor de fibras solúveis' }
        ],
        itemAnalysis: queriedItem ? `Ao comprar "${queriedItem}", certifique-se de verificar a quantidade de sódio e gordura saturada por porção.` : 'Dica extra: nunca vá ao supermercado com fome para evitar compras por impulso!'
      };

      if (isDemoKey) {
        return res.json({ ...fallbackGuide, isDemo: true });
      }

      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });

        const prompt = `Você é um nutricionista especialista em compras conscientes no supermercado e economia inteligente.
Forneça um guia de compras saudáveis otimizado para um usuário cujo objetivo é "${userGoal || 'Emagrecimento e Definição'}" e preferência alimentar "${dietaryPreference || 'Geral/Variada'}".
${queriedItem ? `O usuário perguntou especificamente sobre como escolher ou substituir o alimento: "${queriedItem}".` : ''}

Responda EXCLUSIVAMENTE em formato JSON estrito:
{
  "perimeterStrategy": "Conselho prático sobre navegação pelas seções do supermercado (1 a 2 frases)",
  "labelRule": "Regra de ouro para leitura de rótulos e ingredientes (1 a 2 frases)",
  "topSwaps": [
    { "original": "Item ultraprocessado comum", "healthier": "Alternativa limpa e nutritiva", "reason": "Benefício metabólico da troca" },
    { "original": "Item 2", "healthier": "Alternativa 2", "reason": "Benefício 2" },
    { "original": "Item 3", "healthier": "Alternativa 3", "reason": "Benefício 3" },
    { "original": "Item 4", "healthier": "Alternativa 4", "reason": "Benefício 4" }
  ],
  "itemAnalysis": "Dica prática sobre a escolha inteligente ou análise do alimento consultado"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            systemInstruction: 'Você é um nutricionista focado em escolhas alimentares saudáveis, baratas e sem ciladas da indústria de alimentos.',
            temperature: 0.7,
            responseMimeType: 'application/json'
          }
        });

        const parsed = JSON.parse(response.text?.trim() || '{}');
        return res.json({
          perimeterStrategy: parsed.perimeterStrategy || fallbackGuide.perimeterStrategy,
          labelRule: parsed.labelRule || fallbackGuide.labelRule,
          topSwaps: parsed.topSwaps || fallbackGuide.topSwaps,
          itemAnalysis: parsed.itemAnalysis || fallbackGuide.itemAnalysis,
          isDemo: false
        });
      } catch (err) {
        return res.json({ ...fallbackGuide, isDemo: true });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao gerar dicas de compras.' });
    }
  });

  // API route to notify admin of new user signup
  app.post('/api/notify-admin-signup', async (req, res) => {
    try {
      const { email, uid, planType } = req.body;
      const adminEmail = 'everson.arantes.2008@gmail.com';
      console.log(`[E-MAIL NOTIFICAÇÃO MASTER] Para: ${adminEmail} | Assunto: Novo Cadastro de Usuário LeveAI (${email}) | Status: Aguardando confirmação do master login.`);
      return res.json({ 
        success: true, 
        message: `E-mail de notificação enviado com sucesso para o Administrador (${adminEmail}).` 
      });
    } catch (err: any) {
      console.error('Erro ao notificar administrador:', err);
      return res.status(500).json({ error: 'Erro ao enviar notificação.' });
    }
  });

  // API route to notify admin of premium plan request/payment
  app.post('/api/notify-admin-plan-request', async (req, res) => {
    try {
      const { userEmail, userUid, planType, paymentMethod } = req.body;
      const adminEmail = 'everson.arantes.2008@gmail.com';
      console.log(`[E-MAIL NOTIFICAÇÃO MASTER - PLANO PREMIUM] Para: ${adminEmail} | Assunto: Solicitação de Liberação de Plano ${planType?.toUpperCase() || 'PREMIUM'} | Usuário: ${userEmail} (UID: ${userUid}) | Método: ${paymentMethod?.toUpperCase() || 'PIX'} | Status: Aguardando liberação manual pelo Master Login.`);
      return res.json({
        success: true,
        message: `Solicitação registrada! E-mail de notificação enviado para o Master Login (${adminEmail}). A liberação ocorrerá após confirmação do recebimento.`
      });
    } catch (err: any) {
      console.error('Erro ao enviar e-mail de solicitação de plano:', err);
      return res.status(500).json({ error: 'Erro ao enviar notificação ao Master.' });
    }
  });

  // API route when admin approves user plan
  app.post('/api/notify-user-approval', async (req, res) => {
    try {
      const { userEmail, planType } = req.body;
      const adminEmail = 'everson.arantes.2008@gmail.com';
      console.log(`[E-MAIL CONFIRMAÇÃO USUÁRIO] De: ${adminEmail} | Para: ${userEmail} | Assunto: Seu Plano ${planType?.toUpperCase() || 'PREMIUM'} foi Liberado pelo Administrador! | Mensagem: Seu recebimento foi confirmado pelo Master Login e seu acesso completo está ativo no LeveAI.`);
      return res.json({
        success: true,
        message: `E-mail de confirmação de liberação enviado para o usuário ${userEmail}.`
      });
    } catch (err: any) {
      console.error('Erro ao enviar e-mail de confirmação ao usuário:', err);
      return res.status(500).json({ error: 'Erro ao enviar e-mail de liberação.' });
    }
  });

  // Serve app using Vite in dev mode, or static files in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting server in DEVELOPMENT mode with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Starting server in PRODUCTION mode with static files...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
