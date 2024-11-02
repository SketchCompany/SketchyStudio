import express from "express"
import jwt from "jsonwebtoken"
import fs from "fs"
import path from 'path'
import { fileURLToPath } from 'url'
import Studio from "./studio.mjs"

const studio = new Studio()
const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const BASE_DIR = __dirname + "/frontend/"
const SECRET_KEY = "V?akYlDw!B|?-K3Gm6(;oE8VyH',*U'dMzzHvO91Mpz8kHfEWQCqIZWTEJWu99BEV)8Q}[:}z(sHWN;4E.lqEZIVE{A_Up~4"

const authenticate = (req, res, next) => {
    try{
        const token = req.headers["authorization"]?.split(" ")[1]
        if(!token){
            console.error("authenticate: no token found")
            return res.sendStatus(401)
        }
        
        jwt.verify(token, SECRET_KEY, (err, id) => {
            if(err){
                console.error("authenticate:", err)
                return res.sendStatus(403)
            }
            req.id = id
            next()
        })
    }
    catch(err){
        console.error("authenticate:", err)
        return res.sendStatus(500)
    }
}

// router.post("/login", async (req, res) => {
//     try{
//         const {userOrEmail, password} = req.body

//         if((await studio.login(userOrEmail, password)).correct){
//             const id = await studio.userData({userOrEmail})
//             const token = jwt.sign({id}, SECRET_KEY, {expiresIn: "1m"})
//             res.status(200).json({
//                 status: 1,
//                 data: token
//             })
//         } 
//         else{
//             res.status(403).json({
//                 status: 0,
//                 data: "invalid credentials"
//             })
//         }
//     }
//     catch(err){
//         console.error(req.path, err)
//         res.status(500).json({
//             status: 0,
//             data: err.toString()
//         })
//     }
// })

router.post("/create", authenticate, async (req, res) => {
    try{
        const args = req.body
        const userData = studio.userData({id: req.id})
        await studio.createProject(userData, args)
        res.status(200).json({ 
            status: 1,
            data: "successfully created project " + req.query.name
        })
    }
    catch(err){
        console.error(req.path, err)
        res.status(500).json({
            status: 0,
            data: err.toString()
        })
    }
})

export default router