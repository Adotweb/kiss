const browserSync = require('browser-sync').create();
const nodemon = require('nodemon');

const app = require("./api/index")

app.listen(3000)

