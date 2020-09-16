import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export const List = ({ className, children }) => (
    <div className={classnames("cm-list", className)}>{children}</div>
);

export const ListHeader = ({ children }) => (
    <div className="cm-item cm-is-header">{children}</div>
);

export const ListColumn = ({ children, size = "md" }) => (
    <div className={`cm-col cm-is-${size}`}>{children}</div>
);

export const ListItem = ({ children, isCard = true, onClick }) => (
    <div
        className={classnames("cm-item", {
            "cm-is-card": isCard,
            "cm-is-clickable": onClick
        })}
        onClick={(e) => onClick()}
    >
        {children}
    </div>
);

ListItem.propTypes = {
    children: PropTypes.node,
    isCard: PropTypes.bool,
    onClick: PropTypes.func
};
