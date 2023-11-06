import { Parser } from "htmlparser2";

export type ModifyHandler = {
  onopentag?(
    name: string,
    attribs: { [s: string]: string },
    isImplied: boolean
  ): {
    name: string;
    attribs: { [s: string]: string };
  };

  onclosetag?(
    name: string,
    isImplied: boolean
  ): {
    name: string;
  };

  ontext?(data: string): {
    data: string;
  };

  oncomment?(data: string): {
    data: string;
    clearComment?: boolean; // 默认为： false
  };
};

export function modifyHtml(htmlText: string, modifyHandler: ModifyHandler) {
  return new Promise<string>((resolve, reject) => {
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
          const res = modifyHandler.onopentag(
            name,
            JSON.parse(JSON.stringify(attribs)),
            isImplied
          );
          name = res.name;
          attribs = res.attribs;
        }
        htmlTextCopy += `<${name}`;
        htmlTextCopy += Object.entries(attribs).reduce((sum, next) => {
          sum += " ";
          if (next[1] === "" || next[1] == null) {
            sum += next[0];
          } else {
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
          const { data: content, clearComment } = modifyHandler.oncomment(data);
          htmlTextCopy += clearComment ? content : `<!--${content}-->`;
        } else {
          htmlTextCopy += `<!--${data}-->`;
        }
      },
    });
    parser.write(htmlText);
    parser.end();
  });
}
