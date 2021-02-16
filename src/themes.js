
// Klaro themes that can be mixed & matched. Some of them change the position,
// others the color scheme. The `_meta` field contains data used e.g. by
// the configuration IDE to see which themes are mutually compatible.
export const themes = {
    top: {
        _meta: {
            incompatibleWith: ['bottom']
        },
        'notice-top': '20px',
        'notice-bottom': 'auto',
    },
    bottom: {
        _meta: {
            incompatibleWith: ['top']
        },
        'notice-bottom': '20px',
        'notice-top': 'auto',
    },
    left: {
        _meta: {
            incompatibleWith: ['wide']
        },
        'notice-left': '20px',
        'notice-right': 'auto',
    },
    right: {
        _meta: {
            incompatibleWith: ['wide']
        },
        'notice-right': '20px',
        'notice-left': 'auto',
    },
    wide: {
        // position the notice on the left screen edge
        'notice-left': '20px',
        'notice-right': 'auto',
        // make the notice span the entire screen
        'notice-max-width': 'calc(100vw - 60px)',
        'notice-position': 'fixed',
    },
    light: {
        'button-text-color': '#fff',
        'dark1': '#eee',
        'dark2': '#777',
        'dark3': '#555',
        'light1': '#444',
        'light2': '#666',
        'light3': '#111',
        'green3': '#f00',
    },
}
