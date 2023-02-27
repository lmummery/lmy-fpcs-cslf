document.getElementById("filter-button").addEventListener("click", activityFilter)
document.getElementById("min-dur").addEventListener("keydown", e =>
{
	if (e.key === "Enter") activityFilter()
})
document.getElementById("max-dur").addEventListener("keydown", e =>
{
	if (e.key === "Enter") activityFilter()
})

document.getElementById("clear-filters").addEventListener("click", clearFilters)

function activityFilter ()
{
	// Start by getting time bounds
	let minVal = document.getElementById("min-dur").value
	let maxVal = document.getElementById("max-dur").value

	if (minVal !== "")
	{
		console.log(minVal)
		minVal = parseInt(minVal)
	} else
	{
		console.log("No min value")
		minVal = 0 // All activities must be longer than 0 minutes
	}

	if (maxVal !== "")
	{
		console.log(maxVal)
		maxVal = parseInt(maxVal)
	} else
	{
		console.log("No max value")
		maxVal = 99999 // Large number so no activity could possibly be longer
	}

	// Get radio elements for year group filter
	let radios = document.getElementsByName("yg")
	console.log(radios)
	let yrVal
	for (let radio of radios)
	{
		if (radio.checked)
		{
			console.log(`Selected value = ${radio.value}`)
			yrVal = radio.value // Only one radio button can ever be selected at a time
		}
	}

	// Get all result elements in the list, including any hidden ones
	const elements = document.getElementById("results-table").children[0].children
	let el = elements[0]
	console.log(el.children[0].children[0].children[0].children[1].children[1].innerText.split(" ")[0])

	for (let el of elements)
	{
		el.hidden = false
		// Get just the year group numbers for the current row
		let elYr = el.children[0].children[0].children[0].children[3].children[0].innerText
		// Get just the length in minutes for the current activity as a number
		let elDur = parseInt(el.children[0].children[0].children[0].children[1].children[1].innerText.split(" ")[0])

		if (yrVal !== "0" && !elYr.includes(yrVal))
		{
			el.hidden = true
		}
		if (elDur < minVal)
		{
			el.hidden = true
		}
		if (elDur > maxVal)
		{
			el.hidden = true
		}
	}

	// If all the results are hidden, unhide the message showing that no results match
	const allHidden = Array.from(elements).filter(el => !el.hidden).length === 0
	document.getElementById("none-found-msg").hidden = !allHidden;
}

function clearFilters ()
{
	document.getElementById("min-dur").value = ""
	document.getElementById("max-dur").value = ""
	document.getElementById("allyg").checked = true
	activityFilter()
}