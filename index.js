const {AresHost, static} = require("@adotweb/ares")



const env = require("./env.json")
const { searchWithQuery } = require("./gisy/gisy")

//const app = new AresHost("wss://localhost-njg5.onrender.com", env)
const app = new AresHost("ws://localhost:5000", env )


app.rest.use(static("./static"))

app.rest.post("/login", (req, res) => {



	//login logik


	

	res.setCookie("token", "tokenvalue")
	res.redirect("/home.html")
})

app.rest.get("/kaschuso/hello", (req, res) => {


	res.send("kaschuso hello")
})

app.rest.post("/search", searchWithQuery())
