export type ModifyHandler = {
    onopentag?(name: string, attribs: {
        [s: string]: string;
    }, isImplied: boolean): {
        name: string;
        attribs: {
            [s: string]: string;
        };
    };
    onclosetag?(name: string, isImplied: boolean): {
        name: string;
    };
    ontext?(data: string): {
        data: string;
    };
    oncomment?(data: string): {
        data: string;
    };
};
export declare function modifyHtml(htmlText: string, modifyHandler: ModifyHandler): Promise<string>;
