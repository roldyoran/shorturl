// const para generar un codigo aleatorio para la short_url
export const generateRandomCode = () => {
   const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let code = '';
   for (let i = 0; i < 9; i++) {
      code += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
   }
   return code;
};
