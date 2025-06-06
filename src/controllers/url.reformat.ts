export const reformatUrl = (url: string): string => {
    // Eliminar espacios en blanco al principio y al final
    url = url.trim();

    // Asegurarse de que la URL comience con http:// o https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url; // Agregar http:// por defecto
    }

    // Reemplazar la ultima barra diagonal si existe
    if (url.endsWith('/')) {
        url = url.slice(0, -1); // Eliminar la última barra diagonal
    }

    return url;
};
