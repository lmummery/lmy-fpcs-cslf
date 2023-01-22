/*
Route handler for CS Lesson Factory web app
 */

module.exports = (app, appData, upload) =>
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
		if (! req.session.user) res.redirect(`../login?url=${req.url}`)
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
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("index", data)
	})

	// New lesson form GET
	app.get("/newlesson", redirectIfNotLoggedIn, (req, res) =>
	{
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("newlesson", data)
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
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("newactivity", data)
	})

	// New activity form POST
	const activityValidation = [
		body("title").notEmpty(), body("duration").isInt(),
		body("description").notEmpty()
	]
	// TODO - multer not accepting uploads
	app.post("/newactivity", upload.fields([{name: "files"}]), redirectIfNotLoggedIn, activityValidation, (req, res) =>
	{
		console.debug(`REQ.BODY.FILES = ${req.body.files}`)
		const errors = validationResult(req)

		// Convert the year group fields to Boolean values
		req.body.y1 = req.body.y1 === "on"
		req.body.y2 = req.body.y2 === "on"
		req.body.y3 = req.body.y3 === "on"
		req.body.y4 = req.body.y4 === "on"
		req.body.y5 = req.body.y5 === "on"
		req.body.y6 = req.body.y6 === "on"

		if (! errors.isEmpty())
		{
			let prefill = {
				title: req.sanitize(req.body.title),
				years: {y1: req.body.y1, y2: req.body.y2, y3: req.body.y3,
					y4: req.body.y4, y5: req.body.y5, y6: req.body.y6}
			}

			let data = Object.assign({}, appData, {prefill: prefill})
			data.user = isUserLoggedIn(req)
			res.render("newactivity", data)
		}
		else
		{
			// Sanitise inputs
			req.body.title = req.sanitize(req.body.title)
			req.body.tags = req.sanitize(req.body.tags)
			req.body.description = req.sanitize(req.body.description)

			let query = `insert into activity (title, creator, description, year1, year2, year3, year4, year5, year6)
						 values (?, ?, ?, ?, ?, ?, ?, ?, ?)`
			let args = [req.body.title, req.session.user, req.body.description, req.body.y1, req.body.y2, req.body.y3, req.body.y4, req.body.y5, req.body.y6]
			// Insert into activity
			db.query(query, args, (err, result1) =>
			{
				if (err)
				{
					console.error(err)
					// TODO - better redirection for error in activity insert
					res.redirect("../newactivity")
				}
				else
				{
					// Store the id of the newly inserted record for the join table
					const actId = result1.insertId
					// TODO - will need stored procedure for inserting resources

					// Insert each file into the resource table
					console.debug(`REQ.FILES = ${req.files}`)
					for (let file of req.files)
					{
						// Delcared inside the loop because it will be re-declared in a further callback
						query = `insert into resource (filetype, filename, filepath)
							 values (?, ?, ?)`
						args = [file.mimetype, file.filename, file.path]
						db.query(query, args, (err, result2) =>
						{
							if (err)
							{
								console.error(err)
								// TODO - better redirection for error in resource insert
								res.redirect("../newactivity")
							} else
							{
								// Store the id of the newly inserted record for the join table
								const resId = result2.insertId

								query = `insert into activity_resource (activity_id, resource_id)
									 values (?, ?)`
								args = [actId, resId]
								db.query(query, args, err =>
								{
									if (err)
									{
										console.error(err)
										// TODO - better redirection for error in act_res insert
										res.redirect("../newactivity")
									}
									// Nothing needs to be done if no error
								})
							}
						})
					}
					// Redirect to the activity page on successful upload
					res.redirect(`../activity/${actId}`)
				}
			})
		}
	})

	// Activity page
	app.get("/activity/:id", (req, res) =>
	{
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("activity", data)
	})

	// Activity edit form GET
	app.get("/activity/:id/edit", redirectIfNotLoggedIn, (req, res) =>
	{let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("activity-edit", data)
	})

	// Activity edit form PUT
	app.put("/activity/:id/edit", redirectIfNotLoggedIn, activityValidation, (req, res) =>
	{
	})

	// Lesson generator form GET
	app.get("/generator", redirectIfNotLoggedIn, (req, res) =>
	{
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("generator", data)
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
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("lesson", data)
	})

	// Lesson edit form GET
	app.get("/lesson/:id/edit", redirectIfNotLoggedIn, (req, res) =>
	{
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("lesson-edit", data)
	})

	// Lesson edit form PUT
	app.put("/lesson/:id/edit", lessonValidation, redirectIfNotLoggedIn, (req, res) =>
	{

	})

	// User activities page
	app.get("/myactivities", redirectIfNotLoggedIn, (req, res) =>
	{
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("user-activities", data)
	})

	// User favourite activities page
	app.get("/favourites", redirectIfNotLoggedIn, (req, res) =>
	{
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("user-favourites", data)
	})

	// User lessons page
	app.get("/mylessons", redirectIfNotLoggedIn, (req, res) =>
	{
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("user-lessons", data)
	})

	// Login form GET
	app.get("/login", redirectIfLoggedIn, (req, res) =>
	{
		let data = Object.assign({}, appData)
		data.userLoggedIn = isUserLoggedIn(req)
		if (req.query.url)
		{
			data.url = req.query.url
		}
		res.render("login", data)
	})

	// Login form POST
	const loginValidation = [
		body("username").notEmpty(), body("password").notEmpty()
	]
	app.post("/login", redirectIfLoggedIn, loginValidation, (req, res) =>
	{
		const errors = validationResult(req)

		if (! errors.isEmpty())
		{
			let prefill = {
				username: req.sanitize(req.body.username)
			}

			let data = Object.assign({}, {prefill: prefill, msg: "Enter a username and password"})
			data.userLoggedIn = isUserLoggedIn(req)
			res.render("login", data)
		}
		else
		{
			// Import bcrypt to compare passwords
			const bcrypt = require("bcrypt")

			// Sanitise input
			req.body.username = req.sanitize(req.body.username)
			let prefill = {username: req.body.username}

			// Get the existing password hash to compare with form input
			let query = `select passwordHash from user where username = ?`
			db.query(query, req.body.username, (err, result) =>
			{
				if (err || result.length <= 0)
				{
					let data = Object.assign({}, appData, {prefill: prefill, msg: "User not found"})
					res.render("login", data)
				}
				else
				{
					const storedHash = result[0].passwordHash
					bcrypt.compare(req.body.password, storedHash, (err, result) =>
					{
						if (err || ! result)
						{
							let data = Object.assign({}, appData, {prefill: prefill, msg: "Incorrect password"})
							data.userLoggedIn = isUserLoggedIn(req)
							res.render("login", data)
						}
						else
						{
							req.session.user = req.body.username
							// If the user was redirected to login from somewhere else, send them back there
							if (req.body.url)
							{
								res.redirect(`..${req.body.url}`)
							}
							else
							{
								// TODO - temp redirect to index on successful login
								res.redirect("../")
							}
						}
					})
				}
			})
		}
	})

	// Signup form GET
	app.get("/signup", redirectIfLoggedIn, (req, res) =>
	{
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("signup", data)
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

	app.get("/logout", redirectIfNotLoggedIn, (req, res) =>
	{
		delete req.session.user
		res.redirect("../")
	})

	// User details form GET
	app.get("/mydetails", redirectIfNotLoggedIn, (req, res) =>
	{
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("user-details", data)
	})

	// User details form PUT
	app.put("/mydetails", redirectIfNotLoggedIn, userDetailsValidation, (req, res) =>
	{
	})

	// Search form GET
	app.get("/search", (req, res) =>
	{
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("search", data)
	})

	// Search form POST
	app.post("/search", (req, res) =>
	{
	})

	app.delete("/delete", (req, res) =>
	{
		res.send("User deletion")
	})

	// Catch-all route, used for 404 errors
	app.get("*", (req, res) =>
	{
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("error", data)
	})
}