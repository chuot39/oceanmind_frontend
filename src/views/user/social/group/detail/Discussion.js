import React from 'react';
import { usePostGroup } from '../hook';
import PostCard from '../../shared/components/PostCard';
import CreatePostCard from '../../shared/components/CreatePostCard';
import Hamster from '@/components/loader/Hamster/Hamster';

const Discussion = ({ group }) => {
    const { status: postGroupStatus, data: postGroup, fetchNextPage, hasNextPage, isFetchingNextPage } = usePostGroup(group?.documentId);

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const allData = postGroup?.pages?.flatMap((page) => page?.data) || [];

    return (
        <div className="mt-4 space-y-4">
            <CreatePostCard group={group} />

            {postGroupStatus === 'loading' && (
                <div className="flex justify-center items-center h-[calc(100vh-150px)]">
                    <Hamster />
                </div>
            )}

            {allData?.map((post) => (
                <PostCard
                    key={post.documentId}
                    group={group}
                    post={post}
                />
            ))}

            {hasNextPage && (
                <div className="flex justify-center items-center">
                    <Button onClick={handleLoadMore}>Load More</Button>
                </div>
            )}
        </div>
    );
};

export default Discussion; 