/*
CS Lesson Factory
 */

// Import node.js modules
const express = require("express")
const pug = require("pug")
const bp = require("body-parser")
const mysql = require("mysql")
const session = require("express-session")
const validator = require("express-validator")
const sanitizer = require("express-sanitizer")
const docx = require("docx")
const bcrypt = require("bcrypt")
const zip = require("adm-zip")

// multer will be used for processing files uploaded in forms
const multer = require("multer")
// Uploaded files will be stored in ~/uploads/uploads
// Adapted from http://expressjs.com/en/resources/middleware/multer.html
const storage = multer.diskStorage({
	destination: "uploads/uploads/", // Where to store the files
	filename: (req, file, cb) =>
	{
		let suffix = "_"
		// Suffix will be 10 digits in base 32
		for (let i = 0; i < 10; i ++)
		{
			suffix += "0123456789ABCDEFGHIJKLMNOPQRSTUV".charAt(Math.floor(Math.random() * 32))
		}
		suffix += "."
		const fileNameSplit = file.originalname.split(".")
		const fileNameWithoutExt = fileNameSplit.slice(0, fileNameSplit.length - 1).join(".")
		cb(null, fileNameWithoutExt + suffix + fileNameSplit[fileNameSplit.length - 1])
	}
})
const upload = multer({storage: storage})

// Define the port for the web app to run through
const port = 8000

// Create the Express application object
const app = express()
app.use(bp.urlencoded({extended: true}))

// Define the database connection
// !! This database has not yet been created !!
const db = mysql.createConnection(
	{
		host: "localhost",
		user: "cslf-server",
		port: "3306",
		password: "IS53007E!202223",
		database: "fpcs_cslf"
	}
)

// Connect to the database
db.connect(err =>
{
	if (err) throw err
	console.log("Connected to database")
})
global.db = db

// Set directory where static files (css, js, etc.) will be found
app.use(express.static("public"))

// Serve uploads and genFiles as static files as well
// This will allow them to be downloaded by a client browser
app.use(express.static("genFiles"))
app.use(express.static("uploads"))

// Add CORS headers
app.use((req, res, next) =>
{
	res.header("Access-Control-Allow-Origin", "*")
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	)
	next()
})

// Set the directory where Express will get web page templates
// __dirname gets the current directory
app.set("views", `${__dirname}/views`)

// Tell Express to use Pug as the templating engine and use Pug's rendering engine
app.set("view engine", "pug")
app.engine("html", pug.renderFile)

// Define base data
let appData = {
	appName: "CS Lesson Factory",
	port: port // Will be passed into pug templates to run AJAX requests
}

// Enable sessions for storing user data
app.use(session(
	{
		secret: "IS53007E-FPiCS-LMY",
		resave: false,
		saveUninitialized: false,
		cookie: {expires: 600_000}
	}
))

// Create an input sanitizer to prevent text injection attacks
app.use(sanitizer())

// Require routes-main.js from routes to handle Express routing, passing the Express app object and base data
require("./routes/routes-main")(app, appData, upload)

// Start the web app listening on the set port
app.listen(port, () => console.log(`CS Lesson Factory listening on port ${port}`))