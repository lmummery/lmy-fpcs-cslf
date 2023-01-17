/*
Route handler for CS Lesson Factory web app
 */

module.exports = (app, appData) =>
{
	const {body, validationResult} = require("express-validator")

	/**
	 * Redirect to the user's details page if they are currently logged in
	 * @param req {Object} The HTTP request object
	 * @param res {Object} The HTTP response object
	 * @param next {Object} A callback function to be called after this function's completion
	 */
	function redirectIfLoggedIn (req, res, next)
	{
		next()
		return
		if (req.session.user) res.redirect("../mydetails")
		else next()
	}

	/**
	 * Redirect to the login page if a user is not currently logged in
	 * @param req {Object} The HTTP request object
	 * @param res {Object} The HTTP response object
	 * @param next {Object} A callback function to be called after this function's completion
	 */
	function redirectIfNotLoggedIn (req, res, next)
	{
		next()
		return
		if (! req.session.user) res.redirect("../login")
		else next()
	}

	/**
	 * Check that a user is currently logged in, regardless of who
	 * @param req {Object} The HTTP request object
	 * @returns {boolean} true if a user is logged in, false otherwise
	 */
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
		body("surname").notEmpty(), body("email").isEmail(),
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
		const errors = validationResult(req)

		// If there are any validation errors, report them with the re-sent form
		if (! errors.isEmpty())
		{
			let prefill = {
				title: req.body.title,
				firstname: req.sanitize(req.body.firstname),
				surname: req.sanitize(req.body.surname),
				email: req.sanitize(req.body.email),
				username: req.sanitize(req.body.username)
			}

			let data = Object.assign({}, appData, {prefill: prefill}, {msg: "Validation error"})
			data.userLoggedIn = isUserLoggedIn(req)
			res.render("signup", data)
		}

		else
		{
			// Sanitise inputs
			req.body.firstname = req.sanitize(req.body.firstname)
			req.body.surname = req.sanitize(req.body.surname)
			req.body.email = req.sanitize(req.body.email)
			req.body.username = req.sanitize(req.body.username)

			// Import bcrypt to hash passwords
			const bcrypt = require("bcrypt")
			const saltRounds = 10

			bcrypt.hash(req.body.password, saltRounds, (err, hash) =>
			{
				let query = `insert into user (email_address, title, first_name, surname, username, passwordHash)
							values (?, ?, ?, ?, ?, ?)`
				let args = [req.body.email, req.body.title, req.body.firstname, req.body.surname, req.body.username, hash]

				db.query(query, args, err =>
				{
					if (err)
					{
						let prefill = {
							firstname: req.sanitize(req.body.firstname),
							surname: req.sanitize(req.body.surname),
							email: req.sanitize(req.body.email),
							username: req.sanitize(req.body.username)
						}

						let data = Object.assign({}, appData, {prefill: prefill}, {msg: "Something went wrong"})
						data.userLoggedIn = isUserLoggedIn(req)
						res.render("signup", data)
					}
					else
					{
						// Successful registration
						req.session.user = req.body.username

						// TODO - current redirect to index when user signs up
						res.redirect("../")
					}
				})
			})
		}
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