var CSSSetHooks = {},
    CSSGetHooks = {};


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


function parseCSS(string, obj) {
    if (!obj) obj = []
    if (!string) return obj;
    if (string.charAt(0) === '"') {
        var match = string.match(/("(?:[^"\\]|\\.)*")(?: (.*))?/);
        obj.push([3, match[1]]);
        parseCSS(match[2], obj);
    } else if (string.charAt(0) === "'") {
        var match = string.match(/('(?:[^'\\]|\\.)*')(?: (.*))?/);
        obj.push([3, match[1]]);
        parseCSS(match[2], obj);
    } else {
        var number = string.match(/^([0-9\.]*)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|s|ms)?(?: (.*))?/);
        if (number[1]) { // number
            obj.push([0, parseFloat(number[1]), number[2] || '']);
            parseCSS(number[3], obj);
        } else {
            var func = string.match(/^([a-z\-]*?)\(([^\)]*)\)(?: (.*))?/)

            if (func && func[1]) {

                if (func[1] === 'rgb') {
                    obj.push([2, func[2].split(',').map((arg) => {
                        return parseInt(arg);
                    })]);
                } else {
                    var args = func[2].split(',').map((arg) => {
                        return parseCSS(arg);
                    });
                    obj.push([1, func[1], args]);
                }
                parseCSS(func[3], obj);
            } else {

                if (string.charAt(0) === '#') {
                    var results = string.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})(?: (.*))?/);
                    obj.push([2, hexToRgb(results[1])]);

                    parseCSS(results[2], obj);
                } else {
                    var res = string.match(/^([a-z\-]*?)(?: (.*))/);
                    if (res && res[1]) {
                        if (Colors[res[1]]) {
                            obj.push([2, Colors[res[1]].slice(0)])
                        } else {
                            obj.push([3, res[1]]);
                        }
                        parseCSS(res[2], obj);
                    } else {
                        if (Colors[string]) {
                            obj.push([2, Colors[string].slice(0)])
                        } else {
                            obj.push([3, string]);
                        }
                    }
                }
            }
        }
    }
    return obj;
}

function buildCSS(obj) {
    var out = [];

    function recurse(arr) {

        arr.forEach((property) => {
            switch (property[0]) {
                case 0:
                    out.push(property[1], property[2], ' ')
                    break;
                case 1:
                    out.push(property[1], '(');
                    property[2].forEach((prop, i) => {
                        if (i !== 0) out.push(',');
                        recurse(prop);
                    })
                    out.push(')', ' ');
                    break;
                case 2:
                    out.push('rgb(');
                    property[1].forEach((prop, i) => {
                        if (i !== 0) out.push(',');
                        out.push(prop);
                    })
                    out.push(')', ' ');
                    break;
                case 3:
                    out.push(property[1], ' ');
                    break;
            }
        })
    }
    recurse(obj)
    out.pop();
    return out.join('')
}

function operate(value, value2, operator) {
    switch (operator) {
        case '+':
            return value + value2;
            break;
        case '-':
            return value - value2;
            break;
        case '*':
            return value * value2;
            break;
        case '/':
            return value / value2;
            break;
        case '^':
            return Math.pow(value, value2);
            break;
        default:
            return value;
            break;
    }

}

function operateCSS(css1, css2, operator) {
    for (var i = 0; i < css2.length; ++i) {
        if (!css1[i]) throw 'Fail';
        switch (css2[i][0]) {

            case 0: // number
                css1[i][1] = operate(css1[i][1], css2[i][1], operator);
                break;
            case 1: // function
                operateCSS(css1[i][2], css2[i][2], operator);
                break;
            case 2: // color
                css2[i][1].forEach((prop, ind) => {
                    css1[i][1][ind] = parseInt(operate(css1[i][1][ind], prop, operator))
                })
                break;
            case 3: // string

                break;
        }
    }
}

function setUnitsCSS(css1, css2) {
    for (var i = 0; i < css2.length; ++i) {
        if (!css1[i]) {
            css1[i] = css2[i].slice(0);
            continue;
        }
        switch (css2[i][0]) {
            case 0: // number
                if (css2[i][2])
                    css1[i][2] = css2[i][2];
                break;
            case 1: // function
                setUnitsCSS(css1[i][2], css2[i][2]);
                break;
        }
    }
}

function setDiffCSS(css1, css2) {
    for (var i = 0; i < css2.length; ++i) {
        if (!css1[i]) throw "Fail";
        switch (css2[i][0]) {
            case 0: // number
                css1[i][3] = css2[i][1] - css1[i][1];
                break;
            case 2: // color
                css1[i][2] = [];
                css2[i][1].forEach((prop, ind) => {
                    css1[i][2][ind] = prop - css1[i][1][ind];
                })
                break;
            case 1: // function
                setDiffCSS(css1[i][2], css2[i][2]);
                break;
        }
    }
}

function setCSSFrac(item, property, fraction) {
    var out = [];

    function recurse(arr) {
        arr.forEach((property) => {
            switch (property[0]) {
                case 0:
                    out.push(property[1] + property[3] * fraction, property[2], ' ')
                    break;
                case 1:
                    out.push(property[1], '(');
                    property[2].forEach((prop, i) => {
                        if (i !== 0) out.push(',');
                        recurse(prop);
                    })
                    out.push(')', ' ');
                    break;
                case 2:
                    out.push('rgb(');
                    property[1].forEach((prop, i) => {
                        if (i !== 0) out.push(',');
                        out.push(parseInt(prop + property[2][i] * fraction));
                    })
                    out.push(')', ' ');
                    break;
                case 3:
                    out.push(property[1], ' ');
                    break;
            }
        })
    }
    recurse(property.originalValue)
    out.pop();

    setProperty(item.element, property, out.join(''));

}
