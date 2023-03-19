function removeFavourite (activityId)
{
	const username = document.getElementById("username-label").innerText

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

function addToLesson (actId)
{
	const lessonId = document.getElementById("lesson-selector").value
	console.log(lessonId)

	if (lessonId !== "NULL") // As long as the empty option is not selected
	{
		let xhttp = new XMLHttpRequest()
		xhttp.onreadystatechange = function ()
		{
			if (this.readyState === 4)
			{
				if (this.status === 200)
				{
					console.log("Woop did a thing!")
				}
				else if (this.status === 412)
				{
					alert("This activity is already in that lesson!")
				}
			}
		}
		xhttp.open("GET", `http://localhost:8000/api/addtolesson?act=${actId}&les=${lessonId}`)
		xhttp.send()
	}
}