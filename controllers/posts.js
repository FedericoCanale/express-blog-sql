
const posts = require("../data/posts");

function index(req, res) {
    const tag = req.query.tag;
    if (!tag) {
        return res.json(posts);
    }
    const normalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
    const filtered = posts.filter(post => post.tags.includes(normalizedTag));
    if (filtered.length === 0) {
        return res.status(404).json({ message: "Nessun post trovato con questo tag" });
    }
    return res.json(filtered);
}


function show(req, res) {
    const id = Number(req.params.id);
    const post = posts.find((p) => p.id === id);

    if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
    } else {
        return res.json(post);
    }
}


function store(req, res) {
    console.log("Dati in arrivo:", req.body);

    const newPost = {
        id: Date.now(),
        ...req.body
    };

    posts.push(newPost);

    return res.status(201).json(newPost);
}


function update(req, res) {
    const postId = Number(req.params.id);
    const postData = req.body;


    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({
            error: true,
            message: "Post non trovato"
        });
    }


    post.title = postData.title;
    post.content = postData.content;
    post.image = postData.image;
    post.tags = postData.tags;

    return res.json(post);
}

function modify(req, res) {
    const postId = Number(req.params.id);
    const postData = req.body;

    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({
            error: true,
            message: "Post non trovato"
        });
    }


    if (postData.title !== undefined) post.title = postData.title;
    if (postData.content !== undefined) post.content = postData.content;
    if (postData.image !== undefined) post.image = postData.image;
    if (postData.tags !== undefined) post.tags = postData.tags;

    return res.json(post);
}


function destroy(req, res) {
    const id = Number(req.params.id);
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Post non trovato" });
    }
    posts.splice(index, 1);
    console.log("Lista aggiornata dei post:", posts);
    return res.sendStatus(204);
}

/* function index(req, res, next) {
    next(new Error("Errore di test!"));
}
  To test internal server error  */

module.exports = {
    index,
    show,
    store,
    update,
    modify,
    destroy,
};