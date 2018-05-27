import React from 'react'

export default class Switch extends React.Component {

    render(){
        const {checked, disabled, onToggle} = this.props
        const onChange = (e) => {
            onToggle(e.target.checked)
        }
        return <label className={"switch"+(disabled ? " disabled" : "")}>
            <input disabled={disabled} checked={checked} type="checkbox" onChange={onChange} />
            <span className="slider round active"></span>
        </label>
    }

}