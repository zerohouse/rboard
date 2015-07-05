var COOKIE_SECRET = 'secret';
var COOKIE_NAME = 'sid';

app.use(cookieParser(COOKIE_SECRET));
app.use(session({
    name: COOKIE_NAME,
    store: sessionStore,
    secret: COOKIE_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: null
    }
}));


app.use(multer({
    dest: './client/img/uploads/',
    rename: function (fieldname, filename) {
        return Date.now();
    },
    onFileUploadStart: function (file) {
    },
    onFileUploadComplete: function (file) {
    }
}));


io.use(function (socket, next) {
    try {
        var data = socket.handshake || socket.request;
        if (!data.headers.cookie) {
            return next(new Error('Missing cookie headers'));
        }
        var cookies = cookie.parse(data.headers.cookie);
        if (!cookies[COOKIE_NAME]) {
            return next(new Error('Missing cookie ' + COOKIE_NAME));
        }
        var sid = cookieParser.signedCookie(cookies[COOKIE_NAME], COOKIE_SECRET);
        if (!sid) {
            return next(new Error('Cookie signature is not valid'));
        }
        socket.sid = sid;
        sessionStore.get(sid, function (err, session) {
            if (err) return next(err);
            if (!session) return next(new Error('session not found'));
            socket.session = session;
            next();
        });
    } catch (err) {
        next(new Error('Internal server error'));
    }
});