import './styles.sass';

import React from 'react';

interface ButtonProps {
    label?: string | JSX.Element;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    className,
    disabled = false,
}) => {
    return (
        <button
            disabled={disabled}
            className={`buttonComponent ${className || ''} ${
                disabled ? 'disabled' : ''
            }`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default Button;
