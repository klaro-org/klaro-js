import React from 'react';

const Text = ({ text, config }) => {
    if (config.htmlTexts === true) {
        let wrapped = false;
        // if the first character is an opening bracket, we assume that the
        // text is wrapped in a custom element already. If not, we put it
        // inside a HTML paragraph (<p>...</p>).
        if (text[0][0] === '<') wrapped = true;
        const elements = text.map((textElement, i) => {
            if (typeof textElement === 'string')
                return (
                    <span key={i} dangerouslySetInnerHTML={{ __html: textElement }} />
                );
            // we assume this already is a React element
            return textElement;
        });
        console.log(elements)
        if (wrapped) return <React.Fragment>{elements}</React.Fragment>;
        else return <p>{elements}</p>;
    } else return <p>{text}</p>;
};

export default Text;
