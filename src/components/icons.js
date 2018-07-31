import React from 'react'

export const Close = ({t, ns}) => {
    return <svg
        role="img"
        class={ns('CloseIcon')}
        aria-label={t(['close'])}
        width="12"
        height="12"
        viewPort="0 0 12 12"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>{t(['close'])}</title>
        <line x1="1" y1="11" x2="11" y2="1" stroke-width="1" />
        <line x1="1" y1="1" x2="11" y2="11" stroke-width="1" />
    </svg>
}