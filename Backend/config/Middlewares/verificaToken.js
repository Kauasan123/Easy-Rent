const jwt = require('jsonwebtoken');

function verificaToken(req, res, next) {
    const autorizacao = req.headers.authorization;

    if (!autorizacao || !autorizacao.startsWith('Bearer ')) {
        return res.status(401).json({
            erro: 'Autenticação necessária.'
        });
    }

    const token = autorizacao.slice(7);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (!Number.isInteger(payload.usuarioId)) {
            return res.status(401).json({
                erro: 'Token inválido.'
            });
        }

        req.usuarioId = payload.usuarioId;
        next();
    } catch (error) {
        return res.status(401).json({
            erro: 'Token inválido ou expirado.'
        });
    }
}

module.exports = verificaToken;