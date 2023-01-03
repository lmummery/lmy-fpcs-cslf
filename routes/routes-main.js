/*
Route handler for CS Lesson Factory web app
 */

module.exports = (app, appData) =>
{
	function redirectIfLoggedIn (req, res, next)
	{
		next()
	}

	function redirectIfNotLoggedIn (req, res, next)
	{
		next()
	}

	const {body} = require("express-validator")

	app.get("/", (req, res) =>
	{
		res.render("index", appData)
	})

	app.get("/newactivity", (req, res) =>
	{
		res.render("newactivity", appData)
	})

	const activityValidation = [
		body("title").notEmpty(), body("duration").isInt(),
		body("description").notEmpty()
	]
	app.post("/newactivity", activityValidation, (req, res) =>
	{
	})

	app.get("/activity/:id", (req, res) =>
	{
		res.render("activity", appData)
	})

	app.get("/activity/:id/edit", activityValidation, (req, res) =>
	{
		res.render("activity-edit", appData)
	})

	app.put("/activity/:id/edit", (req, res) =>
	{
	})

	app.get("/generator", (req, res) =>
	{
		res.render("generator", appData)
	})

	const generatorValidation = [
		body("tags").notEmpty(), body("duration").isInt()
	]
	app.post("/generate", generatorValidation, (req, res) =>
	{
	})

	app.get("/lesson/:id", (req, res) =>
	{
		res.render("lesson", appData)
	})


	app.get("/lesson/:id/edit", (req, res) =>
	{
		res.render("lesson-edit", appData)
	})

	app.get("/myactivities", (req, res) =>
	{
		res.render("user-activities", appData)
	})

	app.get("/favourites", (req, res) =>
	{
		res.render("user-favourites", appData)
	})

	app.get("/mylessons", (req, res) =>
	{
		res.render("user-lessons", appData)
	})

	app.get("/login", (req, res) =>
	{
		res.render("login", appData)
	})

	const loginValidation = [
		body("username").notEmpty(), body("password").notEmpty()
	]
	app.post("/login", loginValidation, (req, res) =>
	{
	})

	app.get("/signup", (req, res) =>
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
	app.post("/signup", userDetailsValidation, (req, res) =>
	{
	})

	app.get("/mydetails", (req, res) =>
	{
		res.render("user-details", appData)
	})

	app.put("/mydetails", userDetailsValidation, (req, res) =>
	{
	})

	app.get("/search", (req, res) =>
	{
	})

	app.post("/search", (req, res) =>
	{
	})
}