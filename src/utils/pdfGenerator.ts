import { jsPDF } from 'jspdf';
import { LevePlan, QuestionnaireData, UserProfile } from '../types';

export function downloadHealthReportPDF(profile: UserProfile | null, todayWaterMl: number = 0) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = 20;

  const data = profile?.questionnaire;
  const userName = data?.nome || 'Atleta';
  const currentWeight = profile?.currentWeight || data?.peso || 70;
  const startWeight = data?.peso || currentWeight;
  const targetWeight = data?.metaPeso || 60;
  const weightDiff = (currentWeight - startWeight).toFixed(1);
  
  // Calculate IMC/BMI
  const heightM = (data?.altura || 170) / 100;
  const imc = (currentWeight / (heightM * heightM)).toFixed(1);
  let imcClassification = 'Normal';
  const imcVal = parseFloat(imc);
  if (imcVal < 18.5) imcClassification = 'Abaixo do peso';
  else if (imcVal >= 25 && imcVal < 30) imcClassification = 'Sobrepeso';
  else if (imcVal >= 30) imcClassification = 'Obesidade';

  // Helper to add page borders & footer
  const addPageBordersAndFooter = (pageNum: number) => {
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Emagrece IA - Relatório Oficial de Saúde & Evolução Corporativa`, margin, pageHeight - 13);
    doc.text(`Página ${pageNum}`, pageWidth - margin - 15, pageHeight - 13);
  };

  const drawSectionHeader = (title: string) => {
    if (y > pageHeight - 40) {
      doc.addPage();
      currentPage++;
      addPageBordersAndFooter(currentPage);
      y = 20;
    }

    doc.setFillColor(236, 253, 245); // emerald-50
    doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text(title.toUpperCase(), margin + 3, y + 6);
    y += 14;
  };

  let currentPage = 1;
  addPageBordersAndFooter(currentPage);

  // === COVER / HEADER ===
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(10, 10, pageWidth - 20, 36, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('EMAGRECE IA • RELATÓRIO DE SAÚDE', margin + 5, 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Documento Gerado em: ${new Date().toLocaleDateString('pt-BR')} - Diagnóstico & Metas Clínico-Nutricionais`, margin + 5, 35);

  y = 56;

  // === PERFIL E DIAGNÓSTICO ===
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(`Paciente/Atleta: ${userName}`, margin, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  doc.text(`• Idade: ${data?.idade || 30} anos`, margin, y);
  doc.text(`• Sexo: ${data?.sexo || 'Não informado'}`, margin, y + 5);
  doc.text(`• Altura: ${data?.altura || 170} cm`, margin, y + 10);
  doc.text(`• IMC Atual: ${imc} kg/m² (${imcClassification})`, margin, y + 15);

  doc.text(`• Peso Inicial: ${startWeight} kg`, margin + 85, y);
  doc.text(`• Peso Atual Registrado: ${currentWeight} kg`, margin + 85, y + 5);
  doc.text(`• Meta Final de Peso: ${targetWeight} kg`, margin + 85, y + 10);
  doc.text(`• Variação Total: ${parseFloat(weightDiff) <= 0 ? weightDiff + ' kg' : '+' + weightDiff + ' kg'}`, margin + 85, y + 15);

  y += 24;

  // METRIC HIGHLIGHT BOX
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(margin, y, pageWidth - (margin * 2), 18, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, pageWidth - (margin * 2), 18, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129);
  doc.text('RESUMO DE METAS METABÓLICAS DIÁRIAS:', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const waterTarget = profile?.plan?.planoHidratacao?.metaDiariaMl || 2500;
  const calTarget = profile?.plan?.plano30Dias?.[0]?.caloriasAlvo || 1600;

  doc.text(`• Calorias Alvo: ~${calTarget} kcal/dia`, margin + 4, y + 12);
  doc.text(`• Meta de Água: ${(waterTarget / 1000).toFixed(1)} Litros/dia (Consumo hoje: ${(todayWaterMl / 1000).toFixed(1)}L)`, margin + 70, y + 12);
  doc.text(`• Nível de Atividade: ${data?.nivelAtividade || 'Moderado'}`, margin + 140, y + 12);

  y += 26;

  // === 1. HISTÓRICO DE PESO ===
  drawSectionHeader('1. Histórico e Evolução Ponderal');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  const history = profile?.weightHistory || [];
  if (history.length === 0) {
    doc.text('Nenhum histórico adicional registrado além do peso inicial da anamnese.', margin + 4, y);
    y += 6;
  } else {
    // Print mini table of weight logs
    doc.setFont('helvetica', 'bold');
    doc.text('Data do Registro', margin + 4, y);
    doc.text('Peso Registrado', margin + 60, y);
    doc.text('Diferença do Início', margin + 110, y);
    y += 5;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin + 4, y - 2, pageWidth - margin - 4, y - 2);

    doc.setFont('helvetica', 'normal');
    history.slice(-8).forEach((h) => {
      if (y > pageHeight - 25) {
        doc.addPage();
        currentPage++;
        addPageBordersAndFooter(currentPage);
        y = 20;
      }
      const diffFromStart = (h.peso - startWeight).toFixed(1);
      doc.text(`${h.data}`, margin + 4, y);
      doc.text(`${h.peso} kg`, margin + 60, y);
      doc.text(`${parseFloat(diffFromStart) <= 0 ? diffFromStart : '+' + diffFromStart} kg`, margin + 110, y);
      y += 4.5;
    });
  }

  y += 8;

  // === 2. CRONOBIOLOGIA E HIGIENE DO SONO ===
  drawSectionHeader('2. Rotina Circadiana & Higiene do Sono');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  const sleepTime = localStorage.getItem('emagreceia_sleep_time') || '22:30';
  const wakeTime = localStorage.getItem('emagreceia_wake_time') || '06:30';
  const chronotype = localStorage.getItem('emagreceia_chronotype') || 'Intermediário ⛅';

  doc.text(`• Horário Programado de Sono: ${sleepTime} até ${wakeTime}`, margin + 4, y);
  y += 5;
  doc.text(`• Cronotipo Biológico Selecionado: ${chronotype}`, margin + 4, y);
  y += 5;
  doc.text(`• Recomendações Circadianas: Desligar luzes azuis 1h antes de dormir, manter quarto entre 19-21°C e tomar 10 minutos de sol pela manhã para otimizar melatonina e hormônio do crescimento (GH).`, margin + 4, y);
  y += 10;

  // === 3. ORIENTAÇÕES MÉDICO-NUTRICIONAIS ===
  drawSectionHeader('3. Recomendações do Coach Emagrece IA');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  const guidelines = [
    'Manter o aporte proteico distribuído em pelo menos 3 a 4 refeições ao longo do dia para preservar massa magra.',
    'Consumir vegetais e fibras solúveis antes do prato principal para promover a saciedade via hormônios GLP-1 naturais.',
    'Manter a consistência na ingestão hídrica, bebendo 250ml a cada hora enquanto acordado.',
    'Evitar refeições ultraprocessadas ricas em sódio próximo ao horário de dormir para evitar retenção hídrica na balança.'
  ];

  guidelines.forEach((g) => {
    if (y > pageHeight - 25) {
      doc.addPage();
      currentPage++;
      addPageBordersAndFooter(currentPage);
      y = 20;
    }
    const lines = doc.splitTextToSize(`• ${g}`, pageWidth - (margin * 2) - 4);
    lines.forEach((line: string) => {
      doc.text(line, margin + 4, y);
      y += 4.5;
    });
  });

  // Save the PDF
  doc.save(`Relatorio_Saude_EmagreceIA_${userName.replace(/\s+/g, '_')}.pdf`);
}

export function downloadPlanPDF(data: QuestionnaireData, plan: LevePlan) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = 20;

  // Helper to add standard page header and footer
  const addPageBordersAndFooter = (pageNum: number) => {
    // Elegant light blue border lines
    doc.setDrawColor(219, 234, 254); // blue-100
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setFillColor(248, 250, 252);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`LeveAI - Coach de Hábitos Saudáveis com Inteligência Artificial`, margin, pageHeight - 13);
    doc.text(`Página ${pageNum}`, pageWidth - margin - 15, pageHeight - 13);
  };

  // Helper to draw section header
  const drawSectionHeader = (title: string) => {
    // Small check for page break
    if (y > pageHeight - 40) {
      doc.addPage();
      currentPage++;
      addPageBordersAndFooter(currentPage);
      y = 20;
    }

    doc.setFillColor(239, 246, 255); // blue-50
    doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(29, 78, 216); // blue-700
    doc.text(title.toUpperCase(), margin + 3, y + 6);
    y += 14;
  };

  let currentPage = 1;
  addPageBordersAndFooter(currentPage);

  // === COVER / HEADER ===
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(10, 10, pageWidth - 20, 35, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('EMAGRECE IA', margin + 5, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Seu Coach Digital de Hábitos e Nutrição Baseada em Evidências', margin + 5, 36);

  y = 55;

  // === PERFIL DO USUÁRIO ===
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(`Plano Personalizado de: ${data.nome}`, margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600

  // 2 columns of user data
  doc.text(`• Idade: ${data.idade} anos`, margin, y);
  doc.text(`• Sexo: ${data.sexo}`, margin, y + 4.5);
  doc.text(`• Peso Atual: ${data.peso} kg`, margin, y + 9);
  doc.text(`• Altura: ${data.altura} cm`, margin, y + 13.5);

  doc.text(`• Meta de Peso: ${data.metaPeso} kg`, margin + 80, y);
  doc.text(`• Nível de Atividade: ${data.nivelAtividade}`, margin + 80, y + 4.5);
  doc.text(`• Tempo de Exercício: ${data.tempoExercicios} min/dia`, margin + 80, y + 9);
  doc.text(`• Equipamentos: ${data.equipamentosDisponiveis}`, margin + 80, y + 13.5);

  y += 18;

  // Meta de Calorias e Hidratação Destaques
  doc.setFillColor(240, 253, 250); // green-50
  doc.rect(margin, y, pageWidth - (margin * 2), 16, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(5, 150, 105); // green-600
  doc.text(`METAS DIÁRIAS PRINCIPAIS:`, margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  const caloriasRecomendadas = plan.plano30Dias[0]?.caloriasAlvo || 1500;
  doc.text(`Meta Calórica Média: ${caloriasRecomendadas} kcal/dia`, margin + 4, y + 12);
  doc.text(`Meta de Hidratação: ${plan.planoHidratacao.metaDiariaMl} ml de Água Pura/dia`, margin + 100, y + 12);

  y += 24;

  // === 1. CARDÁPIO DIÁRIO ===
  drawSectionHeader('1. Cardápio Alimentar Diário');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  plan.cardapioDiario.forEach((m) => {
    if (y > pageHeight - 30) {
      doc.addPage();
      currentPage++;
      addPageBordersAndFooter(currentPage);
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${m.nome} (${m.horario}) - ~${m.calorias} kcal`, margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    
    m.alimentos.forEach((a) => {
      const textLine = `  - ${a}`;
      doc.text(textLine, margin + 4, y);
      y += 4.5;
    });
    y += 3;
  });

  y += 6;

  // === 2. RECEITAS SELECIONADAS ===
  drawSectionHeader('2. Receitas Saudáveis Sugeridas');
  plan.receitas.slice(0, 3).forEach((r) => {
    if (y > pageHeight - 40) {
      doc.addPage();
      currentPage++;
      addPageBordersAndFooter(currentPage);
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${r.nome} - Prep: ${r.tempoPreparo} | ~${r.calorias} kcal`, margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Ingredientes: ${r.ingredientes.slice(0, 4).join(', ')}...`, margin + 4, y);
    y += 5;

    const textInstrucao = `Preparo: ${r.instrucoes[0]}...`;
    doc.text(textInstrucao, margin + 4, y);
    y += 8;
  });

  y += 4;

  // === 3. PLANO DE EXERCÍCIOS ===
  drawSectionHeader('3. Plano de Exercícios Físicos');
  plan.planoExercicios.forEach((w) => {
    if (y > pageHeight - 40) {
      doc.addPage();
      currentPage++;
      addPageBordersAndFooter(currentPage);
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${w.nome} (Duração: ${w.duracao})`, margin, y);
    y += 5;

    w.exercicios.forEach((ex) => {
      if (y > pageHeight - 25) {
        doc.addPage();
        currentPage++;
        addPageBordersAndFooter(currentPage);
        y = 20;
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`• ${ex.nome} - ${ex.series} séries x ${ex.repeticoes} (Descanso: ${ex.descanso})`, margin + 4, y);
      y += 4.5;
    });
    y += 4;
  });

  y += 6;

  // === 4. GUIAS NUTRICIONAIS & CIÊNCIA ===
  drawSectionHeader('4. Pilares do Emagrecimento Baseados em Evidências');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  plan.guiasNutricionais.slice(0, 4).forEach((g) => {
    if (y > pageHeight - 25) {
      doc.addPage();
      currentPage++;
      addPageBordersAndFooter(currentPage);
      y = 20;
    }
    
    const lines = doc.splitTextToSize(`• ${g}`, pageWidth - (margin * 2) - 4);
    lines.forEach((line: string) => {
      doc.text(line, margin, y);
      y += 4.5;
    });
    y += 2;
  });

  // Save the PDF
  doc.save(`Plano_LeveAI_${data.nome.replace(/\s+/g, '_')}.pdf`);
}

