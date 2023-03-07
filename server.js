const fs = require("fs");
const path = require("path")
const { animals } = require("./animals.json")
const express = require("express");
const { create } = require("domain");
const { response } = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes")

app.use(express.static("public"))
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming string or array data
app.use(express.json());
app.use("/api", apiRoutes);
app.use("/", htmlRoutes);


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
});