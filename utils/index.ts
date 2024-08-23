
// Internal logging
const red = "\x1b[31m";
const reset = "\x1b[0m";

export const dlog = () => {
    const stack = getStackInfo();
    const callerInfo = stack.slice(2).map(parseStackLine).find(info => info && info.functionName !== 'logFunctionName');
    console.log(`${red}zen:${reset} ${callerInfo?.fileName}:${callerInfo?.lineNumber}: ${callerInfo?.functionName}`);
}

function getStackInfo() {
    const error = new Error();
    return error.stack?.split('\n').slice(1) || [];
}


function parseStackLine(line: string) {
    const matched = line.match(/at (?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/);
    if (!matched) return null;

    return {
        functionName: matched[1] || '<anonymous>',
        fileName: matched[2] || '',
        lineNumber: matched[3] || '',
        columnNumber: matched[4] || '',
        isConstructor: /^new/.test(matched[1] || ''),
        isNative: (matched[5] || '').indexOf('native') >= 0,
        isToplevel: !matched[1] && !matched[2]
    };
}
