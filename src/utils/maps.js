export function convertToMap(d){
    const dm = new Map([])
    for(var key of Object.keys(d)){
        const value = d[key]
        if (!(typeof(key) === 'string'))
            continue
        if (typeof(value) === 'string'){
            dm.set(key, value)
        }
        else{
            dm.set(key, convertToMap(value))
        }
    }
    return dm
}

export function update(d, ed, overwrite, clone){

    const assign = (d, key, value) => {
        if (value instanceof Map){
            const map = new Map([])
            //we deep-clone the map
            update(map, value, true, false)
            d.set(key, map)
        } else
            d.set(key, value)
    }

    if (!(ed instanceof Map) || !(d instanceof Map))
        throw "Parameters are not maps!"
    if (overwrite === undefined)
        overwrite = true
    if (clone === undefined)
        clone = false
    if (clone)
        d = new d.constructor(d)
    for(let key of ed.keys()){
        let value = ed.get(key)
        let dvalue = d.get(key)
        if (!d.has(key)){
            assign(d, key, value)
        }
        else if (value instanceof Map && dvalue instanceof Map){
            d.set(key, update(dvalue, value, overwrite, clone))
        }
        else {
            if (!overwrite)
                continue
            assign(d, key, value)
        }
    }
    return d
}
