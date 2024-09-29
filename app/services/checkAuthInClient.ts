
export const setCookieInClient = async (name: string, value: string, days: number) => {
    // Cria a data de expiração para o cookie
    let expires = "";
    if (days) {
        const date = new Date();
        // Define o tempo de expiração em dias
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }

    // Define o cookie com o nome, valor e expiração
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
    return checkAuthInClient(name);
}

export const checkAuthInClient = async (name: string) => {
    var cookieData = cookiesInClient(name);
    if (!cookieData || cookieData?.length <= 0) {
        return null;
    }
    return cookieData;
}

export const cookiesInClient = (name: string) => {
    // Adiciona um padrão para buscar o cookie pelo nome
    const cookieName = name + "=";
    // Decodifica os cookies disponíveis e os separa
    const decodedCookies = decodeURIComponent(document.cookie).split(';');

    // Itera por cada cookie buscando o nome desejado
    for (let i = 0; i < decodedCookies?.length; i++) {
        let cookie = decodedCookies[i].trim();

        // Verifica se o cookie começa com o nome buscado
        if (cookie.indexOf(cookieName) === 0) {
            // Retorna o valor do cookie encontrado
            return cookie.substring(cookieName?.length, cookie?.length);
        }
    }

    // Retorna null se o cookie não for encontrado
    return null;
}

