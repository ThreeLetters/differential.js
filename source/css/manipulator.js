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
                if (css2[i][3] === false) css2[i][1] = 0;
                css2[i][1] = operate(css1[i][1], css2[i][1], operator);
                break;
            case 1: // function
                css2[i][2].forEach((prop, ind) => {
                    operateCSS(css1[i][2][ind], css2[i][2][ind], operator);
                });
                break;
            case 2: // color
                if (css2[i][2] === false) {
                    css2[i][1].forEach((prop, ind) => {
                        css2[i][1][ind] = parseInt(operate(0, prop, operator))
                    })
                } else {
                    css2[i][1].forEach((prop, ind) => {
                        css2[i][1][ind] = parseInt(operate(css1[i][1][ind], prop, operator))
                    })
                }
                break;
            case 3: // string

                break;
        }
    }
}

function setUnitsCSS(element, css1, css2) {
    for (var i = 0; i < css2.length; ++i) {
        if (!css1[i] || css1[i][0] !== css2[i][0]) {
            css1[i] = css2[i].slice(0);
            css1[i].push(false)
            continue;
        }
        switch (css2[i][0]) {
            case 0: // number
                if (css2[i][2]) {
                    if (!css1[i][2]) css1[i][2] = css2[i][2];
                    else if (css1[i][2] !== css2[i][2]) {
                        if (css2[i][2] === '%') {
                            css2[i][2] = css1[i][2];
                            css2[i][1] = css1[i][1] * (css2[i][1] / 100);
                        } else {
                            css1[i][1] = convertUnits(element, css1[i][1], css1[i][2], css2[i][2])
                            css1[i][2] = css2[i][2];
                        }
                    }

                }
                css1[i][2] = css2[i][2];
                break;
            case 1: // function
                css2[i][2].forEach((prop, ind) => {
                    if (!css1[i][2][ind]) css1[i][2][ind] = [];
                    setUnitsCSS(element, css1[i][2][ind], css2[i][2][ind]);
                });
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
                css2[i][2].forEach((prop, ind) => {
                    setDiffCSS(css1[i][2][ind], css2[i][2][ind]);
                });
                break;
            case 3: // string
                css1[i][1] = css2[i][1];
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
                        out.push(Math.floor(prop + property[2][i] * fraction));
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
