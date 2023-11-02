import { Parser } from "htmlparser2";
export function modifyHtml(htmlText, modifyHandler) {
    return new Promise((resolve, reject) => {
        let htmlTextCopy = "";
        const parser = new Parser({
            onend() {
                resolve(htmlTextCopy);
            },
            onerror(error) {
                reject(error);
            },
            onopentag(name, attribs, isImplied) {
                if (modifyHandler.onopentag) {
                    const res = modifyHandler.onopentag(name, JSON.parse(JSON.stringify(attribs)), isImplied);
                    name = res.name;
                    attribs = res.attribs;
                }
                htmlTextCopy += `<${name}`;
                htmlTextCopy += Object.entries(attribs).reduce((sum, next) => {
                    sum += " ";
                    if (next[1] === "" || next[1] == null) {
                        sum += next[0];
                    }
                    else {
                        sum += `${next[0]}="${next[1]}"`;
                    }
                    return sum;
                }, "");
                htmlTextCopy += ">";
            },
            onclosetag(name, isImplied) {
                if (modifyHandler.onclosetag) {
                    const res = modifyHandler.onclosetag(name, isImplied);
                    name = res.name;
                }
                htmlTextCopy += isImplied ? "" : `</${name}>`;
            },
            ontext(data) {
                if (modifyHandler.ontext) {
                    const res = modifyHandler.ontext(data);
                    data = res.data;
                }
                htmlTextCopy += data;
            },
            oncomment(data) {
                if (modifyHandler.oncomment) {
                    const res = modifyHandler.oncomment(data);
                    data = res.data;
                }
                htmlTextCopy += `<!--${data}-->`;
            },
        });
        parser.write(htmlText);
        parser.end();
    });
}