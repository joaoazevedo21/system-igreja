function verificarPermissao(permissoes) {
    return (req, res, next) => {

        // 🔥 LIBERA PRE-FLIGHT
        if (req.method === "OPTIONS") {
            return next();
        }

        const tipoUsuario = req.usuarioTipo;

        if (!tipoUsuario) {
            return res.status(403).send("Tipo de usuário não identificado");
        }

        if (permissoes.includes(tipoUsuario)) {
            return next();
        } else {
            return res.status(403).send("Acesso negado: você não tem permissão");
        }
    };
}

module.exports = verificarPermissao;