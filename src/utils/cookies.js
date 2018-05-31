
export function getCookies(){
    const cookieStrings = document.cookie.split(";")
    const cookies = []
    const regex = new RegExp('^\\s*([^=]+)\\s*\=\\s*(.*?)$')
    for(var i=0;i<cookieStrings.length;i++){
        const cookieStr = cookieStrings[i]
        const match = regex.exec(cookieStr)
        if (match === null)
            continue
        cookies.push({
            name: match[1],
            value: match[2],
        })
    }
    return cookies
}

export function getCookie(name) {
    const cookies = getCookies()
    for(var i=0;i<cookies.length;i++){
        if (cookies[i].name == name)
            return cookies[i]
    }
    return null
}


//https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
export function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function deleteCookie(name, path, domain) {
    let str = name+'=; Max-Age=-99999999;'
    if (path !== undefined)
        str += ' path='+path+';'
    if (domain !== undefined)
        str += ' domain='+domain+';'
    document.cookie = str
}