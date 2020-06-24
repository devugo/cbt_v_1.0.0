export const numberFromString = (str) => {
    const matches = (str).match(/(\d+)/);
    return matches[0];
}