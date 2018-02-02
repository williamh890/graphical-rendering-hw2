class TextParser {
    readonly lines: Array<string[]> = [];

    constructor(data: string) {
        // split using regex any sequence of 1 or more newlines or carriage returns
        let lines = data.split(/[\n\r]+/);
        for (let line of lines) {
            let unfilteredTokens = line.split(/\s+/);
            let tokens: string[] = [];
            for (let t of unfilteredTokens) {
                if (t.length > 0) {
                    if (t[0] != '#') {
                        tokens.push(t);
                    }
                }
            }
            if (tokens.length == 0) {
                continue;
            }

            this.lines.push(tokens);
        }
    }
}
