/* const jwt = require('jsonwebtoken');
const config = require('./config');

export const getToken = (user) => {
    return jwt.sign({
        _id: user.id,
        name: user.name,
        email: user.email,
        isadmin: user.isadmin
    }, 
    config.JWT_SECRET, {
        expiresIn: '48h'
    })
}

export const isAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if(token) {
        const onlyToken = token.slice(7, token.length);
        jwt.verify(onlyToken, config.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).send({msg: 'Invalid Token' })
            }
            else {
                req.user = decode;
                next();
                return
            }
        })
    }
    else {
        return res.status(401).send({msg: 'Token was not supplied' })
    }
}

export const isAdmin = (req, res, next) => {
    if(req.user && req.user.isadmin) {
        return next();
    }
    else {
        return res.status(401).send({ msg: 'Admin token is invalid' });
    }
} */