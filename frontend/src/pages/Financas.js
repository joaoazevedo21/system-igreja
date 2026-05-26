import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

function Financeiro() {

  const [dizimos, setDizimos] = useState([]);
  const [total, setTotal] = useState(0);

  // ================= CARREGAR DADOS =================
  async function carregarDados() {

    try {

      const res = await api.get("/dizimos");

      setDizimos(res.data);

      // 🔥 SOMA TOTAL
      const soma = res.data.reduce((acc, item) => {
        return acc + Number(item.valor);
      }, 0);

      setTotal(soma);

    } catch (error) {

      console.error(error);

    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (

    <Layout>

      <div style={styles.container}>

        <h1 style={styles.title}>
          💰 Painel Financeiro
        </h1>

        {/* ================= CARD TOTAL ================= */}
        <div style={styles.cardTotal}>

          <h2>Total de Dízimos</h2>

          <h1>
            {total.toLocaleString()} Kz
          </h1>

        </div>

        {/* ================= TABELA ================= */}
        <div style={styles.tableContainer}>

          <table style={styles.table}>

            <thead>

              <tr>
                <th>ID</th>
                <th>Valor</th>
                <th>Departamento</th>
                <th>Data</th>
              </tr>

            </thead>

            <tbody>

              {dizimos.map((d) => (

                <tr key={d.id}>

                  <td>{d.id}</td>

                  <td>
                    {Number(d.valor).toLocaleString()} Kz
                  </td>

                  <td>{d.departamento}</td>

                  <td>
                    {new Date(d.data).toLocaleDateString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </Layout>

  );
}

const styles = {

  container: {
    padding: "30px",
    background: "#f4f6f9",
    minHeight: "100vh"
  },

  title: {
    marginBottom: "20px",
    color: "#2c3e50"
  },

  cardTotal: {
    background: "#27ae60",
    color: "#fff",
    padding: "30px",
    borderRadius: "12px",
    marginBottom: "20px",
    textAlign: "center",
    boxShadow: "0px 5px 15px rgba(0,0,0,0.1)"
  },

  tableContainer: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  }

};

export default Financeiro;