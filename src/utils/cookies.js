
export function getCookies(){
    const cookieStrings = document.cookie.split(";")
    const cookies = []
    const regex = new RegExp('^\\s*([^=]+)\\s*=\\s*(.*?)$')
    for(let i=0;i<cookieStrings.length;i++){
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
    for(let i=0;i<cookies.length;i++){
        if (cookies[i].name === name)
            return cookies[i]
    }
    return null
}


//https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
export function setCookie(name, value, days, domain) {
    let expires = ""
    if (days) {
        const date = new Date()
        date.setTime(date.getTime() + (days*24*60*60*1000))
        expires = "; expires=" + date.toUTCString()
    }
    if (domain !== undefined) {
        expires += '; domain=' + domain
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function deleteCookie(name, path, domain) {
    let str = name+'=; Max-Age=-99999999;'
    // try to delete the cookie without any path and domain
    document.cookie = str
    str += ' path='+(path || '/')+';'
    // try to delete the cookie with path
    document.cookie = str
    if (domain !== undefined) {
        str += ' domain='+domain+';'
        // try to delete the cookie with domain and path
        document.cookie = str
    }
}
