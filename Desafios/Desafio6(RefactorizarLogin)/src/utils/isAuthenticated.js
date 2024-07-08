//Middleware redireccionador si es que no se encuentra una sesión activas

export function isAuthenticated(req, res, next) {
    if(req.session && req.session.login){
        return next();
    }else{
        res.redirect('/');
    }
}