import express from "express"
import fs from "fs"
import path from 'path'
import { fileURLToPath } from 'url'
import backend from "./backend.mjs"

const app = express()
const PORT = 5002
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const BASE_DIR = __dirname + "/frontend/"

app.use(express.json())
app.use("/b", backend.router)
app.use("/api", backend.router2)

const authenticate = async (req, res, next) => {
    try{
        const token = req.headers["authorization"]?.split(" ")[1]
        if(!token){
            console.error("authenticate: no token found")
            return res.sendStatus(401)
        }

        jwt.verify(token, SECRET_KEY, (err, object) => {
            if(err){
                console.error("authenticate: ❌ failed")
                // console.error("authenticate: error:", err)
                return res.sendStatus(403)
            }
            console.log("authenticate: ✅ successful")
            req.id = object.id
            next()
        })
    }
    catch(err){
        console.error("authenticate:", err)
        return res.sendStatus(500)
    }
}


app.get("/res", (req, res) => {
    try{
        if(fs.existsSync(BASE_DIR + "res/" + req.query.f)) res.sendFile(BASE_DIR + "res/" + req.query.f)
        else res.redirect("/error?m=The requested resource could not be found.")
    }
    catch(err){
        console.log(err)
        res.redirect("/error?m=We don't know what to do either.")
    }
})

app.get("/studio/:name", (req, res) => {
    res.sendFile(BASE_DIR + "studio/project.html")
})

app.get("*", (req, res) => {
    try{
        if(fs.existsSync(BASE_DIR + req.path + "/index.html")) res.sendFile(BASE_DIR + req.path + "/index.html")
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