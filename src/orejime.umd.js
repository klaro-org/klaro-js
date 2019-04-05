import './scss/orejime.scss';
import Orejime from './orejime';

function initDefaultInstance() {
    if (window.orejimeConfig !== undefined
        // `window.orejime instanceof Element` means there is a #orejime div in the dom
        && (window.orejime === undefined || window.orejime instanceof Element)
    ) {
        window.orejime = Orejime.init(window.orejimeConfig)
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDefaultInstance)
} else {
    initDefaultInstance();
}

export default Orejime;
