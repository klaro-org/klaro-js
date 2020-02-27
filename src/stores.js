import {getCookie, setCookie, deleteCookie} from 'utils/cookies'

export class CookieStore {
    constructor(manager) {
        this.cookieName = manager.cookieName
        this.cookieDomain = manager.cookieDomain
        this.cookieExpiresAfterDays = manager.cookieExpiresAfterDays
    }

    get() {
        const cookie = getCookie(this.cookieName);
        return cookie
            ? cookie.value
            : null;
    }

    set(value) {
        return setCookie(this.cookieName, value, this.cookieExpiresAfterDays, this.cookieDomain)
    }

    delete() {
        return deleteCookie(this.cookieName);
    }
}

export class LocalStorageStore {
    constructor(manager) {
        this.key = manager.cookieName;
    }

    get() {
        return localStorage.getItem(this.key);
    }

    set(value) {
        return localStorage.setItem(this.key, value)
    }

    delete() {
        return localStorage.removeItem(this.key);
    }
}

const stores = {
    'cookie': CookieStore,
    'localStorage': LocalStorageStore
}

export default stores
