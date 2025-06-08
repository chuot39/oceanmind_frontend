import React, { useRef, useState, useEffect, useCallback } from 'react';
// import { usePost } from '../hook';
import { Empty, Spin } from 'antd';
import PostCard from '@/views/user/social/shared/components/PostCard';
import { useNavigate } from 'react-router-dom';
import { usePost } from '@/views/user/social/discus/hook';

const PostList = ({ userData, skin }) => {
    const { status, data, error, fetchNextPage, hasNextPage, isFetchingNextPage } = usePost(userData?.documentId);
    const loadMoreRef = useRef(null);
    const navigate = useNavigate();

    // Handle intersection observer for infinite scrolling
    const handleObserver = useCallback((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    // Set up intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [handleObserver, loadMoreRef]);

    // Navigate to group detail page
    const handleNavigateToGroupDetail = (group) => {
        navigate(`/social/group/${group.documentId}`, { state: { groupId: group.documentId } });
    };

    if (status === 'loading' && !data?.pages?.length) {
        return (
            <div className="flex justify-center items-center h-48">
                <Spin size="large" />
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex justify-center items-center h-48">
                <Empty description="Error loading posts" />
            </div>
        );
    }

    // Flatten the posts from all pages
    const allPosts = data?.pages?.flatMap(page => page.data) || [];

    console.log('allPosts', allPosts);

    if (!allPosts.length) {
        return (
            <div className="flex justify-center items-center h-48">
                <Empty description="No posts found" />
            </div>
        );
    }

    return (
        <div className="col-span-12 lg:col-span-8">
            <div className="space-y-4">
                {allPosts?.map((post) => (
                    <PostCard
                        key={post?.documentId}
                        post={post}
                        group={post?.group_id}
                        onNavigateToDetail={handleNavigateToGroupDetail}
                        // onShowCreateModal={() => handleShowCreateModal(post?.group_id)}
                        type="post"
                    />
                ))}

                {/* Loading indicator and observer target */}
                <div ref={loadMoreRef} className="py-4 flex justify-center">
                    {isFetchingNextPage && (
                        <Spin size="large" />
                    )}
                </div>
            </div>

        </div>
    );
};

export default PostList;

