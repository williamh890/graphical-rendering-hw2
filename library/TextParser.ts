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

    static ParseIdentifier(tokens: string[]): string {
        if (tokens.length >= 2)
            return tokens[1].replace(/[^\w]+/, "_");
        return "unknown";
    }

    static ParseVector(tokens: string[]): Vector3 {
        let x: number = (tokens.length >= 2) ? parseInt(tokens[1]) : 0.0;
        let y: number = (tokens.length >= 3) ? parseInt(tokens[2]) : 0.0;
        let z: number = (tokens.length >= 4) ? parseInt(tokens[3]) : 0.0;
        return new Vector3(x, y, z);
    }

    static ParseFaceIndices(token: string): Array<number> {
        let indices: Array<number> = [0, 0, 0];
        let tokens = token.split("/");
        if (tokens.length >= 1) {
            indices[0] = parseInt(tokens[0]);
        }
        if (tokens.length == 2) {
            indices[2] = parseInt(tokens[1]);
        } else if (tokens.length == 3) {
            indices[1] = parseInt(tokens[1]);
            indices[2] = parseInt(tokens[2]);
        }
        return indices;
    }

    static ParseFace(tokens: string[]): number[] {
        let indices: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (tokens.length < 4) {
            return indices;
        }
        let v1: Array<number> = TextParser.ParseFaceIndices(tokens[1]);
        let v2: Array<number> = TextParser.ParseFaceIndices(tokens[2]);
        let v3: Array<number> = TextParser.ParseFaceIndices(tokens[3]);

        return [...v1, ...v2, ...v3];
    }
}
