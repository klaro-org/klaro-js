import React from 'react'

export class Switch extends React.Component {
    render(){
        const name = "foo"
        const required = false
        const checked = false
        const onChange = () => false
        return <React.Fragment>
            <input id="foo" className={"cm-list-input"+(required ? " required" : "")} aria-describedby={`${name}-description`} disabled={required} checked={checked || required} type="checkbox" onChange={onChange} />
            <label htmlFor="foo" className="cm-list-label">
                <span className="cm-list-title">title</span> req oo
                <span className="switch">
                    <div className="slider round active"></div>
                </span>
            </label>
            <div id={`${name}-description`}>
                <p className="cm-list-description">desc</p>
                test
            </div>
        </React.Fragment>
    }
}
