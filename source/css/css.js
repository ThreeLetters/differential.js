function getProperty(element, propData) {
    if (CSSGetHooks[propData.nameJS]) return CSSGetHooks[propData.nameJS](element, propData)
    if (element.style[propData.nameJS]) return element.style[propData.nameJS];
    var styles = window.getComputedStyle(element);
    return styles.getPropertyValue(propData.nameCSS);
}

function setProperty(element, propData, value) {
    if (CSSSetHooks[propData.nameJS]) {
        var dt = CSSSetHooks[propData.nameJS](element, propData, value);
        if (dt) element.style[dt[0]] = dt[1];
    } else {
        element.style[propData.nameJS] = value;
    }
    return;
}

function getCssString(property) {
    return property.replace(/[A-Z]/g, function (a) {
        return '-' + a.toLowerCase();
    });
}

function getJsString(name) {

    return name.split('-').map((n, i) => {
        if (i !== 0) return capitalizeFirstLetter(n);
        return n;
    }).join('');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
