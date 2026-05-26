import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

function Dizimos() {

  const [valor, setValor] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");

  const [departamentos, setDepartamentos] = useState([]);
  const [dizimos, setDizimos] = useState([]);

  const [mensagem, setMensagem] = useState("");

  // ================= CARREGAR DADOS =================
  async function carregarDados() {

    try {

      const dep = await api.get("/departamentos");
      setDepartamentos(dep.data);

      const diz = await api.get("/dizimos");
      setDizimos(diz.data);

    } catch (error) {

      console.error(error);

    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // ================= CADASTRAR =================
  async function cadastrar(e) {

    e.preventDefault();

    setMensagem("");

    try {

      await api.post("/dizimos/cadastrar", {
        valor,
        departamento_id: departamentoId
      });

      setMensagem("✅ Dízimo cadastrado com sucesso");

      setValor("");
      setDepartamentoId("");

      carregarDados();

    } catch (error) {

      console.error(error);

      if (error.response?.data) {
        setMensagem(`❌ ${error.response.data}`);
      } else {
        setMensagem("❌ Erro ao cadastrar dízimo");
      }

    }
  }

  return (

    <Layout>

      <div style={styles.container}>

        <h1 style={styles.title}>
          💵 Gestão de Dízimos
        </h1>

        {mensagem && (
          <p style={styles.mensagem}>
            {mensagem}
          </p>
        )}

        {/* ================= FORM ================= */}
        <form onSubmit={cadastrar} style={styles.form}>

          <input
            type="number"
            placeholder="Valor do dízimo"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            style={styles.input}
            required
          />

          <select
            value={departamentoId}
            onChange={(e) => setDepartamentoId(e.target.value)}
            style={styles.input}
            required
          >

            <option value="">
              Selecione o departamento
            </option>

            {departamentos.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.nome}
              </option>
            ))}

          </select>

          <button style={styles.button}>
            Salvar Dízimo
          </button>

        </form>

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

  mensagem: {
    marginBottom: "15px",
    fontWeight: "bold"
  },

  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minWidth: "220px"
  },

  button: {
    background: "#27ae60",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  tableContainer: {
    overflowX: "auto",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  }

};

export default Dizimos;