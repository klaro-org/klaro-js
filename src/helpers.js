import {tt} from 'i18n'

export function getPurposes(config){
    const purposes = new Set([])
    for(var i=0;i<config.apps.length;i++){
        const appPurposes = config.apps[i].purposes || []
        for(var j=0;j<appPurposes.length;j++)
            purposes.add(appPurposes[j])
    }
    return Array.from(purposes)
}

export function getPurposesNames(config){
    const purposes = getPurposes(config)
    const purposesNames = purposes.map((purpose) => {
        return tt([purpose], config.purposes)
    })
    return purposesNames
}

export function getCookies(){
    const cookieStrings = document.cookie.split(";")
    const cookies = []
    const regex = new RegExp('^([^=]+)\=(.*)$')
    for(var i=0;i<cookieStrings.length;i++){
        const cookieStr = cookieStrings[0]
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

export function eraseCookie(name) {
    setCookie(name,"",-1)
}


