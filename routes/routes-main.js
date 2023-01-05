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
		if (req.session.user) res.redirect("./mydetails")
		else next()
	}

	function redirectIfNotLoggedIn (req, res, next)
	{
		next()
		return
		if (! req.session.user) res.redirect("./login")
		else next()
	}

	app.get("/", (req, res) =>
	{
		res.render("index", appData)
	})

	app.get("/newlesson", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("newlesson", appData)
	})

	const lessonValidation = [
		body("title").notEmpty(),
		body("duration").isInt()
	]
	app.post("/newlesson", lessonValidation, redirectIfNotLoggedIn, (req, res) =>
	{

	})

	app.get("/newactivity", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("newactivity", appData)
	})

	const activityValidation = [
		body("title").notEmpty(), body("duration").isInt(),
		body("description").notEmpty()
	]
	app.post("/newactivity", redirectIfNotLoggedIn, activityValidation, (req, res) =>
	{
	})

	app.get("/activity/:id", (req, res) =>
	{
		res.render("activity", appData)
	})

	app.get("/activity/:id/edit", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("activity-edit", appData)
	})

	app.put("/activity/:id/edit", redirectIfNotLoggedIn, activityValidation, (req, res) =>
	{
	})

	app.get("/generator", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("generator", appData)
	})

	const generatorValidation = [
		body("tags").notEmpty(), body("duration").isInt()
	]
	app.post("/generate", redirectIfNotLoggedIn, generatorValidation, (req, res) =>
	{
	})

	app.get("/lesson/:id", (req, res) =>
	{
		res.render("lesson", appData)
	})


	app.get("/lesson/:id/edit", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("lesson-edit", appData)
	})

	app.put("/lesson/:id/edit", lessonValidation, redirectIfNotLoggedIn, (req, res) =>
	{

	})

	app.get("/myactivities", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("user-activities", appData)
	})

	app.get("/favourites", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("user-favourites", appData)
	})

	app.get("/mylessons", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("user-lessons", appData)
	})

	app.get("/login", redirectIfLoggedIn, (req, res) =>
	{
		res.render("login", appData)
	})

	const loginValidation = [
		body("username").notEmpty(), body("password").notEmpty()
	]
	app.post("/login", redirectIfLoggedIn, loginValidation, (req, res) =>
	{
	})

	app.get("/signup", redirectIfLoggedIn, (req, res) =>
	{
		res.render("signup", appData)
	})

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

	app.get("/mydetails", redirectIfNotLoggedIn, (req, res) =>
	{
		res.render("user-details", appData)
	})

	app.put("/mydetails", redirectIfNotLoggedIn, userDetailsValidation, (req, res) =>
	{
	})

	app.get("/search", (req, res) =>
	{
	})

	app.post("/search", (req, res) =>
	{
	})

	app.get("*", (req, res) =>
	{
		res.render("error", appData)
	})
}