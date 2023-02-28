function removeFavourite (activityId)
{
	const username = document.getElementById("username-label").innerText

	console.log("Clicked to remove!")
	// console.log(document.getElementsByClassName("is-favourite")[0].children[0].children[0])
	// console.log(document.getElementsByClassName("is-favourite")[0].children[0].children[1])

	// Trigger the route to remove a favourite without changing the web browser location
	let xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function ()
	{
		if (this.status === 200 && this.readyState === 4)
		{
			document.getElementsByClassName("is-favourite")[0].children[0].children[0].src = "../img/unstarred.png"
			document.getElementsByClassName("is-favourite")[0].children[0].children[1].innerText = "Add to Favourites"
			document.getElementsByClassName("is-favourite")[0].children[0].onclick = () => addFavourite(activityId)
		}
	}
	xhttp.open("GET", `http://localhost:8000/api/remove-fav?username=${username}&actid=${activityId}`)
	xhttp.send()
}

function addFavourite (activityId)
{
	const username = document.getElementById("username-label").innerText

	console.log("Clicked to add!")
	// Trigger the route to add a favourite without changing the web browser location
	let xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function ()
	{
		if (this.status === 200 && this.readyState === 4)
		{
			document.getElementsByClassName("is-favourite")[0].children[0].children[0].src = "../img/starred.png"
			document.getElementsByClassName("is-favourite")[0].children[0].children[1].innerText = "Favourite"
			document.getElementsByClassName("is-favourite")[0].children[0].onclick = () => removeFavourite(activityId)
		}
	}
	xhttp.open("GET", `http://localhost:8000/api/add-fav?username=${username}&actid=${activityId}`)
	xhttp.send()
}