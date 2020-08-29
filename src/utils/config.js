export function getPurposes(config){
    const purposes = new Set([])
    for(let i=0;i<config.apps.length;i++){
        const appPurposes = config.apps[i].purposes || []
        for(let j=0;j<appPurposes.length;j++)
            purposes.add(appPurposes[j])
    }
    return Array.from(purposes)
}

export function update(ed, d, overwrite){
  if (overwrite === undefined)
      overwrite = true
  let keys = Object.keys(d);
  for(var i=0;i<keys.length;i++){
    let key = keys[i]
    let vd = d[key]
    let ved = ed[key]
    if (typeof vd === "string"){
      if (overwrite || ved === undefined)
        ed[key] = vd
    }
    else if (typeof vd === "object") {
      if (typeof ved === "object"){
        update(ved, vd, overwrite)
      } else if (overwrite || ved === undefined) {
        ed[key] = vd
      }
    }
  }
  return ed
}
