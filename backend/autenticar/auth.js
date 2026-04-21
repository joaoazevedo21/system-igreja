const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {

    // 🔥 LIBERA PRE-FLIGHT (CORS)
    if (req.method === "OPTIONS") {
        return next();
    }

    let token = req.headers["authorization"];

    // verificar se o token tem "Bearer "
    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    // se não existir token
    if (!token) {
        return res.status(403).send("Token não fornecido");
    }

    try {

        // verificar token
        const decoded = jwt.verify(token, "segredo_super");

        // guardar dados do usuário
        req.usuarioId = decoded.id;
        req.usuarioTipo = decoded.tipo;

        next();

    } catch (error) {

        return res.status(401).send("Token inválido");

    }

}

module.exports = verificarToken;