import { cookies } from 'next/headers'

export const getAuth = () => {
    const cookieStore = cookies();
    const authToken = cookieStore.get('athtk');
    if (!authToken || authToken.value?.length <= 0) {
        return null;
    }
    return authToken.value;
}
