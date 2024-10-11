window.isMobile = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera)
    return check
}
$(document).ready(function(){
    $("body").prepend(`
        <header>
            <span class="left">
                <span onclick="openSite('/')" class="title"><p><span class="bi bi-boxes"></span> Sketchy Studio</p></span>
            </span>
            <span class="right">
                <span class="bi bi-list" onclick="toggleOffcanvas()"></span>
            </span>
        </header> 

        <div class="coffcanvas" style="display: none;">
            <div class="content">
                <div class="top">
                    <h2>Menu</h2>
                    <span class="bi bi-x-lg" onclick="toggleOffcanvas()"></span>
                </div>
                <div class="options">
                    <div>
                        <h3>Links</h3>
                        <div class="links">
                            
                        </div>
                    </div>
                </div>
            </div>
            <div class="background"></div>
        </div>
    `)

    window.addEventListener("scroll", () => {
        if(window.scrollY > 150){
            $("header").addClass("header-scrolling")
        }
        else if($("header").hasClass("header-scrolling")){
           $("header").removeClass("header-scrolling")
        }
    })

    // disable spellcheck and autocomplete attributes for input fields
    const inputs = $("input").map(function(){return this}).get()
    for (let i = 0; i < inputs.length; i++) {
        const element = $(inputs[i]);
        element.attr("spellcheck", "false")
        element.attr("autocomplete", "off")
    }

    // input fields with a clickable eye on the right side to view input of password input fields
    const inputViewables = $(".input-viewable").map(function(){return this}).get()
    for (let i = 0; i < inputViewables.length; i++) {
        const element = $(inputViewables[i]);
        const button = element.children().last()
        const input = element.children().first()
        button.click(function(){
            if(input.attr("type") == "password"){
                button.children().first().removeClass("bi-eye")
                button.children().first().addClass("bi-eye-slash")
                input.attr("type", "text")
            }
            else{
                button.children().first().removeClass("bi-eye-slash")
                button.children().first().addClass("bi-eye")
                input.attr("type", "password")
            }
        })
    }
})
function toggleOffcanvas(){
    if($(".coffcanvas").css("display") == "none"){
        $(".coffcanvas").css("display", "flex")
        disableScroll()
    }
    else{
        $(".coffcanvas").css("display", "none")
        ennableScroll()
    }
}
function disableScroll(){
    $("body").css("overflow", "hidden")
    $("body").css("height", "100%")
}
function ennableScroll(){
    $("body").css("overflow", "auto")
    $("body").css("height", "fit-content")
}
function openSite(href, target){
    if(target) open(href, target)
    else open(href, "_self")
}
// fetch information from the backend with the GET method and return the data of the response
/**
 * fetch information from the backend with the GET method and return the data of the response
 * @param {string} url the url to fetch the data from
 * @param {boolean} raw used to get the complete response
 * @param {boolean} log used to disable the log
 * @returns {Promise<JSON> | Promise<string>}
 */
function get(url){
    return new Promise(async cb => {
        const response = await fetch(url)
        const result = await response.json()
        console.log("get:", url, "response:", result)
        cb(result.data)
    })
}
// fetch information from the backend with the GET method and return the complete response
function get(url, raw){
    return new Promise(async cb => {
        const response = await fetch(url)
        const result = await response.json()
        console.log("get:", url, "response:", result)
        if(raw) cb(result)
        else cb(result.data)   
    })
}
// fetch information from the backend with the GET method and return the complete response but only log it when "log" was set to true
function get(url, raw, log){
    return new Promise(async cb => {
        const response = await fetch(url)
        const result = await response.json()
        if(log) console.log("get:", url, "response:", result)
        if(raw) cb(result)
        else cb(result.data)   
    })
}
// fetch information from or to the backend with the POST method and return the data of the response
/**
 * fetch information from or to the backend with the POST method and return the data of the response
 * @param {string} url the url to fetch the data from
 * @param {boolean} raw used to get the complete response
 * @param {boolean} log used to disable the log
 * @returns {Promise<JSON> | Promise<string>}
 */
function send(url, data){
    return new Promise(async cb => {
        const response = await fetch(url, {method: "post", body: JSON.stringify(data), headers: {"Content-Type": "application/json"}})
        const result = await response.json()
        console.log("send:", url, "response:", result)
        cb(result.data)
    })
}
// fetch information from or to the backend with the POST method and return the complete response
function send(url, data, raw){
    return new Promise(async cb => {
        const response = await fetch(url, {method: "post", body: JSON.stringify(data), headers: {"Content-Type": "application/json"}})
        const result = await response.json()
        console.log("send:", url, "response:", result)
        if(raw) cb(result)
        else cb(result.data)
    })
}
// fetch information from or to the backend with the POST method and return the complete response but only log it when "log" was set to true
function send(url, data, raw, log){
    return new Promise(async cb => {
        const response = await fetch(url, {method: "post", body: JSON.stringify(data), headers: {"Content-Type": "application/json"}})
        const result = await response.json()
        if(log) console.log("send:", url, "response:", result)
        if(raw) cb(result)
        else cb(result.data)
    })
}
// create an notification in the bottom right and call a callback when it was clicked
/**
 * creates a notification in the bottom right with a ```title```, ```message``` and ```type```. You also need to define a callback that is called when the notification is clicked
 * @param {string} title the headline of the notification
 * @param {string} message the description of the notification
 * @param {string} type the type of the notification as ```CSS```
 * @param {function} cb the callback of the notification, that is triggerd when the notification is clicked
 * @param {boolean} hideFromCenter to specify wether the notification should be added to the notification center on the top left at the bell icon
 * @returns 
 */
async function notifyCb(title, message, type, cb, hideFromCenter){
    let duration = (1000 * 7) + 1000
    const element = $(document.createElement("div")).addClass("notification").addClass(type)
    element.append($(document.createElement("div")).append($(document.createElement("h3")).html(title)).append($(document.createElement("p")).html(message)))
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
// create an notification in the bottom right
/**
 * creates a notification in the bottom right with a ```title```, ```message``` and ```type```
 * @param {string} title the headline of the notification
 * @param {string} message the description of the notification
 * @param {string} type the type of the notification as ```CSS```
 * @param {boolean} hideFromCenter to specify wether the notification should be added to the notification center on the top left at the bell icon
 * @returns 
 */
async function notify(title, message, type, hideFromCenter){
    let duration = (1000 * 7) + 1000
    const element = $(document.createElement("div")).addClass("notification").addClass(type)
    element.append($(document.createElement("div")).append($(document.createElement("h3")).html(title)).append($(document.createElement("p")).html(message)))
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
// create an notification in the bottom right with a specified duration and call a callback when it was clicked
async function notifyCb(title, message, type, duration, cb, hideFromCenter){
    let finalDuration = (1000 * 7) + 1000
    if(duration) finalDuration = duration
    const element = $(document.createElement("div")).addClass("notification").addClass(type)
    element.append($(document.createElement("div")).append($(document.createElement("h3")).html(title)).append($(document.createElement("p")).html(message)))
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

// create an notification in the bottom right with a specified duration
/**
 * creates a notification in the bottom right with a ```title```, ```message``` and ```type```
 * @param {string} title the headline of the notification
 * @param {string} message the description of the notification
 * @param {string} type the type of the notification as ```CSS```
*  @param {number} duration the duration of the notification before its removed
 * @param {boolean} hideFromCenter to specify wether the notification should be added to the notification center on the top left at the bell icon
 * @returns 
 */
async function notify(title, message, type, duration, hideFromCenter){
    let finalDuration = (1000 * 7) + 1000
    if(duration) finalDuration = duration
    const element = $(document.createElement("div")).addClass("notification").addClass(type)
    element.append($(document.createElement("div")).append($(document.createElement("h3")).html(title)).append($(document.createElement("p")).html(message)))
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
function createDialog(title, message, elements, width, height){
    const id = title + "-dialog"
    const headline = $(document.createElement("uh1")).html(title)
    const description = $(document.createElement("p")).html(message)
    const content = $(document.createElement("div")).addClass("content").append([headline, description, elements])
    if(width) content.css("width", width + "px")
    if(height) content.css("height", height + "px")
    const background = $(document.createElement("div")).addClass("background")
    const dialog = $(document.createElement("div")).attr("id", id).addClass("dialog").append([background, content])
    $("body").prepend(dialog)
    disableScroll()
    return "#" + id
}
/**
 * removes a dialog with a specific ```id```
 * @param {string} id the id of the dialog to remove
 */
function removeDialog(id){
    enableScroll()
    $(id).remove()
}