// get one data-attribute by name
export const getDataAttr = (element, name) => {
    return element.getAttribute("data-" + name) || null;
};

// get all data-attributes
export const getDataAttrs = (element) => {
    let datas = {};
    for (let i = 0, l = element.attributes.length; i < l; i++) {
        let attribute = element.attributes[i];
        if (attribute.name.match(/^data-/)) {
            datas[attribute.name.replace(/^data-/, "")] = attribute.value || null;
        }
    }
    return datas;
}

// set data-atribute if value not undefined, else remove data-attribute
export const setDataAttr = (element, name, value) => {
    if (value === undefined) {
        element.removeAttribute("data-" + name);
    }
    else {
        element.setAttribute("data-" + name, value);
    }
}
