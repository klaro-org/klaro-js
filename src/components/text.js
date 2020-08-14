import React from 'react'

export default Text = ({text, config}) => {
    if (config.htmlTexts === true){
        let wrapped = false
        // if the first character is an opening bracket, we assume that the
        // text is wrapped in a custom element already. If not, we put it
        // inside a HTML paragraph (<p>...</p>).
        if (text[0][0] === '<')
            wrapped = true
        const elements = text.map(textElement => {
            if (typeof textElement === "string")
                return <span dangerouslySetInnerHTML={{__html: textElement}} />
            // we assume this already is a React element
            return textElement
        })
        if (wrapped)
            return <React.Fragment>
                {elements}
            </React.Fragment>
        else
            return <p>
                {elements}
            </p>
    }
    else
        return <p>{text}</p>
}
