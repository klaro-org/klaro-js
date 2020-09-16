import React, { useState } from 'react';
import { Input } from './controls';

const ObjectSelector = ({
    t,
    activeText,
    disabled,
    value,
    choices,
    onChange,
    onCreate,
}) => {
    const [input, setInput] = useState('');
    const [active, setActive] = useState(false);
    const handleClick = (choice) => {
        if (disabled) return;
        setActive(!active);
        onChange(choice);
    };
    return (
        <div className="cm-obj-selector">
            <span className="cm-obj-selector-more">&or;</span>
            <ul className={'cm-obj-selector' + (active ? ' cm-is-active' : '')}>
                {choices.map((choice) => (
                    <li
                        key={choice}
                        className={
                            'cm-obj-item' +
                            (value === choice ? ' cm-obj-is-active' : '')
                        }
                    >
                        <a
                            className="cm-obj-item"
                            onClick={() => handleClick(choice)}
                        >
                            {value === choice ? activeText : ''}
                            {choice}
                        </a>
                    </li>
                ))}
                <li className="cm-obj-add">
                    <input
                        className="cm-obj-selector-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <a className="cm-btn">{t(['obj', 'create'])}</a>
                </li>
            </ul>
        </div>
    );
};

export default ObjectSelector;
