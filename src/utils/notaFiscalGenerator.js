import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Gera uma Nota Fiscal Eletrônica (NF-e) genérica em PDF
 * @param {Object} sale - Dados da venda
 * @returns {void}
 */
export const generateNotaFiscalPDF = (sale) => {
  try {
    console.log('Gerando PDF para venda:', sale);

    // Validações
    if (!sale) {
      throw new Error('Dados da venda não fornecidos');
    }

    if (!sale.itens || !Array.isArray(sale.itens) || sale.itens.length === 0) {
      throw new Error('Venda não possui itens');
    }

    const doc = new jsPDF();
    
    // Configurações
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let currentY = margin;

  // Função auxiliar para adicionar linha
  const addLine = (y) => {
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
  };

  // Função auxiliar para texto centralizado
  const addCenteredText = (text, y, fontSize = 10) => {
    doc.setFontSize(fontSize);
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  // Função auxiliar para adicionar campo
  const addField = (label, value, y) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(String(value), margin, y + 4);
    return y + 10;
  };

  // ========== CABEÇALHO ==========
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 15, 'F');
  
  currentY += 5;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  addCenteredText('NOTA FISCAL ELETRÔNICA (NF-e)', currentY);
  
  currentY += 5;
  doc.setFontSize(10);
  addCenteredText('DANFE - Documento Auxiliar da Nota Fiscal Eletrônica', currentY);
  
  currentY += 10;
  addLine(currentY);
  currentY += 5;

  // ========== DADOS DA EMPRESA (EMISSOR) ==========
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('EMITENTE', margin, currentY);
  currentY += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('INFOSTOCK COMÉRCIO DE ELETRÔNICOS LTDA', margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('CNPJ: 12.345.678/0001-99', margin, currentY);
  currentY += 4;
  doc.text('Inscrição Estadual: 123.456.789.000', margin, currentY);
  currentY += 4;
  doc.text('Endereço: Av. Paulista, 1000 - Bela Vista - São Paulo/SP - CEP: 01310-100', margin, currentY);
  currentY += 4;
  doc.text('Telefone: (11) 3456-7890 | E-mail: contato@infostock.com.br', margin, currentY);
  currentY += 8;

  addLine(currentY);
  currentY += 5;

  // ========== DADOS DA NOTA FISCAL ==========
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DA NF-e', margin, currentY);
  currentY += 8;

  // Grid de 2 colunas
  const col1X = margin;
  const col2X = pageWidth / 2 + 5;
  let tempY = currentY;

  // Coluna 1
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('NÚMERO:', col1X, tempY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(sale.nota_fiscal?.numero || 'N/A', col1X, tempY + 4);
  tempY += 10;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('SÉRIE:', col1X, tempY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(sale.nota_fiscal?.serie || '001', col1X, tempY + 4);
  tempY += 10;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DATA DE EMISSÃO:', col1X, tempY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const dataEmissao = new Date(sale.data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(dataEmissao, col1X, tempY + 4);

  // Coluna 2
  tempY = currentY;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('PROTOCOLO:', col2X, tempY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Autorizado', col2X, tempY + 4);
  tempY += 10;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('TIPO:', col2X, tempY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('1 - Saída', col2X, tempY + 4);
  tempY += 10;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('STATUS:', col2X, tempY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(sale.status, col2X, tempY + 4);

  currentY = tempY + 10;

  // Chave de Acesso
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CHAVE DE ACESSO:', margin, currentY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const chaveAcesso = sale.nota_fiscal?.chave_acesso || 'N/A';
  doc.text(chaveAcesso, margin, currentY + 4);
  currentY += 12;

  addLine(currentY);
  currentY += 5;

  // ========== DESTINATÁRIO (CLIENTE) ==========
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DESTINATÁRIO', margin, currentY);
  currentY += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(sale.cliente || 'Cliente não informado', margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Documento: ***.***.***-** (Dados protegidos)', margin, currentY);
  currentY += 4;
  doc.text('Endereço: Protegido pela LGPD', margin, currentY);
  currentY += 8;

  addLine(currentY);
  currentY += 5;

  // ========== RESUMO DA VENDA ==========
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 25, 'F');
  
  currentY += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO DA VENDA', margin + 5, currentY);
  currentY += 6;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  // Linha 1: Cliente e Data
  const resumoCol1 = margin + 5;
  const resumoCol2 = pageWidth / 2 + 5;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Cliente:', resumoCol1, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(sale.cliente || 'Não informado', resumoCol1 + 18, currentY);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Data:', resumoCol2, currentY);
  doc.setFont('helvetica', 'normal');
  const dataVenda = new Date(sale.data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(dataVenda, resumoCol2 + 12, currentY);
  currentY += 5;
  
  // Linha 2: Vendedor
  doc.setFont('helvetica', 'bold');
  doc.text('Vendedor:', resumoCol1, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(sale.usuario || 'N/A', resumoCol1 + 21, currentY);
  
  currentY += 10;
  addLine(currentY);
  currentY += 5;

  // ========== PRODUTOS ==========
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PRODUTOS / SERVIÇOS', margin, currentY);
  currentY += 8;

  // Tabela de produtos
  const tableData = sale.itens.map((item, index) => [
    String(index + 1),
    item.produto_sku || 'N/A',
    item.produto || 'Produto não especificado',
    String(item.quantidade || 0),
    `R$ ${(item.preco_unitario || 0).toFixed(2)}`,
    `R$ ${(item.subtotal || 0).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'SKU', 'Descrição', 'Qtd', 'Valor Unit.', 'Subtotal']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 30 },
      2: { cellWidth: 'auto' },
      3: { halign: 'center', cellWidth: 15 },
      4: { halign: 'right', cellWidth: 25 },
      5: { halign: 'right', cellWidth: 25 }
    },
    margin: { left: margin, right: margin }
  });

  currentY = doc.lastAutoTable.finalY + 10;

  // ========== TOTAIS ==========
  addLine(currentY);
  currentY += 5;

  const totalLabelX = pageWidth - margin - 70;
  const totalValueX = pageWidth - margin;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalLabelX, currentY);
  doc.text(`R$ ${(sale.valor_total || 0).toFixed(2)}`, totalValueX, currentY, { align: 'right' });
  currentY += 6;

  doc.text('Desconto:', totalLabelX, currentY);
  doc.text('R$ 0,00', totalValueX, currentY, { align: 'right' });
  currentY += 6;

  doc.text('Frete:', totalLabelX, currentY);
  doc.text('R$ 0,00', totalValueX, currentY, { align: 'right' });
  currentY += 8;

  addLine(currentY);
  currentY += 5;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('VALOR TOTAL:', totalLabelX, currentY);
  doc.text(`R$ ${(sale.valor_total || 0).toFixed(2)}`, totalValueX, currentY, { align: 'right' });
  currentY += 10;

  // ========== INFORMAÇÕES ADICIONAIS ==========
  addLine(currentY);
  currentY += 5;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMAÇÕES ADICIONAIS', margin, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Vendedor: ' + (sale.usuario || 'N/A'), margin, currentY);
  currentY += 4;
  doc.text('Forma de Pagamento: À vista', margin, currentY);
  currentY += 4;
  doc.text('Garantia: Conforme especificação do produto', margin, currentY);
  currentY += 8;

  // ========== RODAPÉ ==========
  const footerY = doc.internal.pageSize.getHeight() - 20;
  addLine(footerY);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  addCenteredText('Este documento foi gerado automaticamente pelo sistema InfoStock', footerY + 5);
  addCenteredText('Documento auxiliar - Sem valor fiscal para fins reais (Projeto Acadêmico)', footerY + 9);

  // ========== SALVAR PDF ==========
  const fileName = `NF-e_${sale.nota_fiscal?.numero || sale.id}_${sale.cliente?.replace(/\s+/g, '_') || 'Cliente'}.pdf`;
  doc.save(fileName);
  
  console.log('PDF gerado com sucesso:', fileName);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
};
