/*
Route handler for CS Lesson Factory web app
 */

module.exports = (app, appData) =>
{
	const {body} = require("express-validator")

	function redirectIfLoggedIn (req, res, next)
	{
		next()
		return
		if (req.session.user) res.redirect("../mydetails")
		else next()
	}

	function redirectIfNotLoggedIn (req, res, next)
	{
		next()
		return
		if (! req.session.user) res.redirect("../login")
		else next()
	}

	function isUserLoggedIn (req)
	{
		return !! req.session.user;

	}

	// Index route
	app.get("/", (req, res) =>
	{
		res.render("index", appData)
	})

	// New lesson form GET
	app.get("/newlesson", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("newlesson", appData)
	})

	// New lesson form POST
	const lessonValidation = [
		body("title").notEmpty(),
		body("duration").isInt()
	]
	app.post("/newlesson", lessonValidation, redirectIfNotLoggedIn, (req, res) =>
	{

	})

	// New activity form GET
	app.get("/newactivity", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("newactivity", appData)
	})

	// New activity form POST
	const activityValidation = [
		body("title").notEmpty(), body("duration").isInt(),
		body("description").notEmpty()
	]
	app.post("/newactivity", redirectIfNotLoggedIn, activityValidation, (req, res) =>
	{
	})

	// Activity page
	app.get("/activity/:id", (req, res) =>
	{
		res.render("activity", appData)
	})

	// Activity edit form GET
	app.get("/activity/:id/edit", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("activity-edit", appData)
	})

	// Activity edit form PUT
	app.put("/activity/:id/edit", redirectIfNotLoggedIn, activityValidation, (req, res) =>
	{
	})

	// Lesson generator form GET
	app.get("/generator", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("generator", appData)
	})

	// Lesson generator form POST
	const generatorValidation = [
		body("tags").notEmpty(), body("duration").isInt()
	]
	app.post("/generate", redirectIfNotLoggedIn, generatorValidation, (req, res) =>
	{
	})

	// Lesson page
	app.get("/lesson/:id", (req, res) =>
	{
		res.render("lesson", appData)
	})

	// Lesson edit form GET
	app.get("/lesson/:id/edit", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("lesson-edit", appData)
	})

	// Lesson edit form PUT
	app.put("/lesson/:id/edit", lessonValidation, redirectIfNotLoggedIn, (req, res) =>
	{

	})

	// User activities page
	app.get("/myactivities", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("user-activities", appData)
	})

	// User favourite activities page
	app.get("/favourites", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("user-favourites", appData)
	})

	// User lessons page
	app.get("/mylessons", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("user-lessons", appData)
	})

	// Login form GET
	app.get("/login", redirectIfLoggedIn, (req, res) =>
	{
		res.render("login", appData)
	})

	// Login form POST
	const loginValidation = [
		body("username").notEmpty(), body("password").notEmpty()
	]
	app.post("/login", redirectIfLoggedIn, loginValidation, (req, res) =>
	{
	})

	// Signup form GET
	app.get("/signup", redirectIfLoggedIn, (req, res) =>
	{
		res.render("signup", appData)
	})

	// Signup form POST
	const userDetailsValidation = [
		body("username").notEmpty(), body("firstname").notEmpty(),
		body("surname").notEmpty(),
		body("password").isStrongPassword({
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1
		})
	]
	app.post("/signup", redirectIfLoggedIn, userDetailsValidation, (req, res) =>
	{
	})

	// User details form GET
	app.get("/mydetails", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("user-details", appData)
	})

	// User details form PUT
	app.put("/mydetails", redirectIfNotLoggedIn, userDetailsValidation, (req, res) =>
	{
	})

	// Search form GET
	app.get("/search", (req, res) =>
	{
		res.render("search", appData)
	})

	// Search form POST
	app.post("/search", (req, res) =>
	{
	})

	// Catch-all route, used for 404 errors
	app.get("*", (req, res) =>
	{
		res.render("error", appData)
	})
}