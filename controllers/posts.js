
const posts = require("../data/posts");
const connection = require("../database/db");

/* OLD API CRUD function index(req, res) {
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
}*/

/* GET data from databse with STATUS CODE*/
function index(req, res) {
    const sql = "SELECT * FROM posts";

    connection.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
            });
        }

        return res.json(results);
    });
}

/* OLD API CRUD function show(req, res) {
    const id = Number(req.params.id);
    const post = posts.find((p) => p.id === id);

    if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
    } else {
        return res.json(post);
    }
}*/

const show = (req, res) => {

    const id = Number(req.params.id);

    const sql = 'SELECT * FROM posts WHERE id = ?';

    const sqlTags = `
    SELECT tags.id, tags.label
    FROM tags
    JOIN post_tag ON post_tag.tag_id = tags.id
    WHERE post_tag.post_id = ?
  `;

    console.log(sql, id);


    connection.query(sql, [id], (err, response) => {

        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
            });
        }

        if (response.length === 0) {
            return res.status(404).json({
                error: true,
                message: "Post Not Found",
            });
        }

        const post = response[0];


        connection.query(sqlTags, [id], (errTags, resTags) => {

            if (errTags) {
                return res.status(500).json({
                    error: true,
                    message: errTags.message,
                });
            }

            console.log("Post:", post);
            console.log("Tags:", resTags);


            post.tags = resTags;

            return res.json(post);
        });
    });
};
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


/*OLD API CRUD function destroy(req, res) {
    const id = Number(req.params.id);
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Post non trovato" });
    }
    posts.splice(index, 1);
    console.log("Lista aggiornata dei post:", posts);
    return res.sendStatus(204);
}*/

const destroy = (req, res) => {

    const id = Number(req.params.id);

    const sql = 'DELETE FROM posts WHERE id = ?';
    console.log(sql, id);

    connection.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message
            });
        }
        console.log(results);
        return res.sendStatus(204);
    });
};

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