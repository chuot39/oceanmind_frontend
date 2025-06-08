import React, { useState } from 'react'
import { Input, Avatar, Badge, Collapse } from 'antd'
import { CaretRightOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { FormattedMessage, useIntl } from 'react-intl'
import { getFirstLetter, getGradientColor } from '../../../../../utils/format/formartText'

const { Search } = Input;


const SidebarLeft = ({ userData, alias, chatFriends, chatGroups, friendSuggests, onSelectChat, onUserProfileClick }) => {

    const intl = useIntl()
    const [searchQuery, setSearchQuery] = useState('')
    const [activeKeys, setActiveKeys] = useState(['friends', 'groups', 'suggestions'])

    // Filter chats based on search query
    const filterChats = (items) => {
        if (!searchQuery || !items) return items || []
        const filteredItems = items.filter(item => {
            // Kiểm tra nếu là chat nhóm (có detailGroup)
            if (item?.detailGroup) {
                const groupName = item?.detailGroup?.name || ''
                const result = groupName.toLowerCase().includes(searchQuery.toLowerCase())
                return result
            }

            // Kiểm tra nếu là chat bạn bè
            if (item?.creator) {
                // Nếu người dùng hiện tại là người tạo cuộc trò chuyện
                if (item?.creator?.username === userData?.username) {
                    const friendName = item?.chatPartner?.fullname || ''
                    return friendName.toLowerCase().includes(searchQuery.toLowerCase())
                }
                // Nếu người dùng hiện tại không phải là người tạo cuộc trò chuyện
                const creatorName = item?.creator?.fullname || ''
                return creatorName.toLowerCase().includes(searchQuery.toLowerCase())
            }

            // Trường hợp khác (có thể là gợi ý bạn bè)
            if (item?.fullname) {
                const suggestedName = item?.fullname || ''
                return suggestedName.toLowerCase().includes(searchQuery.toLowerCase())
            }
            // Nếu không tìm thấy trường nào phù hợp, trả về false
            return false
        })

        console.log('filteredItems', filteredItems)
        return filteredItems
    }

    const renderChatItemFriends = (chat) => {
        const isSelected = alias === chat?.documentId
        const isOnline = chat?.isOnline === true
        const lastMessage = chat?.messages?.[chat?.messages?.length - 1]?.content || 'Start a conversation'
        const friend = chat?.chatPartner?.documentId === userData?.documentId ? chat?.creator : chat?.chatPartner

        // If this chat is selected, don't show unread count
        const unreadCount = isSelected ? 0 : (chat?.unreadMessages?.length || 0)

        return (
            <div
                key={chat?.documentId}
                className={classNames('chat-list-item', {
                    'selected': isSelected,
                })}
                onClick={() => onSelectChat(chat)}
            >
                <div className="chat-item-avatar relative">
                    <Badge
                        status={isOnline ? 'success' : 'default'}
                        offset={[-6, 24]}
                    >
                        <Avatar src={friend?.avatar?.file_path} size={40} />
                    </Badge>
                    {unreadCount > 0 && (
                        <div className="chat-item-meta absolute top-5 left-6">
                            <Badge count={unreadCount} className="unread-badge" />
                        </div>
                    )}
                </div>
                <div className="chat-item-info">
                    <h4 className="chat-item-title">{friend?.fullname}</h4>
                    <p className="chat-item-message">{lastMessage}</p>
                </div>
            </div>
        )
    }

    const renderChatItemGroups = (chat) => {
        const isSelected = alias === chat?.documentId
        const lastMessage = chat?.detailGroup?.messages?.[0]?.content || 'Start a conversation'

        // If this chat is selected, don't show unread count
        const unreadCount = isSelected ? 0 : (chat?.unreadMessages?.length || 0)

        const groupName = chat?.conversation?.name || 'Unknown Group'

        // Kiểm tra xem có thông tin nhóm không
        if (!chat?.detailGroup) {
            console.warn('Missing detailGroup for chat:', chat)
            return null
        }

        return (
            <div
                key={chat?.documentId}
                className={classNames('chat-list-item', {
                    'selected': isSelected,
                })}
                onClick={() => onSelectChat(chat?.detailGroup || chat)}
            >
                <div className="chat-item-avatar">
                    <Badge >
                        <Avatar
                            style={{
                                background: getGradientColor(getFirstLetter(groupName)),
                                verticalAlign: 'middle',
                                color: '#fff'
                            }}
                            size="large"
                        >
                            {getFirstLetter(groupName)}
                        </Avatar>
                    </Badge>
                </div>
                <div className="chat-item-info">
                    <h4 className="chat-item-title">{groupName}</h4>
                    <p className="chat-item-message">{lastMessage}</p>
                </div>
                {unreadCount > 0 && (
                    <div className="chat-item-meta">
                        <Badge count={unreadCount} className="unread-badge" />
                    </div>
                )}
            </div>
        )
    }

    // Get suggested chat friends (friends without chat history)
    const getSuggestedChats = () => {
        const chatFriendIds = chatFriends?.map(chat => chat?.documentId)
        return friendSuggests?.filter(friend => !chatFriendIds?.includes(friend?.documentId))
    }

    const items = [
        {
            key: 'friends',
            label: (
                <span className="section-title">
                    <FormattedMessage id="social.chat.friends" defaultMessage="Friends" />
                    <span className="count">({filterChats(chatFriends)?.length || 0})</span>
                </span>
            ),
            children: (
                <div className="chat-list">
                    {filterChats(chatFriends)?.map(renderChatItemFriends)}
                </div>
            )
        },
        // {
        //     key: 'groups',
        //     label: (
        //         <span className="section-title">
        //             <FormattedMessage id="social.chat.groups" defaultMessage="Groups" />
        //             <span className="count">({filterChats(chatGroups)?.length || 0})</span>
        //         </span>
        //     ),
        //     children: (
        //         <div className="chat-list">
        //             {filterChats(chatGroups)?.map(renderChatItemGroups)}
        //         </div>
        //     )
        // },
        {
            key: 'suggestions',
            label: (
                <span className="section-title">
                    <FormattedMessage id="social.chat.suggestions" defaultMessage="Suggested Chats" />
                    <span className="count">({filterChats(getSuggestedChats())?.length || 0})</span>
                </span>
            ),
            children: (
                <div className="chat-list">
                    {filterChats(getSuggestedChats())?.map(renderChatItemFriends)}
                </div>
            )
        }
    ]

    return (
        <div className="chat-sidebar">
            <div className="sidebar-header flex justify-between items-center gap-2">
                <div className="user-profile" onClick={onUserProfileClick} style={{ cursor: 'pointer' }}>
                    <Badge status={userData?.isOnline === true ? 'success' : 'default'} offset={[-6, 24]}>
                        <Avatar src={userData?.avatar?.file_path} size={45} />
                    </Badge>
                </div>

                <Search
                    className="w-full"
                    placeholder={intl.formatMessage({
                        id: 'dashboard.search.placeholder',
                        defaultMessage: "Enter subject name"
                    })}
                    allowClear
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/* </div> */}
            </div>

            <div className="sidebar-content">
                <Collapse
                    defaultActiveKey={activeKeys}
                    onChange={setActiveKeys}
                    expandIcon={({ isActive }) => (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    ghost
                    items={items}
                />
            </div>
        </div>
    )
}

export default SidebarLeft 