//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");

const homeStartingContent =
	"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
	"Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
	"Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [];
var date = new Date();
var options = {
	weekday: "long",
	day: "numeric",
	month: "long",
};
var today = date.toLocaleDateString("en-US", options);

app.get("/", (req, res) => {
	res.render("home.ejs", {
		homeTitle: "Home",
		homeStartingContent: homeStartingContent,
		posts: posts,
	});
});

app.get("/contact", (req, res) => {
	res.render("contact.ejs", {
		contactTitle: "Contact",
		contactContent: contactContent,
	});
});

app.get("/about", (req, res) => {
	res.render("about.ejs", {
		aboutTitle: "About",
		aboutContent: aboutContent,
	});
});

app.get("/compose", (req, res) => {
	res.render("compose.ejs", {});
});

app.post("/compose", (req, res) => {
	const currentPost = {
		date: today,
		title: req.body.composerTitle,
		content: req.body.composerPost,
		summary: req.body.composerPost.slice(0, 100),
	};

	posts.push(currentPost);
	res.redirect("/");
});

app.get("/posts/:postname", (req, res) => {
	let postTitle = _.lowerCase(req.params.postname);
	const found = posts.some((post) => _.lowerCase(post.title) === postTitle);
	if (found) {
		let postContent = "";
		posts.forEach((post) => {
			if (_.lowerCase(post.title) === postTitle) {
				postContent = post.content;
				postTitle = post.title;
			}
		});
		res.render("post.ejs", {
			postTitle: postTitle,
			postContent: postContent,
		});
	} else res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
	console.log("Server started on port 3000");
});
