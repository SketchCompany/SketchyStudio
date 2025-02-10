import fs from "fs"
import path from 'path'
import { fileURLToPath } from 'url'
import NodeCache from "node-cache"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const cache = new NodeCache({stdTTL: 30, checkperiod: 1})
const BASE_DIR = __dirname + "/"
const PROFILES_DIR = BASE_DIR + "/profiles/"

export default class Functions{

    /**
     * used to create a new project with custom args for each user
     * @param {JSON} args 
     * @returns 
     */
    createProject(userData, args){
        return new Promise(async cb => {
            try{
                const PROJECT_DIR = PROFILES_DIR + userData.id + "/" + args.name + "/"

                const studioData = JSON.parse(userData.studio)
                for (let i = 0; i < studioData.length; i++) {
                    const element = studioData[i];
                    if(element.name == args.name){
                        cb({
                            status: 0, 
                            data: "Ein Projekt mit diesem Namen existiert bereits."
                        })
                    }
                }
                const newStudioProjectData = {
                    name: args.name,
                    description: args.description,
                    project_dir: PROJECT_DIR
                }

                console.log("createProject: PROJECT_DIR:", PROJECT_DIR)
                if(!exists(PROJECT_DIR)){
                    await createDirectory(PROJECT_DIR)
                }

                await writeFile(PROJECT_DIR + "index.css", `
                    :root{
                        --color-font: rgb(10,10,10);
                        --color-font-dark: rgb(225,225,225);
                        --color-background-1: rgb(250,250,250);
                        --color-background-2: rgb(240,240,240);
                        --color-background-3: rgb(230,230,230);
                        --color-background-dark: rgb(20,20,20);
                        --color-border: rgb(150,150,150);
                        --color-primary: rgb(0,75,255);
                        --color-border-primary: rgb(0,150,255);
                        --color-secondary: rgb(100,75,255);
                        --color-border-secondary: rgb(150,100,255);
                        --color-hover: rgb(200,200,200);
                    }
                    html{
                        scroll-behavior: smooth;
                    }
                    body{
                        background-color: var(--color-background-dark);
                        color: var(--color-font-dark);
                        font-family: "Open Sans", sans-serif;
                        margin: 0;
                        padding: 0;
                    }
                    h1{
                        font-size: 50px;
                        line-height: 50px;
                    }
                    h2{
                        font-size: 25px;
                        line-height: 40px;
                    }
                    h3{
                        font-size: 25px;
                        line-height: 30px;
                    }
                `.replaceAll("                    ", "").trim())

                await writeFile(PROJECT_DIR + "index.html", `
                    <!DOCTYPE html>
                    <html lang="de">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">

                        <!-- Google Fonts -->
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap">

                        <!-- Sketchy Studio -->
                        <link rel="author" title="${userData.user}">
                        <link rel="preconnect" href="https://studio.sketch-company.de">
                        <link rel="stylesheet" href="https://localhost:3500/api/${userData.id}/${args.name}/files?name=index.css"> <!-- studio.sketch-company.de on production -->

                        <title>${args.name} - ${userData.user}</title>
                    </head>
                    <body>
                        <h1>${args.name}</h1>
                        <p>Hover über die verschiedenen Elemente und klicke sie an um sie zu bearbeiten.</p>
                    </body>
                    </html>
                `.replaceAll("                    ", "").trim())

                console.log("createProject: created files: index.css, index.html")

                studioData.push(newStudioProjectData)
                userData.studio = JSON.stringify(studioData)
                const updateResponse = await send("https://api.sketch-company.de/u/update", userData)
                console.log("createProject: updated account")
                cache.del(userData.id)
                cb()
            }
            catch(err){
                console.error("createProject:", err)
                cb({
                    status: 0, 
                    data: err
                })
            }
        })
    }

    getProjects(userData, args){
        return new Promise(async cb => {
            try{
                const studioProjects = JSON.parse(userData.studio)
                const projectsFolders = await readDirectory(PROFILES_DIR + userData.id)
                
                for (let i = 0; i < studioProjects.length; i++) {
                    const element = studioProjects[i];
                    element.index = i
                    if(element.name != projectsFolders[i]){
                        console.warn("projects: found project, which is missing in the database or on the server")
                        console.warn("projects: project:", element.name)
                        console.warn("projects: databse:", studioProjects)
                        console.warn("projects: server:", projectsFolders)
                    }
                }

                cb({projects: studioProjects, folders: projectsFolders})
            }
            catch(err){
                console.error("createProject:", err)
                cb({
                    status: 0, 
                    data: err
                })
            }
        })
    }

    getProject(userData, args){
        return new Promise(async cb => {
            try{
                const studioProjects = JSON.parse(userData.studio)
                for (let i = 0; i < studioProjects.length; i++) {
                    const element = studioProjects[i];
                    if(element.name == args.name){
                        cb(element)
                        break
                    }
                }
                cb()
            }
            catch(err){
                console.error("createProject:", err)
                cb({
                    status: 0, 
                    data: err
                })
            }
        })
    }

    getFileFromProject(userData, args){
        return new Promise(async cb => {
            try{
                const filePath = args.project.project_dir + "/" + args.fileName
                if(exists(filePath)){
                    const fileData = await readFile(filePath)
                    cb(fileData)
                }
                else{
                    cb({status: 0, data: "Die gesuchte Datei konnte nicht gefunden werden: " + args.fileName})
                }
            }
            catch(err){
                console.error("getFileFromProject:", err)
                cb({
                    status: 0, 
                    data: err
                })
            }
        })
    }

    removeProject(userData, args){
        return new Promise(async cb => {
            try{
                const studioData = JSON.parse(userData.studio)
                if(studioData.length < args.index){
                    cb({status: 0, err: "Das Projekt mit dem Index " + args.index + " konnte nicht gefunden werden."})
                }
                const project = studioData[args.index]
                studioData.splice(args.index, 1)

                await remove(project.project_dir)

                userData.studio = JSON.stringify(studioData)
                const updateResponse = await send("https://api.sketch-company.de/u/update", userData)
                console.log("createProject: updated account")
                cache.del(userData.id)
                cb()
            }
            catch(err){
                console.error("removeProject:", err)
                cb({
                    status: 0, 
                    data: err
                })
            }
        })
    }

    login(userOrEmail, password){
        return new Promise(async cb => {
            try{
                const response = await send("https://api.sketch-company.de/u/login", {userOrEmail, password})
                cb(response)
            }
            catch(err){
                console.error("login:", err)
                cb({
                    status: 0, 
                    data: err
                })
            }
        })
    }

    userData(identifierObject){
        return new Promise(async cb => {
            try{
                if(cache.has(identifierObject.id)){
                    const userData = cache.get(identifierObject.id)
                    if(!userData.studio) userData.studio = "[]"
                    console.log("userData: from cache for", identifierObject)
                    cb(userData)
                }
                else{
                    const userData = await send("https://api.sketch-company.de/u/find", identifierObject)
                    delete userData.password
                    delete userData.email
                    delete userData.configWebsites
                    delete userData.games
                    delete userData.recordId
                    if(!userData.studio) userData.studio = "[]"
                    cache.set(userData.id, userData)
                    console.log("userData: from api for", identifierObject)
                    console.log("userData: updated cache", cache.data)
                    cb(userData)
                }
            }
            catch(err){
                console.error("userData:", err)
                cb({
                    status: 0, 
                    data: err
                })
            }
        })
    }

    get = get
    send = send
    exists = exists
}
/**
 * fetches a specific ```url``` with the ```GET``` method and returns the data of the response
 * @param {string} url the url to be fetched
 * @returns {Promise} the data of the response from the fetched url
 */
function get(url){
    return new Promise(async cb => {
        fetch(url).then((response) => response.json()).then((result) => {
            console.log("get:", url, "response:", result)
            if(result.status != 1) console.warn("get: warning:", result)
            cb(result.data)
        }).catch((err) => {
            console.error("get:", url, "error:", err)
            cb(err)
        })
    })
}
/**
 * fetches a specific ```url``` with the ```POST``` method with the preferred ```data``` as ```JSON``` and returns the data of the response
 * @param {string} url the url to be fetched
 * @param {JSON} data the data that needs to be send to the url
 * @returns {Promise} the data of the response from the fetched url
 */
function send(url, data){
    return new Promise(async cb => {
        fetch(url, {method: "post", body: JSON.stringify(data), headers: {"Content-Type": "application/json"}}).then((response) => response.json()).then((result) => {
            console.log("send:", url, "response:")
            if(result.status != 1) console.warn("send: warning:", result)
            console.dir(result, {depth: null})
            cb(result.data)
        }).catch((err) => {
            console.error("send:", url, "error:", err)
            cb(err)
        })
    })
}
function createDirectory(path){
    return new Promise(async cb => {
        fs.mkdir(path, {recursive: true}, (err) => {
            if(err){
                console.error("createDirectory:", err)
                cb(err)
            }
            else{
                cb()
            }
        })
    })
}
function remove(path){
    return new Promise(async cb => {
        fs.rm(path, {recursive: true}, (err) => {
            if(err){
                console.error("remove:", err)
                cb(err)
            }
            else{
                cb()
            }
        })
    })
}
function writeFile(path, data){
    return new Promise(async cb => {
        fs.writeFile(path, data, (err) => {
            if(err){
                console.error("writeFile:", err)
                cb(err)
            }
            else{
                cb()
            }
        })
    })
}
function readFile(path){
    return new Promise(async cb => {
        fs.readFile(path, (err, data) => {
            if(err){
                console.error("readFile:", err)
                cb(err)
            }
            else{
                cb(data.toString())
            }
        })
    })
}
function readDirectory(path){
    return new Promise(async cb => {
        fs.readdir(path, (err, files) => {
            if(err){
                console.error("readDirectory:", err)
                cb(err)
            }
            else{
                cb(files)
            }
        })
    })
}
function exists(path){
    return fs.existsSync(path)
}