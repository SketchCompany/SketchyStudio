let clicked = null
class SketchyStudio{
    constructor(){
    }
    /**
     * checks if the website is loaded on the desktop or on a mobile device
     * @returns {boolean}
     */
    isMobile = function(){
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera)
        return check
    }
    /**
     * just like ```open(href, target)``` but ```target``` is set to ```_self``` as default
     * @param {string | URL} href the link to open
     * @param {string} target the custom open method
     */
    openSite(href, target){
        if(target) open(href, target)
        else open(href, "_self")
    }
    /**
     * fetch information from the backend with the GET method and return the data of the response
     * @param {string} url the url to fetch the data from
     * @param {boolean} raw used to get the complete response
     * @param {boolean} log used to disable the log
     * @returns {Promise<JSON> | Promise<string>}
     */
    get(url){
        return new Promise(async cb => {
            fetch(url).then(response => response.json()).then(result => {
                console.log("get:", url, "response:", result)
                cb(result.data)
            }).catch(reason => {
                console.error("get: ❌ failed:", reason)
                cb({status: 0, err: reason})
            })
        })
    }
    get(url, raw){
        return new Promise(async cb => {
            fetch(url).then(response => response.json()).then(result => {
                console.log("get:", url, "response:", result)
                if(raw) cb(result)
                else cb(result.data) 
            }).catch(reason => {
                console.error("get: ❌ failed:", reason)
                cb({status: 0, err: reason})
            })  
        })
    }
    get(url, raw, log){
        return new Promise(async cb => {
            fetch(url).then(response => response.json()).then(result => {
                if(log) console.log("get:", url, "response:", result)
                if(raw) cb(result)
                else cb(result.data)
            }).catch(reason => {
                console.error("get: ❌ failed:", reason)
                cb({status: 0, err: reason})
            })  
        })
    }
    authGet(url, raw){
        return new Promise(async cb => {
            const token = localStorage.getItem("token")
            if(!token){
                console.error("authGet: no token found")
                console.error("authGet: cannot make a request without a token")
                cb("error: no token found")
            }
            else{
                fetch(url, {headers: {"Authorization": "Bearer " + token}}).then(response => response.json()).then(result => {
                    console.log("get:", url, "response:", result)
                    if(raw) cb(result)
                    else cb(result.data)   
                }).catch(reason => {
                    console.error("get: ❌ failed:", reason)
                    cb({status: 0, err: reason})
                })
            }
        })
    }
    /**
     * fetch information from or to the backend with the POST method and return the data of the response
     * @param {string} url the url to fetch the data from
     * @param {boolean} raw used to get the complete response
     * @param {boolean} log used to disable the log
     * @returns {Promise<JSON> | Promise<string>}
     */
    send(url, data){
        return new Promise(async cb => {
            fetch(url, {method: "post", body: JSON.stringify(data), headers: {"Content-Type": "application/json"}}).then(response => response.json()).then(result => {
                console.log("send:", url, "response:", result)
                cb(result.data)
            }).catch(reason => {
                console.error("send: ❌ failed:", reason)
                cb({status: 0, err: reason})
            })
        })
    }
    // fetch information from or to the backend with the POST method and return the complete response
    send(url, data, raw){
        return new Promise(async cb => {
            fetch(url, {method: "post", body: JSON.stringify(data), headers: {"Content-Type": "application/json"}}).then(response => response.json()).then(result => {
                console.log("send:", url, "response:", result)
                if(raw) cb(result)
                else cb(result.data)
            }).catch(reason => {
                console.error("send: ❌ failed:", reason)
                cb({status: 0, err: reason})
            })
        })
    }
    send(url, data, raw, log){
        return new Promise(async cb => {
            fetch(url, {method: "post", body: JSON.stringify(data), headers: {"Content-Type": "application/json"}}).then(response => response.json()).then(result => {
                if(log) console.log("send:", url, "response:", result)
                    if(raw) cb(result)
                    else cb(result.data)
            }).catch(reason => {
                console.error("send: ❌ failed:", reason)
                cb({status: 0, err: reason})
            })
        })
    }
    authSend(url, data, raw){
        return new Promise(async cb => {
            const token = localStorage.getItem("token")
            if(!token){
                console.error("authSend: no token found")
                console.error("authSend: cannot make a request without a token")
                cb("error: no token found")
            }
            else{
                fetch(url, {method: "post", body: JSON.stringify(data), headers: {"Content-Type": "application/json", "Authorization": "Bearer " + token}}).then(response => response.json()).then(result => {
                    console.log("authSend:", url, "response:", result)
                    if(raw) cb(result)
                    else cb(result.data)
                }).catch(reason => {
                    console.error("send: ❌ failed:", reason)
                    cb({status: 0, err: reason})
                })
            }
        })
    }
    /**
     * creates a notification in the bottom right with a ```title```, ```message``` and ```type```. You also need to define a callback that is called when the notification is clicked
     * @param {string} title the headline of the notification
     * @param {string} message the description of the notification
     * @param {string} type the type of the notification as ```CSS```
     * @param {function} cb the callback of the notification, that is triggerd when the notification is clicked
     * @param {boolean} hideFromCenter to specify wether the notification should be added to the notification center on the top left at the bell icon
     * @returns 
     */
    async notifyCb(title, message, type, cb, hideFromCenter){
        let duration = (1000 * 7) + 1000
        const element = $(document.createElement("div")).addClass("notification").addClass(type)
        element.append($(document.createElement("div")).append($(document.createElement("h2")).html(title)).append($(document.createElement("p")).html(message)))
        element.append($(document.createElement("i")).addClass(["bi", "bi-x-lg"]).click(async function(){
            element.remove()
        }))
        element.css("animation", "notificationSlideIn 1000ms")
        setTimeout(function(){
            element.css("animation", "notificationSlideOut 1000ms")
            setTimeout(() => element.remove(), 750)
        }, duration)
        element.click(async function(){
            element.css("animation", "notificationSlideOut 1000ms")
            setTimeout(() => element.remove(), 750)
            cb()
        })
        $("body").append(element)
    }
    /**
     * creates a notification in the bottom right with a ```title```, ```message``` and ```type```
     * @param {string} title the headline of the notification
     * @param {string} message the description of the notification
     * @param {string} type the type of the notification as ```CSS```
     * @param {boolean} hideFromCenter to specify wether the notification should be added to the notification center on the top left at the bell icon
     * @returns 
     */
    async notify(title, message, type, hideFromCenter){
        let duration = (1000 * 7) + 1000
        const element = $(document.createElement("div")).addClass("notification").addClass(type)
        element.append($(document.createElement("div")).append($(document.createElement("h2")).html(title)).append($(document.createElement("p")).html(message)))
        element.append($(document.createElement("i")).addClass(["bi", "bi-x-lg"]).click(async function(){
            element.remove()
        }))
        element.css("animation", "notificationSlideIn 1000ms")
        element.click(async function(){
            element.css("animation", "notificationSlideOut 1000ms")
            setTimeout(() => element.remove(), 750)
        })
        setTimeout(function(){
            element.css("animation", "notificationSlideOut 1000ms")
            setTimeout(() => element.remove(), 750)
        }, duration)
        $("body").append(element)
    }
    /**
     * creates a notification in the bottom right with a ```title```, ```message```, ```type``` and ```duration```. You also need to define a callback that is called when the notification is clicked
     * @param {string} title the headline of the notification
     * @param {string} message the description of the notification
     * @param {string} type the type of the notification as ```CSS```
     * @param {function} cb the callback of the notification, that is triggerd when the notification is clicked
    *  @param {number} duration the duration of the notification before its removed
     * @param {boolean} hideFromCenter to specify wether the notification should be added to the notification center on the top left at the bell icon
     * @returns 
     */
    async notifyCb(title, message, type, duration, cb, hideFromCenter){
        let finalDuration = (1000 * 7) + 1000
        if(duration) finalDuration = duration
        const element = $(document.createElement("div")).addClass("notification").addClass(type)
        element.append($(document.createElement("div")).append($(document.createElement("h2")).html(title)).append($(document.createElement("p")).html(message)))
        element.append($(document.createElement("i")).addClass(["bi", "bi-x-lg"]).click(async function(){
            element.remove()
        }))
        element.css("animation", "notificationSlideIn 1000ms")
        setTimeout(function(){
            element.css("animation", "notificationSlideOut 1000ms")
            setTimeout(() => element.remove(), 750)
        }, finalDuration)
        element.click(async function(){
            element.css("animation", "notificationSlideOut 1000ms")
            setTimeout(() => element.remove(), 750)
            cb()
        })
        $("body").append(element)
    }
    
    /**
     * creates a notification in the bottom right with a ```title```, ```message``` and ```type```
     * @param {string} title the headline of the notification
     * @param {string} message the description of the notification
     * @param {string} type the type of the notification as ```CSS```
     *  @param {number} duration the duration of the notification before its removed
     * @param {boolean} hideFromCenter to specify wether the notification should be added to the notification center on the top left at the bell icon
     * @returns 
     */
    async notify(title, message, type, duration, hideFromCenter){
        let finalDuration = (1000 * 7) + 1000
        if(duration) finalDuration = duration
        const element = $(document.createElement("div")).addClass("notification").addClass(type)
        element.append($(document.createElement("div")).append($(document.createElement("h2")).html(title)).append($(document.createElement("p")).html(message)))
        element.append($(document.createElement("i")).addClass(["bi", "bi-x-lg"]).click(async function(){
            element.remove()
        }))
        element.css("animation", "notificationSlideIn 1000ms")
        setTimeout(function(){
            element.css("animation", "notificationSlideOut 1000ms")
            setTimeout(() => element.remove(), 750)
        }, finalDuration)
        element.click(async function(){
            element.css("animation", "notificationSlideOut 1000ms")
            setTimeout(() => element.remove(), 750)
        })
        $("body").append(element)
    }
    /**
     * creates an dialog with an custom ```title```, ```message``` and ```elements```. You can also set the width and height
     * @param {string} title the headline of the dialog
     * @param {string} message the description of the dialog
     * @param {string} elements the custom elements to add in a string with the ``` `` ``` characters
     * @param {number} width the width of the dialog window in px
     * @param {number} height the height of the dialog window in px
     * @returns {string} the selector as id of the created dialog
     */
    createDialog(title, message, elements, width, height){
        const id = title.replaceAll(" ", "_") + "-dialog"
        const headline = $(document.createElement("h2")).html(title)
        const description = $(document.createElement("p")).html(message)
        const cancel = $(document.createElement("i")).addClass(["bi", "bi-x-lg"]).click(() => this.removeDialog("#" + id))
        const content = $(document.createElement("div")).addClass("content").append([headline, description, elements, cancel])
        if(width) content.css("width", width + "px")
        if(height) content.css("height", height + "px")
        const background = $(document.createElement("div")).addClass("background")
        const dialog = $(document.createElement("div")).attr("id", id).addClass("dialog").append([background, content])
        $("body").prepend(dialog)
        this.disableScroll()
        this.setInputFields()
        return "#" + id
    }
        /**
     * creates an dialog with an custom ```title```, ```message``` and ```elements```. You can also set the width and height
     * @param {string} title the headline of the dialog
     * @param {string} message the description of the dialog
     * @param {string} elements the custom elements to add in a string with the ``` `` ``` characters
     * @param {string} type the type of the dialog: ```error```, ```warning```, ```note``` and ```success```
     * @param {number} width the width of the dialog window in px
     * @param {number} height the height of the dialog window in px
     * @returns {string} the selector as id of the created dialog
     */
    createDialog(title, message, elements, type, width, height){
        const id = title.replaceAll(" ", "_") + "-dialog"
        const headline = $(document.createElement("h2")).html(title)
        const description = $(document.createElement("p")).html(message)
        const cancel = $(document.createElement("i")).attr("id", title.replaceAll(" ", "_") + "-dialog-cancel").addClass(["bi", "bi-x-lg"]).click(() => this.removeDialog("#" + id))
        const content = $(document.createElement("div")).addClass(["content", type]).append([headline, description, elements, cancel])
        if(width) content.css("width", width + "px")
        if(height) content.css("height", height + "px")
        const background = $(document.createElement("div")).addClass("background")
        const dialog = $(document.createElement("div")).attr("id", id).addClass("dialog").append([background, content])
        $("body").prepend(dialog)
        this.disableScroll()
        this.setInputFields()
        return "#" + id
    }
    /**
     * removes a dialog with a specific ```id```
     * @param {string} id the id of the dialog to remove
     */
    removeDialog(id){
        this.enableScroll()
        $(id).remove()
    }

    disableScroll(){
        $("body").css("overflow", "hidden")
        $("body").css("height", "100%")
    }
    enableScroll(){
        $("body").css("overflow", "auto")
        $("body").css("height", "fit-content")
    }
    setInputFields(){
        const inputs = $("input").map(function(){return this}).get()
        for (let i = 0; i < inputs.length; i++) {
            const element = $(inputs[i]);
            if(element.attr("checked")) continue
            element.attr("spellcheck", "false")
            element.attr("autocomplete", "off")
            element.attr("checked")
        }
    }
    /**
     * 
     * @param {string} name the selector for the context menu, so its open when the element with the same name (selector) got right clicked
     * @param {string} id the id or name of the contextmenu, which is used for removing the contextmenu
     * @param {string} elements the elements in the contextmenu as ``` `` ``` string
     * @param {function} event the callback, which is called when one of the buttons is clicked and provides two paramters: ```i``` (the index of the button of the contextmenu) and ```element``` (the element that was right clicked)
     * @param {Array<string>} blocked the list of blocked elements that cannot trigger the contextmenu
     */
    createCtxMenu(name, id, elements, event, blocked){
        $("body").prepend(`
            <div id="` + id + `-ctx-menu" class="context-menu" style="display: none;"></div>
        `)

        $("#" + id + "-ctx-menu").append(elements)
        $("#" + id + "-ctx-menu").children().last().addClass("lastItem")
        $("#" + id + "-ctx-menu").on("mouseleave", function(e){
            $("#" + id + "-ctx-menu").css("display", "none")
        })
        $("#" + id + "-ctx-menu").on("contextmenu", function(e){
            e.stopPropagation()
        })

        $("#" + id + "-ctx-menu").children().each((i, element) => {
            if($(element).attr("listener")) return
            $(element).attr("listener", "true")
            $(element).click(() => {
                event(i, clicked)
                $("#" + id + "-ctx-menu").css("display", "none")
            })
        })

        $(name).on("contextmenu", function(e){
            e.preventDefault()
            e.stopPropagation()
            if(blocked){
                for (let i = 0; i < blocked.length; i++) {
                    const element = blocked[i];
                    if(e.target.classList.contains(element)){
                        return
                    }
                }
            }

            const {clientX: mouseX, clientY: mouseY} = e

            $("#" + id + "-ctx-menu").css("top", mouseY + "px")
            $("#" + id + "-ctx-menu").css("left", mouseX + 10 + "px")
            $("#" + id + "-ctx-menu").css("display", "block")
            clicked = e.target
        })
    }
    /**
     * update a context menu by its name and id and optional provide a list of elements that are blocked
     * @param {string} name the selector for the context menu, so its open when the element with the same name (selector) got right clicked
     * @param {string} id the id or name of the contextmenu, which is used for removing the contextmenu
     * @param {Array<string>} blocked the list of blocked elements that cannot trigger the contextmenu
     */
    updateCtxMenu(name, id, blocked){
        $(name).on("contextmenu", function(e){
            e.preventDefault()
            e.stopPropagation()
            if(blocked){
                for (let i = 0; i < blocked.length; i++) {
                    const element = blocked[i];
                    if(e.target.classList.contains(element)){
                        return
                    }
                }
            }

            const {clientX: mouseX, clientY: mouseY} = e

            $("#" + id + "-ctx-menu").css("top", mouseY - 20 + "px")
            $("#" + id + "-ctx-menu").css("left", mouseX - 20 + "px")
            $("#" + id + "-ctx-menu").css("display", "block")
            clicked = e.target
        })
    }
    /**
     * remove a created context menu by its id
     * @param {string} id 
     */
    removeCtxMenu(id){
        $("#" + id + "-ctx-menu").remove()
    }

    elementClicked(element){
        this.openTools()
    }

    toggleTools(){
        if($("#tools").css("display") == "none"){
            $("#tools").css("display", "flex")
            $("#menu").css("display", "none")
            this.disableScroll()
        }
        else{
            $("#tools").css("display", "none")
            this.enableScroll()
        }
    }

    toggleMenu(){
        if($("#menu").css("display") == "none"){
            $("#menu").css("display", "flex")
            $("#tools").css("display", "none")
            this.disableScroll()
        }
        else{
            $("#menu").css("display", "none")
            this.enableScroll()
        }
    }

    openTools(){
        $("#tools").css("display", "flex")
        $("#menu").css("display", "none")
        this.disableScroll()
    }
    
    openMenu(){
        $("#menu").css("display", "flex")
        $("#tools").css("display", "none")
        this.disableScroll()
    }

    dragElement(elmnt){
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
        if (document.getElementById(elmnt.id + "header")) {
          // if present, the header is where you move the DIV from:
          document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown
        } else {
          // otherwise, move the DIV from anywhere inside the DIV:
          elmnt.onmousedown = dragMouseDown
        }
      
        function dragMouseDown(e) {
          e = e || window.event
          e.preventDefault()
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag
        }
      
        function elementDrag(e) {
          e = e || window.event
          e.preventDefault()
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX
          pos2 = pos4 - e.clientY
          pos3 = e.clientX
          pos4 = e.clientY
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px"
          //elmnt.style.left = (elmnt.offsetLeft - pos1) + "px"
        }
      
        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null
          document.onmousemove = null
        }
    }

    menuBtnCtxMenu(index, element){
        if(index == 0){
            $(element).css("top", "10px")
        }
    }
      
}