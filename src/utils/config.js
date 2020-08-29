export function getPurposes(config){
    const purposes = new Set([])
    for(let i=0;i<config.apps.length;i++){
        const appPurposes = config.apps[i].purposes || []
        for(let j=0;j<appPurposes.length;j++)
            purposes.add(appPurposes[j])
    }
    return Array.from(purposes)
}

export function merge(d, ed){
  let keys = Object.keys(d);
  for(var i=0;i<keys.length;i++){
    let key = keys[i]
    let vd = d[key]
    let ved = ed[key]
    if (typeof vd === "string"){
      ed[key] = vd
    }
    else if (typeof vd === "object") {
      if (typeof ved === "object"){
        merge(vd, ved)
      }
      else{
        ed[key] = vd
      }
    }
  }
  return ed
}
