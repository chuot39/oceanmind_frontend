import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useIntl } from 'react-intl';
import useSkin from '@utils/hooks/useSkin';
import { usePost } from './hook';
import '@core/scss/styles/pages/social/index.scss'
import SuggestFriendCard from './components/SuggestFriendCard';
import ListFriendCard from './components/ListFriendCard';
import { useUserData } from '@utils/hooks/useAuth';
import { useFriend, useSuggestFriend } from '../../components/hook';
import { Card, Spin } from 'antd';
import CreatePostCard from '../shared/components/CreatePostCard';
import PostCard from '../shared/components/PostCard';
import BackToTop from '@/components/button/action/BackToTop';

const Dashboard = () => {
    const { skin, language } = useSkin();
    const { userData } = useUserData();
    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);
    const topPageRef = useRef(null);  // Ref cho top_page element
    const [showBackTop, setShowBackTop] = useState(false);

    const { status: postsStatus, data: postsData, fetchNextPage, hasNextPage, isFetchingNextPage } = usePost(userData?.documentId);
    const { status: suggestFriendsStatus, data: suggestFriends } = useSuggestFriend(userData?.documentId);
    const { status: friendsStatus, data: friends } = useFriend(userData?.documentId);

    const [selectedPost, setSelectedPost] = useState(null);

    const allPosts = postsData?.pages?.flatMap(page => page.data) || [];


    // Setup Intersection Observer for infinite scrolling
    const handleObserver = useCallback((entries) => {
        const [target] = entries;
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    // Theo dõi vị trí của top_page element
    useEffect(() => {
        if (!topPageRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setShowBackTop(!entry.isIntersecting);
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0

            }
        );

        observer.observe(topPageRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const element = loadMoreRef.current;
        if (!element) return;

        observerRef.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        });

        observerRef.current.observe(element);

        return () => {
            if (observerRef.current && element) {
                observerRef.current.unobserve(element);
            }
        };
    }, [handleObserver, loadMoreRef.current]);

    // Add a useEffect to update the selected post when postsData changes
    useEffect(() => {
        if (selectedPost && postsData) {
            // Find the updated post in the cache
            let updatedPost = null;
            postsData.pages.some(page => {
                const foundPost = page.data.find(p => p.documentId === selectedPost.documentId);
                if (foundPost) {
                    updatedPost = foundPost;
                    return true;
                }
                return false;
            });

            // If we found the updated post, update the selected post
            if (updatedPost) {
                setSelectedPost(updatedPost);
            }
        }
    }, [postsData, selectedPost?.documentId]);

    return (
        <>
            <div className="min-h-screen bg-transparent discus_page">
                <div className="grid grid-cols-12 gap-4 relative">
                    <div className="col-span-12 lg:col-span-8 p-4">
                        <div className="space-y-4">
                            <CreatePostCard group={null} />
                            <div ref={topPageRef} className="top_page"></div>

                            {postsStatus === 'loading' ? (
                                <Card loading={true} />
                            ) : (
                                <>
                                    {allPosts.map((post, index) => (
                                        <div key={post?.documentId}>
                                            <PostCard
                                                post={post}
                                                group={null}
                                            />
                                        </div>
                                    ))}

                                    {/* Loading indicator and observer target */}
                                    <div ref={loadMoreRef} className="py-4 flex justify-center">
                                        {(isFetchingNextPage || postsStatus === 'loading') && (
                                            <Spin size="large" />
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        {/* Hiển thị nút Back to Top khi đã cuộn qua bài post thứ 3 */}
                        {showBackTop && (
                            <div className="sticky float-right bottom-4 me-5">
                                <BackToTop />
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Fixed */}
                    <div className="discus_sidebar col-span-12 lg:col-span-4 lg:sticky lg:top-[50px] h-fit p-4 space-y-4">
                        <SuggestFriendCard skin={skin} status={suggestFriendsStatus} suggestFriends={suggestFriends?.data} userData={userData} />
                        <ListFriendCard
                            skin={skin}
                            status={friendsStatus}
                            friends={friends}
                            userData={userData}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    </div>
                </div>
            </div>

            {/* BackToTop button
            {showBackTop && (
                <div className="fixed bottom-8 right-8 z-[9999]">
                    <BackToTop />
                </div>
            )} */}
        </>
    );
};

export default Dashboard;


