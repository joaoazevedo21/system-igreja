import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ================= MEMBROS =================
export function exportarMembrosPDF(membros) {

  const doc = new jsPDF();

  doc.text("Relatório de Membros", 14, 15);
  doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 22);

  const dados = membros.map(m => [
    m.departamento || "-",
    m.total_membros || 0
  ]);

  autoTable(doc, {
    head: [["Departamento", "Total"]],
    body: dados,
    startY: 30
  });

  doc.save("membros.pdf");
}