const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);
const path = require("path");

app.use(express.static(path.join(__dirname, 'dist')));

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    writeToDisk: true
  })
);

app.set('view engine', 'ejs');

app.use("/contacts", function (_, response) {
  response.redirect("/contacts.html")
});
app.use("/pricing", function (_, response) {
  response.redirect("/pricing.html")
});
app.use("/about", function (_, response) {
  response.redirect("/about.html")
});
app.use("/blog", function (_, response) {
  response.redirect("/blog.html")
});

app.get("*", function (req, res, next) {
  if (!(req.url.endsWith(".js") || req.url.endsWith(".ico"))) {
    res.redirect("/404.html")
  } else {
    next();
  }
})

app.listen(8080);