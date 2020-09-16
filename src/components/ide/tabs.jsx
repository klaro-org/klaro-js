import React from 'react';
import PropTypes from 'prop-types';

export class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
        };
    }

    render() {
        const { active } = this.state;

        const toggle = () => this.setState({ active: !active });

        return (
            <div
                className={
                    'cm-tabs' + (this.state.active ? ' cm-tabs-active' : '')
                }
                onClick={toggle}
            >
                <span className="cm-tabs-more">&or;</span>
                <ul>{this.props.children}</ul>
            </div>
        );
    }
}

export const Tab = ({ active, children, href, icon, params, onClick }) => (
    <li className={active ? 'cm-tab-is-active' : ''}>
        <a params={params} onClick={onClick}>
            {icon && (
                <span className="cm-tabs-icon cm-tabs-is-small">{icon}</span>
            )}
            {children}
        </a>
    </li>
);

Tab.propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node.isRequired,
    href: PropTypes.string,
    icon: PropTypes.node,
    params: PropTypes.object,
    onClick: PropTypes.func,
};
