import React from 'react'

export default class AppItem extends React.Component {

    render(){
        const {checked, onToggle, name, title, description, t} = this.props
        const required = this.props.required || false
        const optOut = this.props.optOut || false
        const purposes = this.props.purposes || []
        const onChange = (e) => {
            onToggle(e.target.checked)
        }
        const id = `app-item-${name}`
        const purposesText = purposes.map((purpose) => t(['purposes', purpose])).join(", ")
        const optOutText = optOut ? <span class="cm-opt-out" title={t(['app', 'optOut', 'description'])}>{t(['app', 'optOut', 'title'])}</span> : ''
        const requiredText = required ? <span class="cm-required" title={t(['app', 'required', 'description'])}>{t(['app', 'required', 'title'])}</span> : ''

        return <div>
            <input id={id} class="cm-app-input" aria-describedby={`${id}-description`} disabled={required} checked={checked || required} type="checkbox" onChange={onChange} />
            <label for={id} class="cm-app-label" {...(required ? {tabIndex: "0"} : {})}>
                <span className="cm-app-title">{title}</span>{requiredText}{optOutText}
                <span className={"switch"+(required ? " disabled" : "")}>
                    <div className="slider round active"></div>
                </span>
            </label>
            <div id={`${id}-description`}>
                <p className="cm-app-description">{description || t([name, 'description'])}</p>
                <p className="purposes">{t(['app', purposes.length > 1 ? 'purposes' : 'purpose'])}: {purposesText}</p>
            </div>
        </div>
    }

}