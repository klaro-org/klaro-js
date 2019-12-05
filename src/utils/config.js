export function getPurposes(config){
    const purposes = new Set([])
    for (let i = 0, l = config.apps.length; i < l; i++) {
        const appPurposes = config.apps[i].purposes || []
        for (let j = 0, m = appPurposes.length; j < m; j++)
            purposes.add(appPurposes[j])
    }
    return Array.from(purposes)
}
