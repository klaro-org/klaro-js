import React from "react";
import { RetractingLabelInput } from './input';

export const CookieForm = ({updateConfig, config, cookie, t}) => {
    const updateCookieConfig = (key, value) => {
        updateConfig(['services', config._id, 'cookies', cookie._id, ...key], value)
    }
    const fields = ['pattern', 'path', 'domain'].map(key => <RetractingLabelInput key={key} t={t} field={{name: key}} config={cookie} prefix={['cookies']} updateConfig={updateCookieConfig} /> )
    return <div className="cm-cookie-form">
        <fieldset>
            {fields}
        </fieldset>
        <div className="cm-config-controls">
            <div className="cm-control">

            </div>
            <button className="cm-control-button cm-delete" onClick={() => updateConfig(['services', config._id, 'cookies', cookie._id], null)}>
                {t(['cookies', 'delete'])}
            </button>
        </div>
    </div>
}

export const Cookies = ({t,
    field,
    config,
    className,
    updateConfig,
    ...props
}) => {
    let cookies = config.cookies.map(cookie => <CookieForm t={t} config={config} key={cookie._id} cookie={cookie} updateConfig={updateConfig} />)
    if (cookies.length === 0)
        cookies = <p className="cm-no-cookies">{t(['cookies','noCookies'])}</p>
    return <div className="cm-cookie-config">
        <h3>{t(['cookies', 'title'])}</h3>
        <div className="cm-cookie-forms">
            {cookies}
        </div>
        <div className="cm-config-controls">
            <fieldset>
                <button className="cm-control-button" onClick={() => updateConfig(['services', config._id, 'cookies', null], {})}>
                    {t(['cookies', 'add'])}
                </button>
            </fieldset>
        </div>

    </div>
}