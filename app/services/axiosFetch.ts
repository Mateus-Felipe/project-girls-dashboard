'use client'
import axios from "axios"
import { checkAuthInClient, setCookieInClient } from "./checkAuthInClient"

interface fetchProps {
    type: 'get' | 'post' | 'put' | 'delete'
    url?: string,
    body?: any
    addAuth?: boolean
    customHeaders?: any
    customUrl?: string
}

const axiosFetch = async ({ type, url, body, addAuth, customHeaders, customUrl }: fetchProps) => {

    var urlToRequest = customUrl ? customUrl : (process.env.DEV == 'true' ? 'http://localhost:3500' : 'https://ydrqpoqitg.execute-api.sa-east-1.amazonaws.com/dev') + url;
    if (!urlToRequest && !customUrl) {
        return {
            error: true,
            invalidToken: false,
            data: undefined
        }
    }

    var headers: any = {};
    if (customHeaders) {
        headers = { ...customHeaders }
    }
    var result: {
        error: boolean,
        invalidToken: boolean,
        data: any
    } = {
        error: false,
        invalidToken: false,
        data: undefined
    };

    if (addAuth) {
        var cookieData = await checkAuthInClient('athtk');
        if (!cookieData) {
            setCookieInClient('athtk', '', 999);
            return result = {
                error: true,
                invalidToken: true,
                data: {
                    message: 'Login expirado'
                }
            }
        }
        headers.authorization = `Bearer ${cookieData}`
    }

    if (type == 'get') {
        await axios.get(urlToRequest, {
            headers,
        }).then(resultRequest => result.data = resultRequest.data).catch(err => {
            console.log(err);
            var error = err;
            error.failed = true;

            result.invalidToken = err?.status == 401 ? true : false;
            result.data = error
            result.error = true
        });
    } else if (type == 'post') {
        await axios.post(urlToRequest, body, {
            headers,
        }).then(resultRequest => result.data = resultRequest.data).catch(err => {
            var error = err;
            error.failed = true;
            result.data = error;
            result.invalidToken = err?.status == 401 ? true : false;
            result.error = true
        });
    } else if (type == 'put') {
        await axios.put(urlToRequest, body, {
            headers,
        }).then(resultRequest => result.data = resultRequest.data).catch(err => {
            var error = err;
            error.failed = true;
            result.data = err;
            result.invalidToken = error?.status == 401 ? true : false;
            result.error = true
        });
    }

    return result;
}

export { axiosFetch };