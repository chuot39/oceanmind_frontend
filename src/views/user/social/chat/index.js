import '@core/scss/styles/pages/social/index.scss'
import React, { useState, useEffect } from 'react'
import { Card } from 'antd'
import useSkin from '@utils/hooks/useSkin'
import { useUserData } from '@utils/hooks/useAuth'
import { useParams, useNavigate } from 'react-router-dom'

// Components
import Chat from './components/Chat'
import SidebarLeft from './components/SidebarLeft'
import UserProfileSidebar from './components/UserProfileSidebar'
import { useGetChatFriends, useGetChatGroups, useGetChatByAlias } from './hook'
import { useFriend } from '../../components/hook'
import Hamster from '@components/loader/Hamster/Hamster';
import chatBg from '@assets/images/pages/chat.svg'
import { GrChatOption } from 'react-icons/gr'

const ChatPage = () => {

    const { skin } = useSkin()
    const { alias } = useParams()
    const { userData } = useUserData()
    const navigate = useNavigate()

    const [showUserProfile, setShowUserProfile] = useState(false)
    const [showFriendProfile, setShowFriendProfile] = useState(false)

    const { status: statusChatFriends, data: chatFriends } = useGetChatFriends(userData?.documentId)
    const { status: statusChatGroups, data: chatGroups } = useGetChatGroups(userData?.documentId)
    const { status: statusFriends, data: friendSuggests } = useFriend(userData?.documentId)

    const allChatFriends = chatFriends?.pages?.flatMap(page => page.data) || [];
    const allChatGroups = chatGroups?.pages?.flatMap(page => page.data) || [];

    // Hide footer and adjust app-content padding when chat page is accessed
    useEffect(() => {
        // Hide footer
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.style.display = 'none';
        }

        // Adjust app-content padding
        // Lấy tất cả các phần tử có class app-content
        const appContentElements = document.querySelectorAll('.app-content');

        // Tìm phần tử có class app-content mà không có class content
        let targetAppContent = null;
        appContentElements.forEach(element => {
            if (!element.classList.contains('content')) {
                targetAppContent = element;
            }
        });

        if (targetAppContent) {
            targetAppContent.style.paddingBottom = '0px';
        }

        // Cleanup function to restore original styles when component unmounts
        return () => {
            if (footer) {
                footer.style.display = '';
            }
            if (targetAppContent) {
                targetAppContent.style.paddingBottom = '';
            }
        };
    }, []);

    const handleSelectChat = (chat) => {
        navigate(`/social/chat/${chat?.documentId}`)
    }

    const toggleUserProfile = () => {
        setShowUserProfile(!showUserProfile)
        setShowFriendProfile(false)
    }

    const toggleFriendProfile = () => {
        setShowFriendProfile(!showFriendProfile)
        setShowUserProfile(false)
    }

    return (
        <Card className="chat-application flex mb-4">
            {statusChatFriends === 'loading' || statusChatGroups === 'loading' || statusFriends === 'loading' ? (
                <div className="flex justify-center items-center h-full w-full">
                    <Hamster />
                </div>
            ) : (
                <>
                    <SidebarLeft
                        userData={userData}
                        alias={alias}
                        chatFriends={allChatFriends}
                        chatGroups={chatGroups?.data}
                        friendSuggests={friendSuggests?.data}
                        onSelectChat={handleSelectChat}
                        onUserProfileClick={toggleUserProfile}
                    />

                    <div className="chat-container w-full">
                        <div className="chat-bg absolute z-0 opacity-20 w-full h-full" style={{ backgroundImage: `url(${chatBg})` }}></div>
                        {alias ? (
                            <Chat
                                userData={userData}
                                skin={skin}
                            />
                        ) : (
                            <div className="start-chat-area flex flex-col justify-center items-center w-full h-full">
                                <GrChatOption className={`text-2xl w-20 h-20 ${skin === 'dark' ? 'text-teal-300' : 'text-cyan-500'}`} />
                                <h4 className="text-2xl font-bold">Welcome to Chat! 👋</h4>
                                <p className="text-sm">Please select a chat to start messaging</p>
                            </div>
                        )}
                    </div>

                    <UserProfileSidebar
                        visible={showUserProfile}
                        onClose={toggleUserProfile}
                        userData={userData}
                        skin={skin}
                    />


                </>
            )}
        </Card>
    )
}

export default ChatPage
