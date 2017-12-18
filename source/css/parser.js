function splitSafe(str) {

    str = str.split('');
    var current = [];
    var out = [];
    var i = 0;
    var len = str.length;
    var char;
    var level = 0;

    function skip(match) {
        var backslash = false;
        for (++i; i < len; i++) {
            char = str[i];
            current.push(char);
            if (char === "\\") backslash = true;
            else if (char === match && !backslash) {
                break;
            } else if (backslash) {
                backslash = false;
            }
        }
    }

    for (i = 0; i < len; ++i) {
        char = str[i];
        current.push(char);
        if (char === '"' || char === "'") skip(char);
        else if (char === '(') {
            level++;
        } else if (char === ')') {
            level--;
            if (level < 0) throw 'Fail';
        } else if (level === 0 && char === ',') {
            current.pop();
            out.push(current.join(''))
            current = [];
        }
    }
    if (current.length) out.push(current.join(''))
    return out;
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
        var number = string.match(/^([0-9\.]*)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|s|ms|deg|grad|rad|turn|Q)?(?: (.*))?/);
        if (number[1]) { // number
            obj.push([0, parseFloat(number[1]), number[2] || '']);
            parseCSS(number[3], obj);
        } else {
            var func = string.match(/^([a-z\-]*?)\(([^\)]*)\)(?: (.*))?/)

            if (func && func[1]) {

                if (func[1] === 'rgb') {
                    obj.push([2, splitSafe(func[2]).map((arg) => {
                        return parseInt(arg);
                    })]);
                } else {
                    var args = splitSafe(func[2]).map((arg) => {
                        return parseCSS(arg.trim());
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
