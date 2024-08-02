import "dotenv/config";

let prefix = "!";

function changePrefix(newPrefix: string) {
    prefix = newPrefix;
}

function currentPrefix(): string | undefined {
    return prefix;
}

export { currentPrefix, changePrefix };
