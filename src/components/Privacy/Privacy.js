import classNames from 'classnames/bind';
import styles from './Privacy.module.scss';

const cx = classNames.bind(styles);

function Privacy() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('link')}>
                <a className={cx('title')} href="/">
                    About
                </a>
                <a className={cx('title')} href="/">
                    Newsroom
                </a>
                <a className={cx('title')} href="/">
                    Contact
                </a>
                <a className={cx('title')} href="/">
                    Careers
                </a>
                <a className={cx('title')} href="/">
                    ByteDance
                </a>
            </div>
            <div className={cx('link')}>
                <a className={cx('title')} href="/">
                    TikTok for Good
                </a>
                <a className={cx('title')} href="/">
                    Advertise
                </a>
                <a className={cx('title')} href="/">
                    Developers
                </a>
                <a className={cx('title')} href="/">
                    Transparency
                </a>
                <a className={cx('title')} href="/">
                    TikTok Rewards
                </a>
                <a className={cx('title')} href="/">
                    TikTok Browse
                </a>
                <a className={cx('title')} href="/">
                    TikTok Embeds
                </a>
            </div>
            <div className={cx('link')}>
                <a className={cx('title')} href="/">
                    Help
                </a>
                <a className={cx('title')} href="/">
                    Safety
                </a>
                <a className={cx('title')} href="/">
                    Terms
                </a>
                <a className={cx('title')} href="/">
                    Privacy
                </a>
                <a className={cx('title')} href="/">
                    Creator Portal
                </a>
                <a className={cx('title')} href="/">
                    Community Guidelines
                </a>
            </div>
            <div className={cx('link')}>
                <p className={cx('title')}>@ 2022 TikTok</p>
            </div>
        </div>
    );
}

export default Privacy;
