export const getDataAttr = (element, name) => {
  return element.getAttribute("data-" + name) || null;
};

export const getDataAttrs = (element) => {
  let datas = {};
  for (let i = 0; i < element.attributes.length; i++) {
    let attribute = element.attributes[i];
    if (attribute.name.match(/^data-/)) {
      datas[attribute.name] = attribute.value || null;
    }
  }
  return datas;
}

