import express from "express"
import backend from "./backend.mjs"
import fs from "fs"
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = 5002
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const BASE = __dirname + "/frontend/"

app.use(express.json())
app.use("/b", backend)

app.get("/res", (req, res) => {
    try{
        if(fs.existsSync(BASE + "res/" + req.query.f)) res.sendFile(BASE + "res/" + req.query.f)
        else res.redirect("/error?m=The requested resource could not be found.")
    }
    catch(err){
        console.log(err)
        res.redirect("/error?m=We don't know what to do either.")
    }
})

app.get("*", (req, res) => {
    try{
        if(fs.existsSync(BASE + req.path + "/index.html")) res.sendFile(BASE + req.path + "/index.html")
        else res.redirect("/error?m=The page you were looking for could not be found.")
    }
    catch(err){
        console.log(err)
        res.redirect("/error?m=We don't know what to do either.")
    }
})


// start server
app.listen(PORT, function(err){
    if(err) console.error("error on startup:", err)
    else{
        console.log("Server running on http://localhost:" + PORT)
    }
})