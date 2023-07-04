import PropTypes from 'prop-types';
import { useState, forwardRef } from 'react';
import styles from './Image.module.scss';
import classNames from 'classnames/bind';
import images from './../../assets/images';

const cx = classNames.bind(styles)
// Khi sử dụng Image thay thế cho img trong HTML, cần phải truyền forwardRef để truyền 
// ref từ hàm cha sang hàm con - từ lúc gọi Image truyền ref cho <img> nếu ko là lỗi

// Ref trong param của forwardRef sẽ được tự động truyền xuống img, ko cần quan tâm.

// Phải gán customFallback cho fallback vì fallback có same tên với fallback trong useState.
// Dòng fallback: customFallback = images.noImage được hiểu là khi truyền fallback từ ngoài vào để ko bị hiểu trùng tên
// với fallback trong function thì đổi tên nó thành customFallback và gán giá trị mặc định của nó nếu link fallback truyền
// vào bị lỗi thì sang images.noImage.
const Image = forwardRef(({ 
  src = images.defaultAvatar,
  alt,
  className,
  fallback: customFallback = images.defaultAvatar,
  small = false, 
  medium=false, 
  large=false, 
  ...props }, 
  ref) => {
  const [fallback, setFallback] = useState('');
  const handleError = () => {
    // Set ảnh default ava bằng customFallback
    setFallback(customFallback);
  };
  const classes = cx('wrapper', {
    [className]: className,
    small,
    medium,
    large,
  });
 
  // eslint-disable-next-line jsx-a11y/alt-text
  return (
    <img
      className={classes}
      ref={ref}
      src={fallback || src}
      alt={alt}
      {...props}
      onError={handleError}
    />
  );
});

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  fallback: PropTypes.string,
  small: PropTypes.bool,
  medium: PropTypes.bool,
  large: PropTypes.bool,
};
export default Image;
