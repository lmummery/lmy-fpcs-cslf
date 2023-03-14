function getLessonData ()
{
	if (document.getElementById("title-input-field").value !== "")
	{
		console.log(document.getElementById("title-input-field").value)
		console.log(document.getElementById("yg-label").innerText.split(" ")[1])
		console.log(document.getElementById("duration-label").innerText.split(" ")[0])
		let activityIds = []
		Array.from(document.getElementsByClassName("act-id")).forEach(el => activityIds.push(el.innerText))
		console.log(activityIds)
		console.log(document.getElementById("username-label").innerText)

		let xhttp = new XMLHttpRequest()
		xhttp.onreadystatechange = function ()
		{
			if (this.readyState === 4 && this.status === 200)
			{
				console.log("Saved!")
				console.log(this.response)
				window.location = `../lesson/${this.responseText}`
			}
		}
		let data = {
			title: document.getElementById("title-input-field").value,
			yg: parseInt(document.getElementById("yg-label").innerText.split(" ")[1]),
			duration: parseInt(document.getElementById("duration-label").innerText.split(" ")[0]),
			activities: activityIds,
			creator: document.getElementById("username-label").innerText
		}

		console.log(data)

		let url = `http://localhost:8000/api/savelesson?title=${data.title.replaceAll(" ", "+")}&yg=${data.yg}&duration=${data.duration}&creator=${data.creator}&acts=[${data.activities}]`
		console.log(url)
		xhttp.open("GET", url, false)
		xhttp.send()
	}
}

function moveUp (e)
{
	console.log("UP")
	const row = e.parentElement.parentElement.parentElement
	const table = document.getElementsByClassName("lesson-activity")
	const idx = Array.from(table).indexOf(row)

	if (idx !== 0)
	{
		swapElements(idx, idx - 1)
	}
}

function moveDown (e)
{
	console.log("DOWN")
	const row = e.parentElement.parentElement.parentElement
	const table = document.getElementsByClassName("lesson-activity")
	const idx = Array.from(table).indexOf(row)

	if (idx !== table.length - 1)
	{
		swapElements(idx, idx + 1)
	}
}

function swapElements (x, y)
{
	const elX = document.getElementsByClassName("lesson-activity")[x]
	const elY = document.getElementsByClassName("lesson-activity")[y]
	const innerX = elX.innerHTML
	const innerY = elY.innerHTML
	elX.innerHTML = innerY
	elY.innerHTML = innerX
}