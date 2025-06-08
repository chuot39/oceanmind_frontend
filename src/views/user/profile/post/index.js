import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import useSkin from '../../../../utils/hooks/useSkin';
import { usePost } from './hook';
import '../../../../core/scss/styles/pages/social/index.scss'
import CreatePostCard from './components/CreatePostCard';
import PostCard from './components/PostCard';
import CommentsModal from './components/CommentsModal';
import SuggestFriendCard from './components/SuggestFriendCard';
import ListFriendCard from './components/ListFriendCard';
import { useUserData } from '../../../../utils/hooks/useAuth';
import { useFriend, useSuggestFriend } from '../../components/hook';
import { Card } from 'antd';


const Dashboard = () => {
    const { skin } = useSkin();
    const { userData } = useUserData();
    const { status: postsStatus, data: posts } = usePost(userData?.username);
    const { status: suggestFriendsStatus, data: suggestFriends } = useSuggestFriend(userData?.username);
    const { status: friendsStatus, data: friends } = useFriend(userData?.username);
    const intl = useIntl();
    const [showComments, setShowComments] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const handleShowComments = (post) => {
        setSelectedPost(post);
        setShowComments(true);
    };

    const handleCloseComments = () => {
        setSelectedPost(null);
        setShowComments(false);
    };

    const handleCreatePost = () => {
        // Handle create post logic
    };



    return (
        <div className="min-h-screen bg-transparent discus_page">
            <div className="grid grid-cols-12 gap-4 relative">
                {/* Main Content - Scrollable */}
                <div className="col-span-12 lg:col-span-8 p-4">
                    <div className="space-y-4">
                        <CreatePostCard
                            userData={userData}
                            skin={skin}
                            intl={intl}
                            onCreatePost={handleCreatePost}
                        />

                        {postsStatus === 'loading' ? (
                            <Card loading={true} className='h-[300px]' />
                        ) :
                            <>
                                {posts?.data?.map((post) => (
                                    <PostCard
                                        key={post?.documentId}
                                        post={post}
                                        skin={skin}
                                        intl={intl}
                                        userData={userData}
                                        onShowComments={handleShowComments}
                                    />
                                ))}
                            </>
                        }
                        {/* <FloatButton.BackTop
                            // target={() => document.querySelector('.main-content-scroll')}
                            visibilityHeight={300}
                            style={{
                                right: 24,
                                bottom: 24,
                            }}
                        /> */}

                    </div>
                </div>

                {/* Sidebar - Fixed */}
                <div className="discus_sidebar col-span-12 lg:col-span-4 lg:sticky lg:top-[50px] h-fit p-4 space-y-4">
                    {/* Friend Suggestions Card */}
                    {suggestFriendsStatus === 'loading' ? (
                        <Card loading={true} className='h-[300px]' />
                    ) : (
                        <SuggestFriendCard skin={skin} suggestFriends={suggestFriends} userData={userData} />
                    )}

                    {/* List Friend Card */}
                    {friendsStatus === 'loading' ? (
                        <Card loading={true} className='h-[300px]' />
                    ) : (
                        <ListFriendCard skin={skin} friends={friends} userData={userData} />
                    )}

                </div>
            </div>

            {/* <FloatButton.BackTop
                visibilityHeight={300}
                style={{
                    right: 24,
                    bottom: 24,
                }}
            /> */}

            <CommentsModal
                visible={showComments}
                onClose={handleCloseComments}
                post={selectedPost}
                skin={skin}
                intl={intl}
                userData={userData}
            />
        </div>
    );
};

export default Dashboard;

