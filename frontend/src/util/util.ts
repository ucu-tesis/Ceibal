export const isNullOrEmpty = (str: string | undefined) => {
    return !str || str.length === 0
}