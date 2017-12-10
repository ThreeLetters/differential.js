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
