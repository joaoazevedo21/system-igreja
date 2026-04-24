import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

import { toast } from "react-toastify";

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

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  async function carregarDados() {

    try {

      // 🔥 SEM TOKEN MANUAL (INTERCEPTOR FAZ ISSO)
      const res = await api.get("/estatisticas");
      setDados(res.data);

      const membros = await api.get("/relatorios/membros-por-departamento");
      setMembrosDepto(membros.data);

      const dizimos = await api.get("/relatorios/dizimos-por-departamento");
      setDizimosDepto(dizimos.data);

      toast.success("Dashboard carregado com sucesso");

    } catch (error) {
      toast.error("Erro ao carregar dashboard");
      console.error(error);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // ================= FILTRO POR DATA =================
  async function filtrarDizimos() {

    try {

      // 🔥 SEM TOKEN MANUAL
      const res = await api.get(
        `/relatorios/dizimos-por-departamento?inicio=${dataInicio}&fim=${dataFim}`
      );

      setDizimosDepto(res.data);

      toast.info("Filtro aplicado");

    } catch (error) {
      toast.error("Erro ao filtrar dados");
    }
  }

  const dataMembros = {
    labels: membrosDepto.map(d => d.departamento),
    datasets: [
      {
        label: "Membros",
        data: membrosDepto.map(d => d.total_membros),
        backgroundColor: "#27ae60"
      }
    ]
  };

  const dataDizimos = {
    labels: dizimosDepto.map(d => d.departamento),
    datasets: [
      {
        label: "Dízimos (Kz)",
        data: dizimosDepto.map(d => d.total_dizimos),
        backgroundColor: "#2980b9"
      }
    ]
  };

  return (

    <Layout>

      <h1>📊 Painel de Controle Inteligente</h1>

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
      </div>

    </Layout>

  );
}

const styles = {
  cards: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px"
  },
  cardGreen: {
    flex: 1,
    background: "#27ae60",
    color: "#fff",
    padding: "20px",
    borderRadius: "10px"
  },
  cardBlue: {
    flex: 1,
    background: "#2980b9",
    color: "#fff",
    padding: "20px",
    borderRadius: "10px"
  },
  cardYellow: {
    flex: 1,
    background: "#f39c12",
    color: "#fff",
    padding: "20px",
    borderRadius: "10px"
  },
  filtro: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },
  box: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px"
  }
};

export default Dashboard;