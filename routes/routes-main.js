/*
Route handler for CS Lesson Factory web app
 */

module.exports = (app, appData) =>
{
	app.get("/", (req, res) =>
	{
		res.render("index", appData)
	})

	app.get("/newactivity", (req, res) =>
	{
		res.render("newactivity", appData)
	})

	app.post("/newactivity", (req, res) =>
	{
	})

	app.get("/generator", (req, res) =>
	{
		res.render("generator", appData)
	})

	app.post("/generate", (req, res) =>
	{
	})

	app.get("/lesson/:id", (req, res) =>
	{
		res.render("lesson", appData)
	})

	app.get("/mydetails", (req, res) =>
	{
		res.render("user-details", appData)
	})

	app.post("/mydetails", (req, res) =>
	{
	})

	app.get("/myactivities", (req, res) =>
	{
		res.render("user-activities", appData)
	})

	app.get("/activity/:id", (req, res) =>
	{
		res.render("activity", appData)
	})

	app.get("/activity/:id/edit", (req, res) =>
	{
		res.render("activity-edit", appData)
	})

	app.put("/activity/:id/edit", (req, res) =>
	{
	})

	app.get("/favourites", (req, res) =>
	{
		res.render("user-favourites", appData)
	})

	app.get("/lesson/:id/edit", (req, res) =>
	{
		res.render("lesson-edit", appData)
	})

	app.put("/lesson/:id/edit", (req, res) =>
	{
	})

	app.get("/mylessons", (req, res) =>
	{
		res.render("user-lessons", appData)
	})

	app.get("/signup", (req, res) =>
	{
		res.render("signup", appData)
	})

	app.post("/signup", (req, res) =>
	{
	})

	app.get("/login", (req, res) =>
	{
		res.render("login", appData)
	})

	app.post("/login", (req, res) =>
	{
	})

	app.get("/search", (req, res) =>
	{
	})

	app.post("/search", (req, res) =>
	{
	})
}