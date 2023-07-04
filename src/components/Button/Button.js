import PropTypes from "prop-types";
import {Link} from 'react-router-dom'


// For style className
import classNames from 'classnames/bind';
import styles from './Button.module.scss';
const cx = classNames.bind(styles);

function Button({
    to,
    href,
    primary = false,
    outline = false,
    text =false,
    rounded =false,
    disabled = false,
    small = false,
    large = false,
    active = false,
    userLinkBtn = false,
    children,
    className,
    leftIcon,
    rightIcon,
    onClick,
    ...passProps
}) {
    let Component = 'button';
        const props = {onClick, ...passProps};

        // If Button is on the status disabled, then delete props onClick to prevent clicking from users
        if (disabled) {
            delete props.onClick;
        };

        if(to){
            props.to = to;
            Component = Link;
        }else if(href){
            props.href = href;
            Component = 'a';
        }
        
        const classes = cx('wrapper', {
            [className]: className,
            primary,
            outline,
            text,
            rounded,
            disabled,
            small,
            large,
            active,
            userLinkBtn,
          });

        return ( 
            <Component className={classes} {...props}>
                {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
                <div className={cx('title')}>{children}</div>
                {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
            </Component>
        )
    }
        

// Button model:
Button.prototypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    primary: PropTypes.bool,
    outline: PropTypes.bool,
    text: PropTypes.bool,
    rounded: PropTypes.bool,
    disabled: PropTypes.bool,
    small: PropTypes.bool,
    large: PropTypes.bool,
    children: PropTypes.node.isRequired,
    classNames: PropTypes.string,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    onClick: PropTypes.func,
    active: PropTypes.bool,
    userLinkBtn: PropTypes.bool,
};

export default Button;