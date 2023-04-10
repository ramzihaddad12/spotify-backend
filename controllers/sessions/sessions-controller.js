const setSession = (req, res) => {
    var name = req.params['name'];
    var value = req.params['value'];
    req.session[name] = value;
    res.send(req.session);
}

const getSession = (req, res) => {
    var name = req.params.name;
    var value = req.session[name];
    res.send(value);
}

const getSessionAll = (req, res) => {
    res.send(req.session);
}

const resetSession = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
}



const SessionController = (app) => {
    app.get('/api/session/set/:name/:value', setSession);
    app.get('/api/session/get/:name', getSession);
    app.get('/api/session/get', getSessionAll);
    app.get('/api/session/reset', resetSession);
}

export default SessionController