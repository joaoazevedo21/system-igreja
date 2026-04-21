import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout"; // ✅ ADICIONADO

function Departamentos() {

  const [departamentos, setDepartamentos] = useState([]);
  const [nome, setNome] = useState("");

  const [editando, setEditando] = useState(false);
  const [departamentoEditando, setDepartamentoEditando] = useState(null);

  // ================= BUSCAR =================
  async function carregar() {
    try {
      const res = await api.get("/departamentos");
      setDepartamentos(res.data);
    } catch (error) {
      console.error("Erro ao buscar departamentos");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  // ================= CADASTRAR =================
  async function cadastrar(e) {
    e.preventDefault();

    try {
      await api.post("/departamentos/cadastrar", { nome });
      setNome("");
      carregar();
    } catch (error) {
      console.error("Erro ao cadastrar");
    }
  }

  // ================= DELETAR =================
  async function deletar(id) {
    if (!window.confirm("Deseja deletar?")) return;

    try {
      await api.delete("/departamentos/deletar/" + id);
      carregar();
    } catch (error) {
      console.error("Erro ao deletar");
    }
  }

  // ================= EDITAR =================
  function abrirEdicao(dep) {
    setEditando(true);
    setDepartamentoEditando(dep);
  }

  async function salvarEdicao() {
    try {
      await api.put(
        "/departamentos/atualizar/" + departamentoEditando.id,
        departamentoEditando
      );

      setEditando(false);
      carregar();

    } catch (error) {
      console.error("Erro ao editar");
    }
  }

  return (

    <Layout> {/* ✅ ADICIONADO */}

      <div style={styles.container}>

        <h1>📁 Departamentos</h1>

        {/* FORM */}
        <form onSubmit={cadastrar} style={styles.form}>

          <input
            type="text"
            placeholder="Nome do departamento"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={styles.input}
            required
          />

          <button style={styles.btnAdd}>Cadastrar</button>

        </form>

        {/* TABELA */}
        <table style={styles.table}>

          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Nome</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>

          <tbody>

            {departamentos.map((d, i) => (

              <tr key={d.id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>

                <td style={styles.td}>{d.id}</td>
                <td style={styles.td}>{d.nome}</td>

                <td style={styles.td}>

                  <button onClick={() => abrirEdicao(d)} style={styles.btnEdit}>
                    Editar
                  </button>

                  <button onClick={() => deletar(d.id)} style={styles.btnDelete}>
                    Deletar
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* MODAL */}
      {editando && (
        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <h2>Editar</h2>

            <input
              value={departamentoEditando.nome}
              onChange={(e) =>
                setDepartamentoEditando({
                  ...departamentoEditando,
                  nome: e.target.value
                })
              }
              style={styles.input}
            />

            <button onClick={salvarEdicao} style={styles.btnAdd}>
              Salvar
            </button>

            <button
              onClick={() => setEditando(false)}
              style={styles.btnCancel}
            >
              Cancelar
            </button>

          </div>

        </div>
      )}

    </Layout> // ✅ ADICIONADO

  );

}

const styles = {

  container: {
    marginLeft: "220px",
    padding: "20px"
  },

  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  btnAdd: {
    background: "#27ae60",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px"
  },

  btnEdit: {
    background: "#2980b9",
    color: "#fff",
    border: "none",
    padding: "6px",
    marginRight: "5px",
    borderRadius: "6px"
  },

  btnDelete: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "6px",
    borderRadius: "6px"
  },

  btnCancel: {
    background: "#7f8c8d",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "8px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden"
  },

  th: {
    background: "#2c3e50",
    color: "#fff",
    padding: "12px",
    textAlign: "left"
  },

  td: {
    padding: "12px"
  },

  rowEven: { background: "#fff" },
  rowOdd: { background: "#f9f9f9" },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  }

};

export default Departamentos;