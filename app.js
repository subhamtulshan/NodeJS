const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const rootDir = require("./util/path");
const errorController = require("./controllers/error");
const db = require("./util/database");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

db.execute("SELECT * FROM products")
  .then(([rows, filemeta]) => {
    console.log(rows);
  })
  .catch();

app.listen(3000);
