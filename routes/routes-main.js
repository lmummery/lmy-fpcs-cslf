// TODO app cant use database ,only SPs
/*
Route handler for CS Lesson Factory web app
 */

const {body} = require("express-validator");
module.exports = (app, appData, upload) =>
{
	const {body, validationResult} = require("express-validator")
	const Zip = require("adm-zip")
	const fs = require("fs")

	/*
	== UTILITY FUNCTIONS ==
	 */

	/**
	 * Redirect to the user's details page if they are currently logged in
	 * @param req {Object} The HTTP request object
	 * @param res {Object} The HTTP response object
	 * @param next {Object} A callback function to be called after this function's completion
	 */
	function redirectIfLoggedIn (req, res, next)
	{
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

	/*
	== ROUTES ==
	 */

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
		const errors = validationResult(req)

		if (! errors.isEmpty())
		{
			let prefill = {
				title: req.sanitize(req.body.title),
				year: req.body.yg,
				duration: req.body.duration
			}

			let data = Object.assign({}, appData, {prefill: prefill, user: isUserLoggedIn(req)})
			res.render("newlesson", data)
		}
		else
		{
			req.body.title = req.sanitize(req.body.title)

			let query = `insert into lesson (title, date_created, creator, duration, yeargroup)
						 values (?, current_date(), ?, ? ,?)`
			let args = [req.body.title, req.session.user, req.body.duration, req.body.yg]

			db.query(query, args, (err, result) =>
			{
				if (err)
				{
					let prefill = {
						title: req.sanitize(req.body.title),
						year: req.body.yg,
						duration: req.body.duration
					}

					let data = Object.assign({}, appData, {prefill: prefill, user: isUserLoggedIn(req)})
					res.render("newlesson", data)
				}
				else
				{
					console.debug(result.insertId)
					res.redirect(`../lesson/${result.insertId}`)
				}
			})
		}
	})

	// New activity form GET
	app.get("/newactivity", redirectIfNotLoggedIn, (req, res) =>
	{
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("newactivity", data)
	})

	// New activity form POST
	const activityValidation = [
		body("title").notEmpty()
		// body("description").notEmpty()
	]
	app.post("/newactivity", upload.array("files"), redirectIfNotLoggedIn, activityValidation, (req, res) =>
	{
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
			console.debug(errors.array())

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

			let query = `insert into activity (title, creator, date_created, description, tags, year1, year2, year3, year4, year5, year6, duration)
						 values (?, ?, current_date(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`
			let args = [req.body.title, req.session.user, req.body.description, req.body.tags, req.body.y1, req.body.y2, req.body.y3, req.body.y4, req.body.y5, req.body.y6, req.body.duration]
			// Insert into activity
			db.query(query, args, (err, result1) =>
			{
				if (err)
				{
					console.log(err)
					console.log("Redirecting from activity insert")
					// TODO - better redirection for error in activity insert
					res.redirect("../newactivity")
				}
				else
				{
					// Store the id of the newly inserted record for the join table
					const actId = result1.insertId
					// TODO - will need stored procedure for inserting resources

					// Insert each file into the resource table
					if (req.files)
					{
						for (let file of req.files)
						{
							// Delcared inside the loop because it will be re-declared in a further callback
							query = `insert into resource (filetype, filename, filepath, filesize, originalname, extension)
								 values (?, ?, ?, ?, ?, ?)`
							args = [file.mimetype, file.filename, file.path, file.size, file.originalname, require("./util").getFileExt(file.mimetype)]
							db.query(query, args, (err, result2) =>
							{
								if (err)
								{
									console.log(err)
									console.log("Redirecting from resource insert")
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
											console.log(err)
											console.log("Redirecting from act_res insert")
											// TODO - better redirection for error in act_res insert
											res.redirect("../newactivity")
										}
										// Nothing needs to be done if no error
									})
								}
							})
						}
					}

					// Create a zip file of all files
					let zip = new Zip()
					for (const file of req.files)
					{
						zip.addLocalFile(file.path)
					}
					// Suffix will be a 10 digit string in base 64
					let suffix = ""
					const base64 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"
					for (let i = 0; i < 10; i ++)
					{
						suffix += base64.charAt(Math.floor(Math.random() * 64))
					}
					const filename = `${req.body.title.replaceAll(" ", "+")}_${suffix}.zip`
					const outPath = `genFiles/${filename}`
					zip.writeZip(filename, () =>
					{
						fs.rename(filename, `genFiles/${outPath}`, err =>
						{
							if (err)
							{
								throw err
							}

							// Update the activity record to point to the zip file
							query = `update activity
							         set actzip = ?
							         where id = ?`
							args = [outPath, actId]
							db.query(query, args, err =>
							{
								if (err)
								{
									throw err
								}
							})
						})
					})

					// Redirect to the activity page on successful upload
					res.redirect(`../activity/${actId}`)
				}
			})
		}
	})

	// Activity page
	app.get("/activity/:id", (req, res) =>
	{
		let query = `select *
					 from activity
					 where id = ?
					 limit 1`
		db.query(query, req.params.id, (err, result) =>
		{
			if (err || result.length <= 0)
			{
				console.error(err)
				// TODO - temp redirect to search on activity retrieval error
				res.redirect("../search")
			}
			else
			{
				// Get all the resource files associated with the activity
				query = `select *
						 from resource r
                         join activity_resource ar
                         on r.id = ar.resource_id
                         join activity a
                         on ar.activity_id = a.id
                         where a.id = ?`

				db.query(query, req.params.id, (err, results) =>
				{
					if (err)
					{
						console.error(err)
						// TODO - temp redirect to search for error in act_res -> resource get
						res.redirect("../search")
					}
					else
					{
						// Check if this activity is a favourite of the user if they are logged in
						if (req.session.user)
						{
							query = `select count(*) as count
									 from starred_activity sa
									 join user u
									 on sa.user_id = u.id
									 where sa.activity_id = ?
									 and u.username = ?`
							db.query(query, [req.params.id, req.session.user], (err, favdata) =>
							{
								query = `select * from lesson where creator = ?`

								db.query(query, [req.session.user], (err, userlessons) =>
								{
									let data = Object.assign({}, appData, {
										activity: result[0],
										resources: results,
										favourite: favdata[0].count === 1,
										username: req.session.user,
										userlessons: userlessons
									}, {user: isUserLoggedIn(req)})
									res.render("activity", data)
								})
							})
						}
						else
						{
							let data = Object.assign({}, appData, {
								activity: result[0],
								resources: results
							}, {user: isUserLoggedIn(req)})
							res.render("activity", data)
						}
					}
				})
			}
		})
	})

	// Route for adding favourite activity
	app.get("/add-favourite", (req, res) =>
	{
		// Authorisation - not using base function because of different behaviour
		if (! isUserLoggedIn(req))
		{
			res.redirect(`../activity/${req.query.id}`)
		}
		else // Authorisation passed
		{
			let query = `insert into starred_activity (user_id, activity_id)
						 values ((select id from user where username = ?), ?)`
			db.query(query, [req.session.user, req.query.id], (err, result) =>
			{
				res.redirect(`../activity/${req.query.id}`)
			})
		}
	})

	// Route for removing favourite activity
	app.get("/remove-favourite", (req, res) =>
	{
		// Authorisation - not using base function because of different behaviour
		// isUserLoggedIn() can only possibly be false from the activity page
		// -- if coming form favourites page, the user must already have been signed in
		if (! isUserLoggedIn(req))
		{
			res.redirect(`../activity/${req.query.id}`)
		}
		else
		{
			let query = `delete from starred_activity
						 where user_id = (select id from user where username = ?)
						 and activity_id = ?`
			db.query(query, [req.session.user, req.query.id], (err, result) =>
			{
				if (req.query.from === "act")
				{
					res.redirect(`../activity/${req.query.id}`)
				}
				else
				{
					res.redirect(`../favourites`)
				}
			})
		}
	})

	// Activity edit form GET
	app.get("/activityedit/:id", redirectIfNotLoggedIn, (req, res) =>
	{
		// Select data to prefill page
		let query = `select *
					 from activity
					 where id = ?
					 limit 1`
		db.query(query, req.params.id, (err, result) =>
		{
			if (err)
			{
				res.redirect(`../activity/${req.params.id}`)
			}
			else
			{
				const activity = result[0]
				// Only the activity's creator can access the edit page; redirect away if the user is not the creator
				if (req.session.user !== activity.creator)
				{
					console.error(err)
					res.redirect(`../activity/${req.params.id}`)
				}
				else
				{
					// Get the activity's resources
					query = `select *
							 from resource r
							 join activity_resource ar
							 on ar.resource_id = r.id
							 join activity a
							 on ar.activity_id = a.id
							 where activity_id = ?`
					db.query(query, req.params.id, (err, results) =>
					{
						if (err)
						{
							console.error(err)
							res.redirect(`../activity/${req.params.id}`)
						}
						else
						{
							results.forEach(r => r.fileTypeStr = require("./util").getFileStr(r.filetype))

							let data = Object.assign({}, appData, {activity: activity, resources: results}, {user: isUserLoggedIn(req)})
							res.render("activity-edit", data)
						}
					})
				}
			}
		})
	})

	// Activity edit form POST
	app.post("/activityedit/:id", upload.array("files"), redirectIfNotLoggedIn, activityValidation, (req, res) =>
	{
		const errors = validationResult(req)

		if (! errors.isEmpty())
		{
			let activity = {
				id: req.body.id,
				title: req.sanitize(req.body.title),
				year1: req.body.y1 === "on",
				year2: req.body.y2 === "on",
				year3: req.body.y3 === "on",
				year4: req.body.y4 === "on",
				year5: req.body.y5 === "on",
				year6: req.body.y6 === "on",
				tags: req.sanitize(req.body.tags),
				description: req.sanitize(req.body.description),
				duration: req.body.duration
			}

			let resources = req.files

			let data = Object.assign({}, appData, {activity: activity, resources: resources})
			data.user = isUserLoggedIn(req)
			res.render("activity-edit", data)
		}
		else
		{
			// Don't actually edit anything for now, just print the req body and redirect to the activity page
			console.log(req.body)
			console.log(req.files)
			res.redirect(`../activity/${req.params.id}`)
		}
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
	app.post("/generator", redirectIfNotLoggedIn, generatorValidation, (req, res) =>
	{
		const errors = validationResult(req)
		if (! errors.isEmpty())
		{
			let prefill = {
				year: req.body.year,
				tags: req.sanitize(req.body.tags),
				duration: req.body.duration
			}
			let data = Object.assign({}, appData, {prefill: prefill, user: isUserLoggedIn(req)})

			res.render("generator", data)
			return
		}

		req.body.tags = req.sanitize(req.body.tags)

		let tagsArr = req.body.tags.split(", ")
		let query = `select * from activity
					 where year${req.body.year} = true
					 and duration <= ?
					 and tags like '%${tagsArr[0]}%'`
		for (let i = 1; i < tagsArr.length; i ++)
		{
			query += `or tags like '%${tagsArr[i]}%' `
		}

		db.query(query, req.body.duration, (err, results) =>
		{
			if (err)
			{
				console.error(err)
				res.render("generator", Object.assign({}, appData, {user: isUserLoggedIn(req)}))
				return
			}

			// Start with an empty lesson
			let lesson = {
				duration: 0,
				yeargroup: req.body.year,
				title: `Year ${req.body.year} ${tagsArr[Math.floor(Math.random() * tagsArr.length)].toLowerCase()}`,
				activities: []
			}

			let tempAct, possibleActivities
			while (lesson.duration < req.body.duration&& lesson.activities.length < results.length)
			{
				possibleActivities = results.filter(a => ! lesson.activities.includes(a) && a.duration <= req.body.duration - lesson.duration)

				if (possibleActivities.length === 0)
				{
					break
				}

				// Select a random activity
				tempAct = possibleActivities[Math.floor(Math.random() * possibleActivities.length)]

				lesson.activities.push(tempAct)
				lesson.duration += tempAct.duration
			}

			// res.send(lesson)
			let data = Object.assign({}, appData, {lesson: lesson, username: req.session.user, user: isUserLoggedIn(req)})
			res.render("generated-lesson", data)
		})

		// res.render("generator", Object.assign({}, appData, {user: isUserLoggedIn(req)}))
	})

	// API route to save generated lesson
	app.get("/api/savelesson", (req, res) =>
	{
		let data = {
			title: req.sanitize(req.query.title),
			yg: parseInt(req.query.yg),
			duration: parseInt(req.query.duration),
			creator: req.sanitize(req.query.creator),
			activities: JSON.parse(req.query.acts)
		}

		let query = `insert into lesson (title, date_created, creator, duration, yeargroup)
					 values (?, curdate(), ?, ?, ?)`
		let querydata = [data.title, data.creator, data.duration, data.yg]
		db.query(query, querydata, (err, result) =>
		{
			if (err)
			{
				res.sendStatus(500)
				return
			}

			const lessonId = result.insertId

			// TODO - this would be safer with a transaction
			for (let i = 0; i < data.activities.length; i ++)
			{
				let actId = data.activities[i]

				query = `insert into lesson_activity (lesson_id, activity_id, num_in_lesson)
						 values (?, ?, ?)`
				querydata = [lessonId, actId, i + 1]
				db.query(query, querydata, err =>
				{
					if (err)
					{
						res.sendStatus(500)
						return
					}
				})
			}

			res.status(200).send(`${lessonId}`)
		})
	})

	app.get("/api/addtolesson", (req, res) =>
	{
		// TODO - this should be a stored procedure
		// Get number of existing activities in the lesson to not duplicate num_in_lesson
		let query = `select count(*) as count from lesson where id = ?`
		db.query(query, [req.query.les], (err, result) =>
		{
			if (err)
			{
				res.send(500)
				return
			}

			const next = result[0].count + 1

			// Check that the activity isn't already in the lesson
			query = `select count(*) as count
					 from lesson_activity
					 where lesson_id = ?
					 and activity_id = ?`
			let querydata = [req.query.les, req.query.act]

			db.query(query, querydata, (err, result) =>
			{
				if (err)
				{
					res.send(500) // 500 Internal server error
					return
				}

				if (result[0].count !== 0)
				{
					res.send(412) // 412 Failed preconditions
					return
				}

				query = `insert into lesson_activity
                         (lesson_id, activity_id, num_in_lesson)
                         values (?, ?, ?)`
				querydata = [req.query.les, req.query.act, next]
				db.query(query, querydata, (err, result) =>
				{
					if (err)
					{
						res.send(500) // 500 Internal server error
						return
					}

					res.send(200) // 200 OK
				})

			})
		})
	})

	// Lesson page
	app.get("/lesson/:id", (req, res) =>
	{
		let query = `select * from lesson where id = ? limit 1`
		db.query(query, req.params.id, (err, result) =>
		{
			if (err)
			{
				// TODO temp redirect to index on err in get lesson
				res.redirect("../")
			}
			else
			{
				const lesson = result[0]

				query = `select a.* from activity a
						 join lesson_activity la on a.id = la.activity_id
						 join lesson l on la.lesson_id = l.id
						 where l.id = ?`
				db.query(query, req.params.id, (err, results) =>
				{
					if (err)
					{
						// TODO temp redirect to index on err in get activities from lesson
						res.redirect("../")
					}
					else
					{
						const activities = results

						let data = Object.assign({}, appData, {lesson: lesson, activities: activities}, {user: isUserLoggedIn(req)})
						res.render("lesson", data)}
				})
			}
		})
	})

	// Lesson edit form GET
	app.get("/lessonedit/:id", redirectIfNotLoggedIn, (req, res) =>
	{
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("lesson-edit", data)
	})

	// Lesson edit form POST
	app.post("/lessonedit/:id", lessonValidation, redirectIfNotLoggedIn, (req, res) =>
	{

	})

	// User activities page
	app.get("/myactivities", redirectIfNotLoggedIn, (req, res) =>
	{
		let query = `select *
					 from activity
					 where creator = ?`

		db.query(query, req.session.user, (err, activities) =>
		{
			if (err)
			{
				console.error(err)
				res.redirect("../") // TODO - possible better redirect for db error
			}

			query = `select a.id as id, count(*) as rescount
					 from activity a
					 join activity_resource ar
					 on a.id = ar.activity_id
					 where a.creator = ?
					 group by a.id`
			db.query(query, req.session.user, (err, resCounts) =>
			{
				let data = Object.assign({}, appData, {activities: activities, resCounts: resCounts, user: isUserLoggedIn(req)})
				res.render("user-activities", data)
			})
		})
	})

	// User favourite activities page
	app.get("/favourites", redirectIfNotLoggedIn, (req, res) =>
	{
		// TODO - this would be better as a view
		let query = `select a.*
					 from activity a
					 join starred_activity sa
					 on a.id = sa.activity_id
					 join user u
					 on sa.user_id = u.id
					 where u.username = ?`
		db.query(query, req.session.user, (err, faves) =>
		{
			if (err)
			{
				console.error(err)
				res.redirect("../")
			}

			query = `select a.id as id, count(*) as rescount
					 from activity a
					 join activity_resource ar on a.id = ar.activity_id
					 join starred_activity sa on a.id = sa.activity_id
					 join user u on sa.user_id = u.id
					 where u.username = ?
					 group by a.id`
			db.query(query, req.session.user, (err, resCounts) =>
			{
				let data = Object.assign({}, appData, {activities: faves, resCounts: resCounts, username: req.session.user, user: isUserLoggedIn(req)})
				res.render("user-favourites", data)
			})
		})
	})

	// User lessons page
	app.get("/mylessons", redirectIfNotLoggedIn, (req, res) =>
	{
		let query = `select *
					 from lesson
					 where creator = ?`
		db.query(query, req.session.user, (err, lessons) =>
		{
			if (err)
			{
				console.error(err)
				res.redirect("../") // TODO - possible better redirect for db error
			}

			query = `select l.id as id, count(*) as actcount
					 from lesson l
					 join lesson_activity la
					 on l.id = la.lesson_id
					 where l.creator = ?
					 group by l.id`
			db.query(query, req.session.user, (err, actCounts) =>
			{
				let data = Object.assign({}, appData, {lessons: lessons, actCounts: actCounts, user: isUserLoggedIn(req)})
				res.render("user-lessons", data)
			})
		})
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

	app.get("/logout", (req, res) =>
	{
		delete req.session.user
		res.redirect("../")
	})

	// User details form GET
	app.get("/mydetails", redirectIfNotLoggedIn, (req, res) =>
	{
		let query = `select id, username, title, first_name, surname
					 from user
					 where username = ?
					 limit 1`
		// req.session.user must exist - authorisation must be passed to get here
		db.query(query, req.session.user, (err, results) =>
		{
			if (err) throw err

			let prefill = {
				id: results[0].id,
				username: results[0].username,
				title: results[0].title,
				firstname: results[0].first_name,
				surname: results[0].surname
			}

			let data = Object.assign({}, appData, {user: isUserLoggedIn(req), prefill: prefill})
			res.render("user-details", data)
		})
	})

	// User details form PUT
	// PUT implemented as POST because of HTML form constraints
	const userDetailsUpdateValidation = [
		body("firstname").notEmpty(),
		body("surname").notEmpty()
	] // Reduced validation because of reduced form scope
	app.post("/mydetails", redirectIfNotLoggedIn, userDetailsUpdateValidation, (req, res) =>
	{
		const errors = validationResult(req)
		if (! errors.isEmpty())
		{
			console.debug(errors.array())
			res.redirect("../mydetails")
		}
		else
		{
			// Sanitise input data
			req.body.title = req.sanitize(req.body.title)
			req.body.firstname = req.sanitize(req.body.firstname)
			req.body.surname = req.sanitize(req.body.surname)

			let query = `update user
					 set title = ?,
					     first_name = ?, surname = ?
					 where id = ?`

			db.query(query, [req.body.title, req.body.firstname, req.body.surname, req.body.id], err =>
			{
				if (err)
				{
					console.error(err)
					res.redirect("../") // TODO - better redirect
				}
				// Just redirect to /mydetails on success - this will get the updated details anyway
				res.redirect("../mydetails")
			})
		}
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
		let query = `select *
					 from (
					     select 1 as rnk, a.*
					     from activity a
					     where title like '%${req.sanitize(req.body.query)}%'
					     union
					     select 2 as rnk, a.*
					     from activity a
					     where description like '%${req.sanitize(req.body.query)}%'
                         and not title like '%${req.sanitize(req.body.query)}%'
					      ) search_table
					 order by rnk`
		// not title like to remove duplicate results - they are already covered by the title check
		db.query(query, (err, results) =>
		{
			if (err)
			{
				console.error(err)
				res.redirect("../search")
				return
			}

			if (isUserLoggedIn(req))
			{
				// Get the favourite status of every activity that matches the search criteria
				query = `select sa.activity_id as id
						 from starred_activity sa
						 join user u
						 on sa.user_id = u.id
						 where u.username = ?
						 and sa.activity_id in
							 (select id
							  from activity
							  where title like '%${req.sanitize(req.body.query)}%'
							  or description like '%${req.sanitize(req.body.query)}%')`
				db.query(query, req.session.user, (err, favdata) =>
				{
					if (err)
					{
						console.error(err)
						res.redirect("../search")
						return
					}

					let data = Object.assign({}, appData, {favdata: favdata, username: req.session.user, query: req.sanitize(req.body.query), activities: results, user: isUserLoggedIn(req)})
					res.render("search-results", data)
				})
			}
			else
			{
				let data = Object.assign({}, appData, {query: req.sanitize(req.body.query), activities: results, user: isUserLoggedIn(req)})
				res.render("search-results", data)
			}
		})
	})

	// Internal API route to register starred activity
	app.get("/api/add-fav", (req, res) =>
	{
		if (! (req.query.username && req.query.actid))
		{
			res.sendStatus(403)
			return
		}

		let query = `insert into starred_activity (user_id, activity_id)
					 values ((select id from user where username = ?), ?)`
		db.query(query, [req.query.username, req.query.actid], (err, result) =>
		{
			if (err)
			{
				res.sendStatus(500)
				return
			}

			res.sendStatus(200)
		})
	})

	// Internal API route to remove starred activity
	app.get("/api/remove-fav", (req, res) =>
	{
		if (! (req.query.username && req.query.actid))
		{
			res.sendStatus(403)
			return
		}

		let query = `delete from starred_activity
					 where user_id = (select id from user where username = ?)
					 and activity_id = ?`
		db.query(query, [req.query.username, req.query.actid], (err, result) =>
		{
			if (err)
			{
				res.sendStatus(500)
				return
			}

			res.sendStatus(200)
		})
	})

	app.post("/delete", (req, res) =>
	{
		res.send("User deletion")
	})

	// Include the routes for .docx generation and .zip generation
	require("./create-lesson-zip")(app, appData)
	require("./create-lesson-docx")(app, appData)

	// Catch-all route, used for 404 errors
	app.get("*", (req, res) =>
	{
		let data = Object.assign({}, appData, {user: isUserLoggedIn(req)})
		res.render("error", data)
	})
}