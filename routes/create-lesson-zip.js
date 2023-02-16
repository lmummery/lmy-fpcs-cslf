/*
	Route handler for lesson file .zip generation __only__
 */

const {Table, WidthType, TableRow, TableCell, Paragraph, TextRun} = require("docx");
module.exports = (app, appData) =>
{
	const Zip = require("adm-zip")
	const fs = require("fs")

	app.get("/lessonzip/:id", (req, res) =>
	{
		let query = `select *
                     from view_lesson_resources
                     where lesson_id = ?`
		db.query(query, req.params.id, async (err, results) =>
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
					zip.addLocalFile(file.filepath)
				}

				// Suffix for zip file will be a 10 digit string in base 64
				// Suffix for docx file will be a 5 digit string in base 64
				let zipSuffix = ""
				let docSuffix = ""
				const base64 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"
				for (let i = 0; i < 10; i++)
				{
					zipSuffix += base64.charAt(Math.floor(Math.random() * 64))
				}
				for (let i = 0; i < 5; i++)
				{
					docSuffix += base64.charAt(Math.floor(Math.random() * 64))
				}

				// TODO - Lesson document creation should go here!

				const filename = `${results[0].lesson_title.replaceAll(" ", "+")}_${zipSuffix}.zip`
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

	function createLessonDoc (lesson_id, docname, zip)
	{
		// Import necessary features from the docx module
		const {
			Table, TableRow, TableCell, Paragraph,
			TextRun, Packer, Widthtype, Document
		} = require("docx")

		// fs will be used to write the file to local filespace
		const fs = require("fs")

		let query = `select *
					 from view_lesson_act
					 where lesson_id = ?
					 order by num_in_lesson asc`
		db.query(query, lesson_id, (err, activities) =>
		{
			if (err) throw err

			// Get resources from the database before building any document parts
			query = `select originalname, filename, act_id
					 from view_lesson_resources
					 where lesson_id = ?
					 order by num_in_lesson asc`

			db.query(query, lesson_id, (err, resources) =>
			{
				if (err)
				{
					console.error("Error in retrieving resources")
					throw err
				}

				// Create the table before adding it to the plan document
				const table = new Table({
					width: {size: 100, type: WidthType.PERCENTAGE},
					rows: [
						new TableRow({
							children: [
								new TableCell({
									children: [new Paragraph({
										children: [
											new TextRun({text: "Lesson Title: ", bold: true}),
											new TextRun(activities[0].lesson_title)
										]
									})]
								}),
								new TableCell({
									children: [new Paragraph({
										children: [new TextRun({text: `Year ${activities[0].yeargroup}`})]
									})]
								}),
								new TableCell({
									children: [new Paragraph({
										children: [new TextRun({text: `${activities[0].lesson_duration} minutes`})]
									})]
								})]
						}),
						new TableRow({
							children: [
								new TableCell({
									children: [new Paragraph({
										children: [new TextRun({text: "Learning Objectives:", bold: true})]
									})],
									columnSpan: 3
								})
							]
						}),
						new TableRow({
							children: [
								new TableCell({
									children: [new Paragraph({
										children: [new TextRun("Tags")]
									})],
									columnSpan: 3
								})
							]
						}),
						new TableRow({
							children: [
								new TableCell({
									children: [new Paragraph({
										children: [new TextRun({text: "Lesson Activities", bold: true})]
									})],
									columnSpan: 3
								})
							]
						})
					],
				})

				table.root.push(new TableRow({
					children: [
						new TableCell({
							children: []
						}),
						new TableCell({
							children: [new Paragraph({children: [new TextRun({text: "Activity", bold: true})]})]
						}),
						new TableCell({
							children: [new Paragraph({children: [new TextRun({text: "Files/Resources", bold: true})]})]
						})
					]
				}))

				for (const act of activities)
				{
					table.root.push(new TableRow({
						children: [
							new TableCell({
								children: [
									new Paragraph(`${act.num_in_lesson}`)
								]
							}),
							new TableCell({
								children: [
									new Paragraph({children: [new TextRun({text: `${act.act_title}`, bold: true})]}),
									new Paragraph(act.description),
									new Paragraph(`${act.act_duration} minutes`)
								]
							}),
							new TableCell({
								// Empty cell for resource file names to be added to
								children: [new Paragraph({children: []})]
							})
						]
					}))

					let rowIndex = table.root.length - 1

					for (const resource of resources)
					{
						// Only include the resource here if it is actually part of the current activity
						if (resource.act_id === act.act_id)
						{
							// Add the file name of the resource to the cell
							table.root[rowIndex].options.children[2].options.children[0].root.push(
								new TextRun(`${resource.originalname}, `)
							)
						}
					}
				}

				// Create the actual document and push the table to it
				const doc = new Document({
					sections: [{
						children: [table]
					}]
				})

				const fileOut = `genFiles\\lessondocs\\${docname}.docx`

				// Copy the document from the variable space to storage
				Packer.toBuffer(doc).then(buffer =>
				{
					zip.addFile(`${docname}.docx`, buffer)
					fs.writeFile(fileOut, buffer, err =>
					{
						if (err) throw err
						zip.addLocalFile(`genFiles\\lessondocs\\${docname}.docx`)
					})
				}).then(() =>
				{
					console.log(`${docname}.docx saved successfully`)
					// Add the newly-saved document to the passed zip object
					// zip.addLocalFile(`genFiles\\lessondocs\\${docname}.docx`)
				})
			})
		})
		console.debug("FILE CREATION CALLED")
	}
}