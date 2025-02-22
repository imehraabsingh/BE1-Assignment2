const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ✅ Middleware to log request details
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const postsFilePath = path.join(__dirname, "posts.json");

function loadPosts() {
    try {
        return JSON.parse(fs.readFileSync(postsFilePath, "utf8"));
    } catch (error) {
        return [];
    }
}

app.get("/", (req, res) => {
    const posts = loadPosts();
    res.render("home", { posts });
});

app.get("/post/:id", (req, res) => {
    const postId = req.params.id;
    const posts = loadPosts();
    const post = posts.find(p => p.id == postId);

    if (!post) {
        return res.status(404).send("Post not found");
    }

    res.render("post", { post });
});

app.get("/add-post", (req, res) => {
    res.render("addPost");
});

app.post("/add-post", (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).send("Title and content are required");
    }

    const posts = loadPosts();
    const newPost = { id: posts.length + 1, title, content };
    posts.push(newPost);

    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
