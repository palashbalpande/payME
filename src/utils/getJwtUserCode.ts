export const getJwtUserCode = (jwtUserCode: string): string => {
    const value = process.env[jwtUserCode];
    if(!value) {
        throw new Error(`Environment variable ${jwtUserCode} is not defined`);
    }
    return value;
}