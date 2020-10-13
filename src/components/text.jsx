import React from 'react';

const Text = ({ text, config }) => {
    if (!(text instanceof Array))
        text = [text]
    if (config.htmlTexts === true) {
        let wrapped = false;
        // if the first character is an opening bracket, we assume that the
        // text is wrapped in a custom element already. If not, we put it
        // inside a HTML span (<span>...</span>).
        if (text[0][0] === '<') wrapped = true;
        const elements = text.map((textElement, i) => {
            if (typeof textElement === 'string')
                return (
                    <span key={i} dangerouslySetInnerHTML={{ __html: textElement }} />
                );
            // we assume this already is a React element
            return textElement;
        });
        if (wrapped) return <React.Fragment>{elements}</React.Fragment>;
        else return <span>{elements}</span>;
    } else return <span>{text}</span>;
};

export default Text;
