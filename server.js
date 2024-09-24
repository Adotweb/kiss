const express = require("express");
const bodyparser = require("body-parser");

const cookieparser = require("cookie-parser")

const { getValidatedSesh, is_valid_sesh } = require("./gisy/gisy")


const {initDB, getDB} = require("./db/client")
require("dotenv").config()

const PORT = process.env.PORT || 3000;


const app = express();

const fs = require("fs")
const path = require("path");
const { send_grade_request } = require("./kaschuso/kaschuso-getter");


const people = fs.readFileSync(path.resolve("gisy", "people.txt"), "utf8").split("\n").filter(s => s!="")
.map(JSON.parse)

app.use(cookieparser())

app.use(bodyparser())
app.use(express.json())

app.use(express.static(__dirname + "/static/"));

app.post("/grades", async (req, res) => {

	const {username, password} = req.body;


	try {
		send_grade_request(username, password, res)
	}catch(e){
		console.log("something went wrong here", e)
		res.send(e)
	};	
})

app.post("/login", async (req, res) => {


	const {username, password} = req.body;


	let session = await getValidatedSesh(username, password);
	let is_gisy_user = await is_valid_sesh(session)


				
	res.redirect("/home")
})

app.get("/search", async (req, res) => {

	let query = req.query.query || "";


	let hits = people.filter(person => {

		let {vorname, name, uid, klasse, email} = person
	

		return [vorname, name, uid, klasse, email].join(" ").toLowerCase().includes(query.toLowerCase())
	}).slice(0, 20)


	hits = hits.map(hit => `
		<li>${hit.vorname} ${hit.name} ${hit.email} <a class="text-blue-400" href="/timetable?klasse=${hit.klasse}">${hit.klasse}</a></li>
		`).join("")


	res.send(hits)
})

app.post("/timetable", async (req, res) => {


	let klasse = req.query.klasse;

	if(!klasse){
		return res.send("no query?")
	}

	let time_table = await (await getDB()).collection("timeTables").findOne({
		name : klasse + ".json"
	})
	
	res.send(await time_table.data)
})

app.post("/compare", async (req, res) => {

	let klasse = req.query.klasse;

	if(!klasse){
		return res.send("no query?")
	}

	let time_table = await (await getDB()).collection("timeTables").findOne({
		name : klasse + ".json"
	})
	
	res.send(await time_table.data)
})


initDB(() => {
	app.listen(PORT, ()=> console.log("server running on port", PORT))
})
