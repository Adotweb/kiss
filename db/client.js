const { MongoClient } = require("mongodb");
require("dotenv").config();


const conn_string = process.env.MONGO;

const client = new MongoClient(conn_string);

let db = false;


async function initDB(){
	
	try {

		let connection = await client.connect();
		db = connection.db("ksso");
		console.log("conected")
	}catch(e){
		console.error(e)
	}
}


async function getDB(){
	
	if(db){
		return db
	}else {
		throw "no db"
	}

}

module.exports = {
	initDB,
	getDB
}
