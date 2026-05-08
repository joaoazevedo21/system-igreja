function verificarPermissao(permissoes) {

    return (req, res, next) => {

        // 🔥 LIBERA PRE-FLIGHT
        if (req.method === "OPTIONS") {
            return next();
        }

        // 🔥 PEGA TIPO DO USUÁRIO
        const tipoUsuario = req.usuarioTipo;

        // 🔥 VALIDA SE EXISTE
        if (!tipoUsuario) {
            return res.status(403).send("Tipo de usuário não identificado");
        }

        // 🔥 ADMIN TEM ACESSO TOTAL
        if (tipoUsuario === "admin") {
            return next();
        }

        // 🔥 VERIFICA PERMISSÕES
        if (permissoes.includes(tipoUsuario)) {

            return next();

        } else {

            return res
                .status(403)
                .send("Acesso negado: você não tem permissão");

        }

    };

}

module.exports = verificarPermissao;