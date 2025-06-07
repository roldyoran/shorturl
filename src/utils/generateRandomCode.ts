export const generateRandomCode = (): string => {
    // Caracteres permitidos para generar el código
    const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    // Generar un código de 9 caracteres
    for (let i = 0; i < 9; i++) {
        code += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
    }

    return code;
};
