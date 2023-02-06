/*
	Route handler for lesson file .zip generation __only__
 */

module.exports = (app, appData) =>
{
	const Zip = require("adm-zip")
	const fs = require("fs")

	app.get("/lessonzip/:id", (req, res) =>
	{
		let query = `select *
                     from view_lesson_resources
                     where lesson_id = ?`
		db.query(query, req.params.id, (err, results) =>
		{
			if (err)
			{
				// TODO - possibly better err-catch output
				res.send(null)
			} else
			{
				let zip = new Zip()
				for (const file of results)
				{
					console.debug(file)
					zip.addLocalFile(file.filepath)
				}

				// Suffix will be a 10 digit string in base 64
				let suffix = ""
				const base64 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"
				for (let i = 0; i < 10; i++)
				{
					suffix += base64.charAt(Math.floor(Math.random() * 64))
				}

				const filename = `${results[0].lesson_title.replaceAll(" ", "+")}_${suffix}.zip`
				const outPath = `genFiles/lessons/${filename}`
				zip.writeZip(filename, () =>
				{
					fs.rename(filename, outPath, err =>
					{
						if (err)
						{
							console.error("Error in renaming file")
							throw err
						}

						res.download(outPath, err =>
						{
							if (err)
							{
								console.error("Error in downloading file")
								throw err
							}
						})
					})
				})
			}
		})
	})
}