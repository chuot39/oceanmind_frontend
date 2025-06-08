import React, { useState } from 'react';
import { Button, Popover, Input, Tooltip, Divider, message, Card } from 'antd';
import { AiOutlineShareAlt, AiOutlineLink, AiOutlineCheck } from 'react-icons/ai';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaTelegramPlane } from 'react-icons/fa';
import { FormattedMessage } from 'react-intl';

const SharePostPopover = ({ type = 'post', objShare, intl, skin, children, titleId = 'social.post.share_post', titleDefault = 'Share Post', defaultTitle = 'Check out this post' }) => {
    const [linkCopied, setLinkCopied] = useState(false);
    const [shareLoading, setShareLoading] = useState({
        facebook: false,
        twitter: false,
        linkedin: false,
        telegram: false
    });

    // Xác định URL và ID phù hợp dựa trên loại đối tượng
    const getShareInfo = () => {
        let shareUrl = '';
        let objectId = objShare?.documentId || objShare?.postId || objShare?.id;
        let objectType = type;

        switch (objectType) {
            case 'post':
                shareUrl = `/post/${objectId}`;
                break;
            case 'document':
                shareUrl = `/document/${objectId}`;
                break;
            case 'profile':
                shareUrl = `/profile/${objectId}`;
                break;
            default:
                shareUrl = `/${objectType}/${objectId}`;
        }

        return {
            url: `${window.location.origin}${shareUrl}`,
            title: objShare?.title || objShare?.content?.substring(0, 100) || defaultTitle
        };
    }

    const copyPostLink = () => {
        const { url } = getShareInfo();
        navigator.clipboard.writeText(url);
        setLinkCopied(true);

        // Reset the copied state after 2 seconds
        setTimeout(() => {
            setLinkCopied(false);
        }, 2000);

        message.success(intl.formatMessage({
            id: 'social.post.link_copied',
            defaultMessage: 'Link copied to clipboard!'
        }));
    };

    const shareToSocialMedia = (platform) => {
        // Đặt trạng thái loading cho nút chia sẻ
        setShareLoading(prev => ({ ...prev, [platform]: true }));

        // Lấy thông tin chia sẻ
        const { url, title } = getShareInfo();
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            default:
                break;
        }

        if (shareUrl) {
            try {
                // Mở cửa sổ popup với kích thước phù hợp
                const width = 600;
                const height = 500;
                const left = (window.innerWidth - width) / 2;
                const top = (window.innerHeight - height) / 2;

                const shareWindow = window.open(
                    shareUrl,
                    `share_${platform}`,
                    `width=${width},height=${height},left=${left},top=${top},toolbar=0,menubar=0,location=0,status=0`
                );

                // Kiểm tra xem cửa sổ popup có bị chặn không
                if (!shareWindow || shareWindow.closed || typeof shareWindow.closed === 'undefined') {
                    message.error(intl.formatMessage({
                        id: 'social.post.popup_blocked',
                        defaultMessage: 'Popup blocked! Please allow popups for this site to share.'
                    }));
                } else {
                    // Hiển thị thông báo hướng dẫn cho người dùng
                    // if (platform === 'facebook' || platform === 'linkedin') {
                    //     message.info(intl.formatMessage({
                    //         id: 'social.post.share_instruction',
                    //         defaultMessage: 'Please add your comment in the sharing window that just opened'
                    //     }));
                    // }

                    // Theo dõi khi cửa sổ đóng để cập nhật trạng thái
                    const checkWindowClosed = setInterval(() => {
                        if (shareWindow.closed) {
                            clearInterval(checkWindowClosed);
                            setShareLoading(prev => ({ ...prev, [platform]: false }));
                        }
                    }, 1000);
                }
            } catch (error) {
                console.error('Error sharing to social media:', error);
                message.error(intl.formatMessage({
                    id: 'social.post.share_error',
                    defaultMessage: 'Error sharing to social media. Please try again.'
                }));
                setShareLoading(prev => ({ ...prev, [platform]: false }));
            }

            // Đặt lại trạng thái loading sau 3 giây để đảm bảo UX tốt
            setTimeout(() => {
                setShareLoading(prev => ({ ...prev, [platform]: false }));
            }, 3000);
        }
    };

    // Lấy thông tin chia sẻ cho hiển thị
    const { url } = getShareInfo();

    // Share popover content
    const shareContent = (
        <Card className="w-72 p-0">
            <h4 className="text-center font-medium mb-3">
                <FormattedMessage id={titleId} defaultMessage={titleDefault} />
            </h4>

            <div className="flex justify-center gap-4 mb-4">
                <Tooltip title="Facebook">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<FaFacebookF />}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                        onClick={() => shareToSocialMedia('facebook')}
                        loading={shareLoading.facebook}
                    />
                </Tooltip>
                <Tooltip title="Twitter">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<FaTwitter />}
                        className="bg-sky-500 hover:bg-sky-600 flex items-center justify-center"
                        onClick={() => shareToSocialMedia('twitter')}
                        loading={shareLoading.twitter}
                    />
                </Tooltip>
                <Tooltip title="LinkedIn">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<FaLinkedinIn />}
                        className="bg-blue-800 hover:bg-blue-900 flex items-center justify-center"
                        onClick={() => shareToSocialMedia('linkedin')}
                        loading={shareLoading.linkedin}
                    />
                </Tooltip>
                <Tooltip title="Telegram">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<FaTelegramPlane />}
                        className="bg-sky-600 hover:bg-sky-700 flex items-center justify-center"
                        onClick={() => shareToSocialMedia('telegram')}
                        loading={shareLoading.telegram}
                    />
                </Tooltip>
            </div>

            <Divider className="my-2" />

            <div className="mb-2">
                <p className="text-sm mb-2">
                    <FormattedMessage id="social.post.copy_link" defaultMessage="Copy link to this post:" />
                </p>
                <div className="flex gap-2">
                    <Input
                        value={url}
                        readOnly
                        className="flex-1"
                    />
                    <Button
                        type="primary"
                        icon={linkCopied ? <AiOutlineCheck /> : <AiOutlineLink />}
                        onClick={copyPostLink}
                        className={linkCopied ? "bg-green-600 hover:bg-green-700" : ""}
                    />
                </div>
            </div>
        </Card>
    );

    return (
        <Popover
            content={shareContent}
            title={null}
            trigger="click"
            placement="top"
            popupStyle={{ maxWidth: '320px' }}
            className="popover_share"
        >
            {children || (
                <Button
                    type="text"
                    className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    icon={<AiOutlineShareAlt className="text-lg" />}
                >
                    <FormattedMessage id="social.post.share" />
                </Button>
            )}
        </Popover>
    );
};

export default SharePostPopover; 