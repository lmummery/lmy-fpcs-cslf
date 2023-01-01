/*
Route handler for CS Lesson Factory web app
 */

module.exports = (app, appData) =>
{
	app.get("/", (req, res) => {})

	app.get("/newactivity", (req, res) => {})

	app.post("/newactivity", (req, res) => {})

	app.get("/generator", (req, res) => {})

	app.post("/generate", (req, res) => {})

	app.get("/lesson/:id", (req, res) => {})

	app.get("/mydetails", (req, res) => {})

	app.post("/mydetails", (req, res) => {})

	app.get("/myactivities", (req, res) => {})

	app.get("/activity/:id", (req, res) => {})

	app.get("/activity/:id/edit", (req, res) => {})

	app.put("/activity/:id/edit", (req, res) => {})

	app.get("/favourites", (req, res) => {})

	app.get("/lesson/:id/edit", (req, res) => {})

	app.put("/lesson/:id/edit", (req, res) => {})

	app.get("/mylessons", (req, res) => {})

	app.get("/signup", (req, res) => {})

	app.post("/signup", (req, res) => {})

	app.get("/login", (req, res) => {})

	app.post("/login", (req, res) => {})

	app.get("/search", (req, res) => {})

	app.post("/search", (req, res) => {})
}