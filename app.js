const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require("mongoose");
const { times } = require("lodash");
const app = express();
const dotenv = require("dotenv").config();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const DB_URI = process.env.DB_URI;
const mongodb_connection =
	"mongodb+srv://" + DB_USER + ":" + DB_PASS + "@" + DB_URI + "/" + DB_NAME;

mongoose.connect(mongodb_connection, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const contentSchema = mongoose.Schema({
	title: String,
	content: String,
});

const postSchema = mongoose.Schema({
	date: String,
	title: {
		type: String,
		required: [true, "Title is a required"],
	},
	content: {
		type: String,
		required: [true, "Content is a required"],
	},
	summary: {
		type: String,
		required: [true, "Summary is a required"],
	},
});

const Post = mongoose.model("Post", postSchema);
const Content = mongoose.model("Content", contentSchema);

var date = new Date();
var options = {
	weekday: "long",
	day: "numeric",
	month: "long",
};
var today = date.toLocaleDateString("en-US", options);

app.get("/", (req, res) => {
	Content.findOne({ title: "homeContent" }, (err, contents) => {
		if (err) console.log(err);
		else {
			let homeStartingContent = contents.content;
			Post.find({}, (err, contents) => {
				if (err) console.log(err);
				else {
					let posts = [];
					if (contents) {
						contents.forEach((content) => {
							posts.push(content);
						});
					}
					res.render("home.ejs", {
						homeTitle: "Home",
						homeStartingContent: homeStartingContent,
						posts: posts,
					});
				}
			});
		}
	});
});

app.get("/contact", (req, res) => {
	Content.findOne({ title: "contactContent" }, (err, contents) => {
		if (err) console.log(err);
		else {
			let contactContent = contents.content;
			res.render("contact.ejs", {
				contactTitle: "Contact",
				contactContent: contactContent,
			});
		}
	});
});

app.get("/about", (req, res) => {
	Content.findOne({ title: "aboutContent" }, (err, contents) => {
		if (err) console.log(err);
		else {
			let aboutContent = contents.content;
			res.render("about.ejs", {
				aboutTitle: "About",
				aboutContent: aboutContent,
			});
		}
	});
});

app.get("/compose", (req, res) => {
	res.render("compose.ejs", {});
});

app.post("/compose", (req, res) => {
	const currentPost = new Post({
		date: today,
		title: req.body.composerTitle,
		content: req.body.composerPost,
		summary: req.body.composerPost.slice(0, 100),
	});
	Post.insertMany([currentPost], (err) => {
		if (err) console.log;
		else console.log("Successfully Posted");
		res.redirect("/");
	});
});

app.get("/posts/:postid", (req, res) => {
	const postid = req.params.postid;
	Post.findOne({ _id: postid }, (err, post) => {
		if (err) {
			console.log(err);
			res.redirect("/");
		} else {
			if (post) {
				let postContent = post.content;
				let postTitle = post.title;
				res.render("post.ejs", {
					postTitle: postTitle,
					postContent: postContent,
				});
			} else res.redirect("/");
		}
	});
});

app.listen(process.env.PORT || 3000, function () {
	console.log("Server started on port 3000");
});
