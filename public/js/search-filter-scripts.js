// radios will always contain the same seven elements
const radios = [
	document.getElementById("allyg"), document.getElementById("y1"),
	document.getElementById("y2"), document.getElementById("y3"),
	document.getElementById("y4"), document.getElementById("y5"),
	document.getElementById("y6")
]
for (let radio of radios)
{
	radio.addEventListener("click", ygFilter)
}

function ygFilter ()
{
	const elements = document.getElementById("results-table").children[0].children
	if (this.value === "0")
	{
		// Unhide all results when the user selects "All Years"
		for (let el of elements)
		{
			el.hidden = false
		}
	}
	else
	{
		let yrstring
		for (let el of elements)
		{
			yrstring = el.children[0].children[0].children[0].children[3].children[0].innerText
			// If the list of year groups for an activity includes the selected year, it will not be hidden
			el.hidden = ! yrstring.includes(this.value);
		}
	}

	const allHidden = Array.from(elements).filter(el => ! el.hidden).length === 0
	// If all the results are hidden, unhide the message showing that no results match
	document.getElementById("none-found-msg").hidden = ! allHidden;
}