import {getCookie, setCookie, deleteCookie} from 'utils/cookies'

export class CookieStore {
    constructor(manager) {
        this.cookieName = manager.storageName
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

class StorageStore {
    constructor(manager, handle) {
        this.key = manager.storageName;
        this.handle = handle
    }

    get() {
        return this.handle.getItem(this.key);
    }

    getWithKey(key) {
        return this.handle.getItem(key);
    }

    set(value) {
        return this.handle.setItem(this.key, value)
    }

    setWithKey(key, value) {
        return this.handle.setItem(key, value)
    }

    delete() {
        return this.handle.removeItem(this.key);
    }

    deleteWithKey(key) {
        return this.handle.removeItem(key);
    }
}

export class LocalStorageStore extends StorageStore {
    constructor(manager){
        super(manager, localStorage)
    }
}

export class SessionStorageStore extends StorageStore {
    constructor(manager){
        super(manager, sessionStorage)
    }
}

const stores = {
    'cookie': CookieStore,
    'localStorage': LocalStorageStore,
    'sessionStorage': SessionStorageStore,
}

export default stores
