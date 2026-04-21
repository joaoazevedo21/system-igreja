import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout"; // ✅ ADICIONADO

function Membros() {

  const [membros, setMembros] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [pesquisa, setPesquisa] = useState("");

  const [editando, setEditando] = useState(false);
  const [membroEditando, setMembroEditando] = useState(null);

  // 🔥 NOVOS ESTADOS
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  // ================= BUSCAR =================
  async function carregarMembros() {
    setLoading(true);
    try {
      const response = await api.get("/membros");
      setMembros(response.data);
    } catch (error) {
      console.error("Erro ao buscar membros");
      setMensagem("❌ Erro ao carregar membros");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarMembros();
  }, []);

  // ================= CADASTRAR =================
  async function cadastrarMembro(e) {
    e.preventDefault();

    try {
      await api.post("/membros/cadastrar", { nome, email });

      setNome("");
      setEmail("");
      setMensagem("✅ Membro cadastrado com sucesso!");

      carregarMembros();

    } catch (error) {
      console.error("Erro ao cadastrar membro");
      setMensagem("❌ Erro ao cadastrar membro");
    }
  }

  // ================= DELETAR =================
  async function deletarMembro(id) {

    const confirmar = window.confirm("⚠ Tem certeza que deseja deletar este membro?");
    if (!confirmar) return;

    try {
      await api.delete("/membros/deletar/" + id);
      setMensagem("🗑 Membro deletado com sucesso!");
      carregarMembros();
    } catch (error) {
      console.error("Erro ao deletar membro");
      setMensagem("❌ Erro ao deletar membro");
    }
  }

  // ================= EDITAR =================
  function abrirEdicao(membro) {
    setEditando(true);
    setMembroEditando(membro);
  }

  async function salvarEdicao() {
    try {

      await api.put("/membros/atualizar/" + membroEditando.id, membroEditando);

      setEditando(false);
      setMembroEditando(null);
      setMensagem("✏ Membro atualizado com sucesso!");

      carregarMembros();

    } catch (error) {
      console.error("Erro ao editar membro");
      setMensagem("❌ Erro ao editar membro");
    }
  }

  // ================= FILTRO =================
  const membrosFiltrados = membros.filter((m) =>
    m.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (

    <Layout> {/* ✅ ADICIONADO */}

      <div style={styles.container}>

        <h1 style={styles.title}>👥 Gestão de Membros</h1>

        {/* 🔥 MENSAGEM */}
        {mensagem && <p style={styles.mensagem}>{mensagem}</p>}

        {/* 🔥 LOADING */}
        {loading && <p>Carregando...</p>}

        {/* CONTADOR */}
        <p style={styles.count}>Total: {membrosFiltrados.length} membros</p>

        {/* PESQUISA */}
        <input
          type="text"
          placeholder="Pesquisar membro..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          style={styles.search}
        />

        {/* FORMULÁRIO */}
        <form onSubmit={cadastrarMembro} style={styles.form}>

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <button style={styles.btnAdd}>Registrar</button>

        </form>

        {/* 🔥 TABELA RESPONSIVA */}
        <div style={{ overflowX: "auto" }}>

          <table style={styles.table}>

            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>E-mail</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>

            <tbody>

              {membrosFiltrados.map((m, index) => (

                <tr
                  key={m.id}
                  style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                >

                  <td style={styles.td}>{m.id}</td>
                  <td style={styles.td}>{m.nome}</td>
                  <td style={styles.td}>{m.email}</td>

                  <td style={styles.td}>

                    <button
                      onClick={() => abrirEdicao(m)}
                      style={styles.btnEdit}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => deletarMembro(m.id)}
                      style={styles.btnDelete}
                    >
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

              <h2>Editar Membro</h2>

              <input
                type="text"
                value={membroEditando.nome}
                onChange={(e) =>
                  setMembroEditando({ ...membroEditando, nome: e.target.value })
                }
                style={styles.input}
              />

              <input
                type="email"
                value={membroEditando.email}
                onChange={(e) =>
                  setMembroEditando({ ...membroEditando, email: e.target.value })
                }
                style={styles.input}
              />

              <div style={{ display: "flex", gap: "10px" }}>

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

          </div>
        )}

      </div>

    </Layout>

  );

}

const styles = {

  container: {
    padding: "40px",
    background: "#f4f6f9",
    minHeight: "100vh"
  },

  mensagem: {
    marginBottom: "10px",
    fontWeight: "bold"
  },

  title: {
    marginBottom: "10px",
    color: "#2c3e50"
  },

  count: {
    marginBottom: "10px"
  },

  search: {
    padding: "10px",
    width: "100%",
    maxWidth: "300px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    flex: "1",
    minWidth: "200px"
  },

  btnAdd: {
    background: "#27ae60",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  btnEdit: {
    background: "#2980b9",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    marginRight: "5px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  btnDelete: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  btnCancel: {
    background: "#7f8c8d",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0px 5px 15px rgba(0,0,0,0.1)"
  },

  th: {
    background: "#2c3e50",
    color: "#fff",
    padding: "12px",
    textAlign: "left"
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee"
  },

  rowEven: { background: "#ffffff" },
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
    gap: "10px",
    width: "300px"
  }

};

export default Membros;