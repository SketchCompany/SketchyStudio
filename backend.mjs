import express from "express"
import jwt from "jsonwebtoken"
import fs from "fs"
import path from 'path'
import { fileURLToPath } from 'url'
import Studio from "./studio.mjs"
import dotenv from "dotenv"
dotenv.config()

const studio = new Studio()
const router = express.Router()
const router2 = express.Router()
router.use(express.json())
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const BASE_DIR = __dirname + "/frontend/"
const SECRET_KEY = process.env.TOKEN_ENCRYPTION_KEY

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

router.post("/create", authenticate, async (req, res) => {
    try{
        const args = req.body
        const userData = await studio.userData({id: req.id})
        const response = await studio.createProject(userData, args)

        if(!response){
            res.status(200).json({ 
                status: 1,
                data: "successfully created project"
            })
        }
        else{
            res.status(500).json({ 
                status: 0,
                data: response.data
            })
        }
    }
    catch(err){
        console.error(req.path, err)
        res.status(500).json({
            status: 0,
            data: err.toString()
        })
    }
})

router.get("/projects", authenticate, async (req, res) => {
    try{
        const userData = await studio.userData({id: req.id})
        const response = await studio.getProjects(userData)

        if(response){
            res.status(200).json({
                status: 1,
                data: response
            })
        }
        else{
            res.status(500).json({ 
                status: 0,
                data: response.data
            })
        }
    }
    catch(err){
        console.error(req.path, err)
        res.status(500).json({
            status: 0,
            data: err.toString()
        })
    }
})

router.get("/project/:name", authenticate, async (req, res) => {
    try{
        const args = req.params
        const userData = await studio.userData({id: req.id})
        const response = await studio.getProject(userData, args)

        if(response){
            res.status(200).json({
                status: 1,
                data: response
            })
        }
        else{
            res.status(500).json({ 
                status: 0,
                data: response.data
            })
        }
    }
    catch(err){
        console.error(req.path, err)
        res.status(500).json({
            status: 0,
            data: err.toString()
        })
    }
})

router.post("/remove", authenticate, async (req, res) => {
    try{
        const args = req.body
        const userData = await studio.userData({id: req.id})
        const response = await studio.removeProject(userData, args)
        
        if(!response){
            res.status(200).json({
                status: 1,
                data: response
            })
        }
        else{
            res.status(500).json({ 
                status: 0,
                data: response.data
            })
        }
    }
    catch(err){
        console.error(req.path, err)
        res.status(500).json({
            status: 0,
            data: err.toString()
        })
    }
})

router.get("/project/:name/files", authenticate, async (req, res) => {
    try{
        const args = req.params
        const userData = await studio.userData({id: req.id})
        const response = await studio.getProject(userData, args)

        if(response){
            const project = response
            const fileName = req.query.name
            const response2 = await studio.getFileFromProject(userData, {project, fileName})
            if(response2.status != 0){
                const fileData = response2
                res.status(200).json({
                    status: 1,
                    data: fileData
                })
            }
            else{
                res.status(500).json({ 
                    status: 0,
                    data: response2.data
                })
            }
        }
        else{
            res.status(500).json({ 
                status: 0,
                data: response.data
            })
        }
    }
    catch(err){
        console.error(req.path, err)
        res.status(500).json({
            status: 0,
            data: err.toString()
        })
    }
})

router2.get("/:id/:name/files", async (req, res) => {
    try{
        const args = req.params
        const userData = await studio.userData({id: args.id})
        const response = await studio.getProject(userData, args)

        if(response){
            const project = response
            const fileName = req.query.name
            if(studio.exists(project.project_dir + "/" + fileName)){
                res.status(200).sendFile(project.project_dir + "/" + fileName)
            }
            else{
                res.status(400).json({ 
                    status: 0,
                    data: "file not found"
                })
            }
        }
        else{
            res.status(500).json({ 
                status: 0,
                data: response
            })
        }
    }
    catch(err){
        console.error(req.path, err)
        res.status(500).json({
            status: 0,
            data: err.toString()
        })
    }
})

export default {router, router2, studio}