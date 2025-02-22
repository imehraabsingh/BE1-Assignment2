const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const postsFile = path.join(__dirname, "posts.json");
let posts = [];

if (fs.existsSync(postsFile)) {
    const data = fs.readFileSync(postsFile);
    posts = JSON.parse(data);
}

app.get("/", (req, res) => {
    res.render("home", { posts });
});

app.get("/add-post", (req, res) => {
    res.render("addPost");
});

app.post("/add-post", (req, res) => {
    const { title, content } = req.body;
    
    if (!title || !content) {
        return res.send("Title and content are required!");
    }

    const newPost = { id: posts.length + 1, title, content };
    posts.push(newPost);

    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

    res.redirect("/");
});

app.get("/post/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    res.render("post", { post });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});