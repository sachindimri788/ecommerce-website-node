const express = require("express");
require("./config/dbConfig");
const app = express();
const port = 4000;
const path = require("path");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const fileUpload = require("express-fileupload");

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);

const static_path = path.join(__dirname, "./views/public");
app.use(express.static(static_path));

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = require("./Routes/indexRoute");
app.use("/", router);

app.listen(port, () => {
  console.log(`listning at port number ${port}`);
});
