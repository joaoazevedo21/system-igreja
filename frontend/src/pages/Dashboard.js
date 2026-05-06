import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

// 🔥 NOVO (PDF + EXCEL)
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {

  const [dados, setDados] = useState({
    total_membros: 0,
    total_departamentos: 0,
    total_dizimos: 0
  });

  const [membrosDepto, setMembrosDepto] = useState([]);
  const [dizimosDepto, setDizimosDepto] = useState([]);

  const [crescimento, setCrescimento] = useState([]);
  const [statusMembros, setStatusMembros] = useState({ ativos: 0, inativos: 0 });
  const [ranking, setRanking] = useState([]);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // 🔥 NOVO: valida token
  function tokenValido() {
    const token = localStorage.getItem("token");

    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.exp * 1000 < Date.now()) {
        localStorage.clear();
        return false;
      }

      return true;

    } catch {
      localStorage.clear();
      return false;
    }
  }

  // ================= EXPORTAR PDF =================
  function exportarPDF() {
    const doc = new jsPDF();

    doc.text("Relatório de Membros por Departamento", 14, 15);

    const tabela = membrosDepto.map(m => [
      m.departamento,
      m.total_membros
    ]);

    doc.autoTable({
      head: [["Departamento", "Total de Membros"]],
      body: tabela,
      startY: 20
    });

    doc.save("relatorio-membros.pdf");
  }

  // ================= EXPORTAR EXCEL =================
  function exportarExcel() {

    const dadosExcel = membrosDepto.map(m => ({
      Departamento: m.departamento,
      "Total de Membros": m.total_membros
    }));

    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob([buffer], {
      type: "application/octet-stream"
    });

    saveAs(blob, "relatorio-membros.xlsx");
  }

  async function carregarDados() {

    try {

      if (!tokenValido()) {
        window.location.href = "/";
        return;
      }

      const res = await api.get("/estatisticas");
      setDados(res.data);

      const membros = await api.get("/relatorios/membros-por-departamento");
      setMembrosDepto(membros.data);

      const dizimos = await api.get("/relatorios/dizimos-por-departamento");
      setDizimosDepto(dizimos.data);

      const cres = await api.get("/relatorios/crescimento-mensal");
      setCrescimento(cres.data);

      const status = await api.get("/relatorios/membros-status");
      setStatusMembros(status.data);

      const rank = await api.get("/relatorios/ranking-departamentos");
      setRanking(rank.data);

      toast.success("Dashboard carregado com sucesso");

    } catch (error) {

      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }

      toast.error("Erro ao carregar dashboard");
      console.error(error);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function filtrarDizimos() {
    try {

      if (!tokenValido()) {
        window.location.href = "/";
        return;
      }

      const res = await api.get(
        `/relatorios/dizimos-por-departamento?inicio=${dataInicio}&fim=${dataFim}`
      );

      setDizimosDepto(res.data);
      toast.info("Filtro aplicado");

    } catch (error) {

      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }

      toast.error("Erro ao filtrar dados");
    }
  }

  const dataMembros = {
    labels: membrosDepto.map(d => d.departamento),
    datasets: [{
      label: "Membros",
      data: membrosDepto.map(d => d.total_membros),
      backgroundColor: "#27ae60"
    }]
  };

  const dataDizimos = {
    labels: dizimosDepto.map(d => d.departamento),
    datasets: [{
      label: "Dízimos (Kz)",
      data: dizimosDepto.map(d => d.total_dizimos),
      backgroundColor: "#2980b9"
    }]
  };

  const dataCrescimento = {
    labels: crescimento.map(c => c.mes),
    datasets: [{
      label: "Novos Membros",
      data: crescimento.map(c => c.total),
      backgroundColor: "#8e44ad"
    }]
  };

  const dataStatus = {
    labels: ["Ativos", "Inativos"],
    datasets: [{
      data: [statusMembros.ativos, statusMembros.inativos],
      backgroundColor: ["#2ecc71", "#e74c3c"]
    }]
  };

  const dataRanking = {
    labels: ranking.map(r => r.departamento),
    datasets: [{
      label: "Top Departamentos",
      data: ranking.map(r => r.total),
      backgroundColor: "#f1c40f"
    }]
  };

  return (
    <Layout>

      <h1>📊 Painel de Controle Inteligente</h1>

      {/* 🔥 BOTÕES NOVOS */}
      <div style={{ marginBottom: "15px" }}>
        <button onClick={exportarPDF}>📄 Exportar PDF</button>
        <button onClick={exportarExcel} style={{ marginLeft: "10px" }}>
          📊 Exportar Excel
        </button>
      </div>

      <div style={styles.totalGeral}>
        👥 Total Geral de Membros: <strong>{dados.total_membros}</strong>
      </div>

      <div style={styles.cards}>
        <div style={styles.cardGreen}>👥 {dados.total_membros}</div>
        <div style={styles.cardBlue}>📁 {dados.total_departamentos}</div>
        <div style={styles.cardYellow}>💰 {dados.total_dizimos} Kz</div>
      </div>

      <div style={styles.filtro}>
        <input type="date" onChange={(e) => setDataInicio(e.target.value)} />
        <input type="date" onChange={(e) => setDataFim(e.target.value)} />
        <button onClick={filtrarDizimos}>Filtrar</button>
      </div>

      <div style={styles.grid}>

        <div style={styles.box}>
          <h3>Membros por Departamento</h3>
          <Bar data={dataMembros} />
        </div>

        <div style={styles.box}>
          <h3>Dízimos por Departamento</h3>
          <Bar data={dataDizimos} />
        </div>

        <div style={styles.box}>
          <h3>Crescimento Mensal</h3>
          <Bar data={dataCrescimento} />
        </div>

        <div style={styles.box}>
          <h3>Ativos vs Inativos</h3>
          <Bar data={dataStatus} />
        </div>

        <div style={styles.box}>
          <h3>Top Departamentos</h3>
          <Bar data={dataRanking} />
        </div>

      </div>

    </Layout>
  );
}

const styles = {
  totalGeral: {
    background: "#2ecc71",
    color: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
    textAlign: "center",
    fontWeight: "bold"
  },
  cards: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px"
  },
  cardGreen: { flex: 1, background: "#27ae60", color: "#fff", padding: "20px", borderRadius: "10px" },
  cardBlue: { flex: 1, background: "#2980b9", color: "#fff", padding: "20px", borderRadius: "10px" },
  cardYellow: { flex: 1, background: "#f39c12", color: "#fff", padding: "20px", borderRadius: "10px" },
  filtro: { display: "flex", gap: "10px", marginBottom: "20px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  box: { background: "#fff", padding: "20px", borderRadius: "10px" }
};

export default Dashboard;