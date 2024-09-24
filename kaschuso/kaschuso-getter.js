const { WebSocket } = require("ws");

const ws = new WebSocket("wss://localhost-njg5.onrender.com");

let grade_requests = new Map();

let send_grade_request = (username, password, res) => {	

	if(ws.readyState == WebSocket.CLOSED){
		ws = new WebSocket("wss://localhost-njg5.onrender.com")
	}
	
	try {


		let grade_request_id = crypto.randomUUID()

		

	ws.send(JSON.stringify({
		method:"client.to_host"	,
		host_id :"ksso",
		data : {
			username, 
			password,
			grade_request_id
		}
	}))


	grade_requests.set(grade_request_id, [res, performance.now()])

	}catch(e){
		res.send(e)
	};
}


ws.on("message", (proto_msg) => {
	
	const msg = JSON.parse(proto_msg.toString())


	let grades = msg.data;

	let [grade_request, startTime] = grade_requests.get(msg.grade_request_id)	

	grade_requests.delete(msg.grade_requests_id)

	grade_request.send({
		took : performance.now() - startTime,
		grades
	})


})

ws.on("open", () => {


	ws.send(JSON.stringify({
		"method":"client.login",
	}))
	
	
})


module.exports = {
	send_grade_request,
}