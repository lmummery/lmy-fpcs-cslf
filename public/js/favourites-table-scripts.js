function removeFavourite (activityId)
{
	const username = document.getElementById("username-label").innerText

	// Trigger a database route call from here
	let xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function ()
	{
		if (this.status === 200 && this.readyState === 4)
		{
			const el = document.getElementById(`fav${activityId}`)
			el.children[0].children[0].children[1].children[0].children[0].src = "../img/unstarred.png"
			el.children[0].children[0].children[1].children[0].onclick = () => addFavourite(activityId)
		}
	}
	xhttp.open("GET", `http://localhost:8000/api/remove-fav?username=${username}&actid=${activityId}`)
	xhttp.send()
}

function addFavourite (activityId)
{
	const username = document.getElementById("username-label").innerText

	// Call the database route
	let xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function ()
	{
		if (this.status === 200 && this.readyState === 4)
		{
			const el = document.getElementById(`fav${activityId}`)
			el.children[0].children[0].children[1].children[0].children[0].src = "../img/starred.png"
			el.children[0].children[0].children[1].children[0].onclick = () => removeFavourite(activityId)
		}
	}
	xhttp.open("GET", `http://localhost:8000/api/add-fav?username=${username}&actid=${activityId}`)
	xhttp.send()
}