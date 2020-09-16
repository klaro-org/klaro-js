import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export const DropdownMenu = ({ children }) => (
    <Dropdown
        title={
            <span className="cm-icon">
                &hellip;
            </span>
        }
    >
        <ul className="cm-dropdownmenu">{children}</ul>
    </Dropdown>
);

DropdownMenu.propTypes = {
    children: PropTypes.node
};

export const MenuItem = ({ icon, children, onClick }) => (
    <li>
        <a onClick={(e) => {e.preventDefault();e.stopPropagation();onClick()}}>
            {
                icon && 
                <span className="cm-icon">
                    {icon}
                </span>
            }
            <span>{children}</span>
        </a>
    </li>
);

MenuItem.propTypes = {
    children: PropTypes.node,
    icon: PropTypes.string,
    onClick: PropTypes.func.isRequired
};

export class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            right: false
        };
        this.ref = React.createRef();
        this.handler = e => this.handleClick(e);
    }

    hide() {
        this.setState({ expanded: false });
        document.removeEventListener("click", this.handler, false);
    }

    show() {
        this.setState({ expanded: true });
        document.addEventListener("click", this.handler, false);
    }

    handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this.hide();
    }

    componentWillUnmount() {
        this.hide();
    }

    componentDidMount() {
        // we check where the dropdown is positioned so that we can
        // display the content either left- or right-aligned
        const rect = this.ref.current.getBoundingClientRect();
        if (rect.left > window.innerWidth * 0.5) {
            this.setState({
                right: true
            });
        }
    }

    handleToggle = event => {
        const { expanded } = this.state;
        event.preventDefault();
        event.stopPropagation();
        if (!expanded) {
            this.show();
        } else {
            this.hide();
        }
    };

    render() {
        const { expanded, right } = this.state;
        const { title, children } = this.props;

        return (
            <div
                ref={this.ref}
                className={classnames("cm-dropdown", { "is-right": right })}
            >
                <button
                    aria-expanded={expanded}
                    type="button"
                    onClick={this.handleToggle}
                >
                    {title}
                </button>
                <div
                    className={classnames("cm-dropdowncontent", {
                        "cm-dropdownexpanded": expanded
                    })}
                >
                    {children}
                </div>
            </div>
        );
    }
}

Dropdown.propTypes = {
    children: PropTypes.node,
    title: PropTypes.node.isRequired
};
