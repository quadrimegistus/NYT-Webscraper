require('dotenv').config();

//! Dependencies:
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const dbConnection = require('./config/connection.ts');
//! Assign a PORT, utilize Express, define connection:
const PORT = process.env.PORT || 8080;
const app = express();
//! Instruct Express on what Middlewares to use:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use((_req: any,
    res: { header: { (arg0: string, arg1: string): void; (arg0: string, arg1: string): void } },
    next: () => void) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(session({
    store: new MongoStore({ mongooseConnection: dbConnection }),
    resave: false,
    saveUninitialized: false
}));
app.use('/', require('./routes/apiRoutes.ts'));

app.use((err: { stack: any }, req: any, res: { status: (arg0: number) => void }, next: any) => {
    console.error(`There's been an error:\n${err.stack}`);
    res.status(500);
});
app.listen(PORT, () => {
    console.log(`Listening for requests on port: ${PORT}`);
});

module.exports = app;
