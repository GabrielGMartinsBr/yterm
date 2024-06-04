export function createScriptId() {
    return Math.floor(
        Date.now() / 1e3
    );
}
