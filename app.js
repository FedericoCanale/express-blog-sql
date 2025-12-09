const express = require("express");

const app = express();
const PORT = 3000;

// middlewares
app.use(express.static("public"));
app.use(express.json());

// routers
const postsRouter = require("./routers/posts");

// rotte
app.get("/", (req, res) => {
    res.send("Homepage del blog");
});

app.use("/posts", postsRouter);

// middlewares per rotte non trovate
const notFound = require("./middlewares/notFound");
app.use(notFound);

// middleware di gestione errori
const errorsHandler = require("./middlewares/errorsHandler");
app.use(errorsHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});