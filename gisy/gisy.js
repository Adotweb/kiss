const fs = require("fs")
const path = require("path")

let posts = fs.readFileSync(path.resolve("./data/postdb.txt"), "utf8").split("\n").filter(s => s!== "").map(s => JSON.parse(s))

let people = fs.readFileSync(path.resolve("./data/gisxdb.txt"), "utf8").split("\n").filter(s => s!== "").map(s => JSON.parse(s))


function searchWithQuery(){

	return (req, res) => {
	let {query, loaded} = req.body


	loaded = loaded ? Number(loaded) + 5 : 0
	

	query = query.toLowerCase().trim().replaceAll(/\s+/g, " ");
		
	

	let hits = people.filter(person => {

		//email is the class for some weird reason is fixed in next version i promise ...

		let {name, vorname, uid, klasse} = person




		return (vorname + " " + name + " " + uid + " " + klasse).toLowerCase().includes(query)

	})	

	let limit = 5 

	if(hits.length < 30){
		limit = hits.length
	}

	hits = hits.splice(0, limit)

	


	let formattedPeople = hits.map(person => `
		<a class="flex justify-between" href="/id/user/${person.uid}">${person.vorname} ${person.name} <div>${person.klasse || person.uid}</div></a>
		`).join("")

	if(query.length == 0){
		formattedPeople = ""
	}


	let posthits = posts.sort((cur, next) => {
		
		[cd, cm, cy] = cur.date.split(".");
		[nd, nm, ny] = next.date.split(".");


		let d1 = new Date(cy.split(" ")[0], cm, cd)

		let d2 = new Date(ny.split(" ")[0], nm, nd)

		return d2 - d1

	}).filter(post => {


		let {text, title, date, author} = post;


		return (author + " " + date + " " + title + " " + text).toLowerCase().includes(query)

	}).slice(0, 5 + loaded)
	


	let formattedPosts = posthits.map(post => `

		<hr>
		<a  ${post.mehr ? 'href="/id/loadmore?' +post.mehr.split("?")[1] + '"' : ""} class="flex flex-col pt-2">
			
			<div class="w-full flex justify-between"><div>${post.title}</div> ${post.date}</div>

			<div class="pt-2">${post.text}</div>

			<div>${post.author}</div>
		</a>

		`).join("")

	let loadmore = `
	<hr>

	<div class="flex pt-2 justify-center">
		<input class="hidden" type="text" value="${loaded}" id="loaded" name="loaded">	
		<button hx-post="/id/search" hx-include="#query, #loaded" hx-target=".results">load more</button>		
	</div>
	`
	res.send(formattedPeople + formattedPosts + (formattedPosts.length > 0  ? loadmore : ""))
	
	}

}


module.exports = {
	searchWithQuery
}
