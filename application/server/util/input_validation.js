export const cleanXXS = (input) => {
    let clean = input
    clean = clean.replace(/</gi, '&lt')
    clean = clean.replace(/>/gi, '&gt')
    clean = clean.replace(/&/gi, '&amp')
    clean = clean.replace(/"/gi, '&quot')
    clean = clean.replace(/'/gi, '&apos')
    return clean
}