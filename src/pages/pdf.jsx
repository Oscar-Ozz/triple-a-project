import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarReporteLuchadores = (luchadores) => {
  const doc = new jsPDF();

  // Configuración de colores Triple A
  const ROJO_AAA = [230, 0, 0];
  const NEGRO_AAA = [10, 10, 10];

  // Encabezado
  doc.setFillColor(...NEGRO_AAA);
  doc.rect(0, 0, 210, 40, 'F'); // Banner negro superior
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('LUCHA LIBRE AAA - ELENCO OFICIAL', 14, 25);
  
  doc.setFontSize(10);
  doc.text('REPORTE DE ADMINISTRACIÓN DE TALENTO', 14, 33);

  // Cuerpo de la tabla
  const tableColumn = ["ID", "NOMBRE DE GUERRA", "BANDO", "TÍTULOS", "EXP."];
  const tableRows = [];

  luchadores.forEach(l => {
    const rowData = [
      `#${l.id}`,
      l.nombre.toUpperCase(),
      l.bando,
      l.titulos || 'SIN TÍTULOS',
      l.exp || 'N/A'
    ];
    tableRows.push(rowData);
  });

  autoTable(doc, {
    startY: 50,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: ROJO_AAA,
      textColor: [255, 255, 255],
      fontSize: 12,
      halign: 'center'
    },
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 5
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });

  // Pie de página
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Documento generado para Oscar Alberto Leal Ramirez - Página ${i} de ${totalPages}`, 14, doc.internal.pageSize.height - 10);
  }

  doc.save(`Reporte_AAA_${new Date().toLocaleDateString()}.pdf`);
};