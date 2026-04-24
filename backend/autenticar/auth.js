const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {

    // 🔥 LIBERA PRE-FLIGHT (CORS)
    if (req.method === "OPTIONS") {
        return next();
    }

    const authHeader = req.headers.authorization;

    // 🔥 DEBUG (opcional)
    console.log("HEADER RECEBIDO:", authHeader);

    // se não existir header
    if (!authHeader) {
        return res.status(403).send("Token não fornecido");
    }

    // formato: Bearer TOKEN
    const partes = authHeader.split(" ");

    if (partes.length !== 2) {
        return res.status(401).send("Token mal formatado");
    }

    const token = partes[1];

    try {

        // 🔥 USAR A MESMA CHAVE DO LOGIN
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // guardar dados do usuário
        req.usuarioId = decoded.id;
        req.usuarioTipo = decoded.tipo;

        next();

    } catch (error) {

        console.error("ERRO TOKEN:", error.message);
        return res.status(401).send("Token inválido");

    }

}

module.exports = verificarToken;