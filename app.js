const express = require("express");

const app = express();
const PORT = 3000;
const postsRouter = require("./routers/posts");
const notFound = require("./middlewares/notFound");
const errorsHandler = require("./middlewares/errorsHandler");

// middlewares
app.use(express.static("public"));
app.use(express.json());

// routers
// rotte
app.get("/", (req, res) => {
    res.send("Homepage del blog");
});

app.use("/posts", postsRouter);

// middlewares per rotte non trovate
app.use(notFound);

// middleware di gestione errori
app.use(errorsHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});