const express = require("express")
const bcrypt = require("bcrypt")
const cors = requiree("cors")
const app = express()
const mysql = require("mysql2")
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({ 

})









app.listen(3000,()=>{
    console.log("started in port 3000")
});