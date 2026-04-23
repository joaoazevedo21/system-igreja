const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {

    // 🔥 Permitir preflight CORS
    if (req.method === "OPTIONS") {
        return next();
    }

    let token = req.headers["authorization"];

    // ❌ sem token
    if (!token) {
        return res.status(401).send("Token não fornecido");
    }

    // remover "Bearer "
    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    try {

        // 🔐 validar token
        const decoded = jwt.verify(token, "segredo_super");

        // guardar dados do utilizador
        req.usuarioId = decoded.id;
        req.usuarioTipo = decoded.tipo;

        next();

    } catch (error) {

        return res.status(401).send("Token inválido");

    }
}

module.exports = verificarToken;