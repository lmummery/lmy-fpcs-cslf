/*
	Route handler for lesson file .docx generation and .pdf conversion __only__
 */

const {Tab, TableCell, Paragraph, TextRun, TableRow, Table, WidthType, Document, Packer} = require("docx");
const fs = require("fs");
module.exports = (app, appData) =>
{
	// Import docx module - only necessary features imported separately
	const docx = require("docx")
	const {
		Table, TableRow, TableCell, Paragraph, TextRun,
		AlignmentType, Packer, WidthType, Document
	} = require("docx")

	// fs will be used to write the file to local filespace
	const fs = require("fs")

	app.get("/lessondoc/:id", (req, res) =>
	{
		let query = `select *
                     from view_lesson_act
                     where lesson_id = ?
                     order by num_in_lesson asc`
		db.query(query, req.params.id, (err, activities) =>
		{
			if (err) throw err

			// Get resources from the database before building any document parts
			query = `select originalname, filename, act_id
					 from view_lesson_resources
					 where lesson_id = ?
					 order by num_in_lesson asc`

			db.query(query, activities[0].lesson_id, (err, resources) =>
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

				const fileName = activities[0].lesson_title.replaceAll(" ", "+")
				const fileOut = `genFiles/lessondocs/${fileName}_${genSuffix()}.docx`

				// Copy the document from variable space to storage
				Packer.toBuffer(doc).then(buffer =>
				{
					fs.writeFileSync(fileOut, buffer)
				}).then(() =>
				{
					// The response will just download the file
					res.download(fileOut, err =>
					{
						if (err)
						{
							console.error("Error in downloading file")
							throw err
						}
					})
				})
			})
		})
	})

	// Temporary suffix generator
	function genSuffix()
	{
		let suffix = ""
		const BASE64 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+_"
		for (let i = 0; i < 5; i++)
		{
			suffix += BASE64.charAt(Math.floor(Math.random() * 64))
		}
		return suffix
	}
}