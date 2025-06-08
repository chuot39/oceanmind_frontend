import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Empty, Spin } from 'antd';
import PostCard from '@/views/user/social/shared/components/PostCard';
import { useNavigate } from 'react-router-dom';
import { useMarkPost } from '../hook';
import Hamster from '@/components/loader/Hamster/Hamster';

const PostList = ({ userData, skin }) => {
    const { status, data, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useMarkPost(userData?.documentId);
    const loadMoreRef = useRef(null);
    const navigate = useNavigate();

    // Handle intersection observer for infinite scrolling
    const handleObserver = useCallback((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage]);

    // Set up intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '20px',
            threshold: 0.1,
        });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current && observer) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [handleObserver]);

    // Navigate to group detail page
    const handleNavigateToGroupDetail = (group) => {
        navigate(`/social/group/${group.documentId}`, { state: { groupId: group.documentId } });
    };

    if (status === 'loading' && !data?.pages?.length) {
        return (
            <div className="flex justify-center items-center h-48">
                <Hamster />
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
                <div ref={loadMoreRef} className="py-4 flex justify-center h-20">
                    {isFetchingNextPage ? (
                        <Spin size="large" />
                    ) : hasNextPage ? (
                        <span>Scroll for more</span>
                    ) : (
                        <span>No more posts</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostList;

