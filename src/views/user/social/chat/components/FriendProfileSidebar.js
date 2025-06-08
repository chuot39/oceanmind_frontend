import React, { useMemo } from 'react'
import { Avatar, Drawer, Button, Divider } from 'antd'
import { CloseOutlined, MessageOutlined, UserDeleteOutlined, BellOutlined } from '@ant-design/icons'
import { FormattedMessage } from 'react-intl'
import { LuCircleUserRound, LuPhone } from 'react-icons/lu'
import { FaUserSecret } from 'react-icons/fa'
import { MdOutlineEmail, MdOutlineLocationOn } from 'react-icons/md'
import { LiaBirthdayCakeSolid } from "react-icons/lia";

const FriendProfileSidebar = ({ visible, onClose, friendData }) => {

    const renderPersonalInfo = () => (
        <div className="info-section">
            <h4 className='text-lg text_first'><FormattedMessage id="social.chat.personal_info" /></h4>
            <div className="info-list">
                {friendData?.fullname && (
                    <div className="info-item flex items-center gap-2">
                        <span className="info-label"><LuCircleUserRound className='text-xl' /></span>
                        <span className="text_secondary"> {friendData?.fullname}</span>
                    </div>
                )}
                {friendData?.nickname && (
                    <div className="info-item flex items-center gap-2">
                        <span className="info-label"><FaUserSecret className='text-xl' /></span>
                        <span className="text_secondary"> {friendData?.nickname}</span>
                    </div>
                )}
                {friendData?.date_of_birth && (
                    <div className="info-item flex items-center gap-2">
                        <span className="info-label"><LiaBirthdayCakeSolid className='text-xl' /></span>
                        <span className="text_secondary"> {friendData?.date_of_birth}</span>
                    </div>
                )}
                {friendData?.phone && (
                    <div className="info-item flex items-center gap-2">
                        <span className="info-label"><LuPhone className='text-xl' /></span>
                        <span className="text_secondary"> {friendData?.phone}</span>
                    </div>
                )}
                {friendData?.email && (
                    <div className="info-item flex items-center gap-2">
                        <span className="info-label"><MdOutlineEmail className='text-xl' /></span>
                        <span className="text_secondary"> {friendData?.email}</span>
                    </div>
                )}
                {friendData?.address && (
                    <div className="info-item flex items-center gap-2">
                        <span className="info-label"><MdOutlineLocationOn className='text-xl' /></span>
                        <span className="text_secondary"> {friendData?.address}</span>
                    </div>
                )}
            </div>
        </div>
    )


    const renderFriendActions = () => (
        <div className="info-section">
            <h4 className='text-lg text_first'><FormattedMessage id="social.chat.chat_settings" /></h4>
            <div className="gap-2 grid grid-cols-1">
                <Button color="primary" variant="dashed" icon={<BellOutlined />} block className="!bg-transparent text_first">
                    <FormattedMessage id="social.chat.notification_settings" />
                </Button>
                {/* <Button color="primary" variant="dashed" icon={<MessageOutlined />} block className="!bg-transparent text_first">
                    <FormattedMessage id="social.chat.send_message" />
                </Button>
                <Button color="primary" variant="dashed" icon={<BellOutlined />} block className="!bg-transparent text_first">
                    <FormattedMessage id="social.chat.mute_notifications" />
                </Button>
                <Button color="danger" variant="dashed" icon={<UserDeleteOutlined />} block className="!bg-transparent text_first">
                    <FormattedMessage id="social.chat.block_user" />
                </Button> */}
                <Button color="danger" variant="dashed" icon={<UserDeleteOutlined />} block className="!bg-transparent text_first">
                    <FormattedMessage id="social.chat.clear_chat_history" />
                </Button>
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
    return (
        <Drawer
            className="user-profile-sidebar"
            placement="right"
            closable={false}
            onClose={onClose}
            open={visible}
            width={300}
        >
            <div className="profile-header relative px-4 py-2 pt-4 text-center">
                <button className="close-btn" onClick={onClose}>
                    <CloseOutlined />
                </button>
                <div className="header-profile-image">
                    <Avatar src={friendData?.avatar?.file_path} size={100} />
                </div>
                <h3 className="text-2xl text_first">{friendData?.fullname}</h3>
                <p className="text-sm  py-1 text_secondary">
                    <span className={`status_dot ${friendData?.isOnline ? 'online' : 'offline'}`} />
                    {friendData?.isOnline ? 'Online' : 'Offline'}
                </p>
            </div>

            <div className="profile-content">
                <div className="info-section">
                    <h4 className='text-lg text_first'><FormattedMessage id="social.chat.about" /></h4>
                    <p className='text-sm text_secondary'>{friendData?.biography && friendData?.biography || 'No about information available.'}</p>
                </div>
                <>
                    {renderPersonalInfo()}
                    {renderFriendActions()}
                </>
            </div>
        </Drawer>
    )
}

export default FriendProfileSidebar 