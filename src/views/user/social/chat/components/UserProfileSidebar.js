import React from 'react'
import { Avatar, Drawer, Button, Divider } from 'antd'
import { CloseOutlined, MessageOutlined, UserDeleteOutlined, BellOutlined } from '@ant-design/icons'
import { FormattedMessage } from 'react-intl'

const UserProfileSidebar = ({ visible, onClose, userData, skin }) => {
    const statusOptions = [
        { label: 'Online', value: 'online', color: '#52c41a' },
        { label: 'Away', value: 'away', color: '#faad14' },
        { label: 'Do Not Disturb', value: 'dnd', color: '#ff4d4f' },
        { label: 'Offline', value: 'offline', color: '#bfbfbf' }
    ]

    const renderPersonalInfo = () => (
        <div className="info-section">
            <h4 className='text-lg text_first'>Personal Information</h4>
            <div className="info-list">
                {Object.entries(userData?.details || {}).map(([key, value]) => (
                    <div key={key} className="info-item">
                        <span className="info-label">{key}:</span>
                        <span className="info-value">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderUserSettings = () => (
        <div className="info-section">
            <h4 className='text-lg text_first'><FormattedMessage id="social.chat.chat_settings" /></h4>
            <div className="settings-list gap-2 grid grid-cols-1">
                <Button color="primary" variant="dashed" icon={<BellOutlined />} block className="setting-item">
                    <FormattedMessage id="social.chat.notification_settings" />
                </Button>
                <Button color="primary" variant="dashed" icon={<MessageOutlined />} block className="setting-item">
                    <FormattedMessage id="social.chat.message_settings" />
                </Button>
                <Button color="danger" variant="dashed" icon={<UserDeleteOutlined />} block className="setting-item text-red-500">
                    <FormattedMessage id="social.chat.clear_chat_history" />
                </Button>
            </div>
        </div>
    )

    const renderFriendActions = () => (
        <div className="info-section">
            <h4 className='text-lg text_first'>Actions</h4>
            <div className="action-buttons">
                <Button type="primary" icon={<MessageOutlined />} block className="mb-2">
                    Send Message
                </Button>
                <Button type="default" icon={<BellOutlined />} block className="mb-2">
                    Mute Notifications
                </Button>
                <Button danger icon={<UserDeleteOutlined />} block>
                    Block User
                </Button>
            </div>
        </div>
    )

    return (
        <Drawer
            className="user-profile-sidebar"
            placement="right"
            closable={false}
            onClose={onClose}
            open={visible}
            width={300}
        >
            <div className="profile-header">
                <button className="close-btn" onClick={onClose}>
                    <CloseOutlined />
                </button>
                <div className="header-profile-image">
                    <Avatar src={userData?.avatar_url_id?.file_path} size={100} />
                </div>
                <h3 className="text-2xl text_first">{userData?.fullname}</h3>
                <p className="profile-status">
                    <span className={`status_dot ${userData?.isOnline ? 'online' : 'offline'}`} />
                    {userData?.isOnline === true ? 'Online' : 'Offline'}
                </p>
            </div>

            <div className="profile-content">
                <div className="info-section">
                    <h4 className='text-lg text_first'><FormattedMessage id="social.chat.about" /></h4>
                    <p className='text-sm text_secondary'>{userData && userData?.biography || 'No about information available.'}</p>
                </div>

                {/* <Divider /> */}
                <>
                    {renderUserSettings()}
                    {/* <Divider /> */}
                    {/* {renderPersonalInfo()} */}
                </>

            </div>
        </Drawer>
    )
}

export default UserProfileSidebar 