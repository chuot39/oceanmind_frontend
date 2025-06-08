import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useIntl } from 'react-intl';
import useSkin from '@utils/hooks/useSkin';
import { useGroup, useListJoinedGroup, useSuggestGroup } from './hook';
import '@core/scss/styles/pages/social/index.scss'
import ListGroupCard from './components/ListGroupCard';
import { useUserData } from '@utils/hooks/useAuth';
import SuggestGroupCard from './components/SuggestGroupCard';
import { Card, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
// import PostFormModal from '../discus/components/PostFormModal';

// Import shared components and hooks
import PostCard from '../shared/components/PostCard';
import { useCreatePost, useUpdatePost } from '../shared/actions/mutationHooks';
import CreateGroupModal from './components/CreateGroupModal';
import PostFormModal from '../shared/components/PostFormModal';

const Dashboard = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const { skin, language } = useSkin();
    const { userData } = useUserData();
    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);

    const { status: statusGroup, data: groups, fetchNextPage, hasNextPage, isFetchingNextPage } = useGroup(userData?.documentId);
    const { status: statusSuggestGroup, data: suggestGroups } = useSuggestGroup(userData?.documentId);
    const { status: statusJoinedGroup, data: joinedGroups, refetch: refetchJoinedGroups } = useListJoinedGroup(userData?.documentId);

    const [selectedPost, setSelectedPost] = useState(null);

    console.log('groups ', groups);

    // PostFormModal states
    const [showPostFormModal, setShowPostFormModal] = useState(false);
    const [postFormType, setPostFormType] = useState('create'); // 'create' or 'edit'
    const [postToEdit, setPostToEdit] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const createPostMutation = useCreatePost();
    const updatePostMutation = useUpdatePost();



    // Flatten groups from all pages
    const allGroups = groups?.pages?.flatMap(page => page.data) || [];

    console.log('allGroups', allGroups);

    // Setup Intersection Observer for infinite scrolling
    const handleObserver = useCallback((entries) => {
        const [target] = entries;
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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


    // Show create post modal
    const handleShowCreateModal = (group) => {
        setPostFormType('create');
        setPostToEdit(null);
        setSelectedGroup(group);
        setShowPostFormModal(true);
    };

    // Show edit post modal
    const handleEditPost = (post) => {
        setPostFormType('edit');
        setPostToEdit(post);
        setShowPostFormModal(true);
    };

    // Close post form modal
    const handleClosePostFormModal = () => {
        setShowPostFormModal(false);
        setPostToEdit(null);
        setSelectedGroup(null);
    };

    // Handle post submission (create or edit)
    const handlePostSubmit = async (formData) => {
        try {
            setIsSubmitting(true);
            if (postFormType === 'create') {
                // Add group_id to formData if creating a post in a group
                if (selectedGroup) {
                    formData.group_id = selectedGroup.documentId;
                }
                await createPostMutation.mutateAsync(formData);
            } else {
                await updatePostMutation.mutateAsync(formData);
            }
            handleClosePostFormModal();
        } catch (error) {
            console.error(`Error ${postFormType === 'create' ? 'creating' : 'updating'} post:`, error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Navigate to group detail page
    const handleNavigateToGroupDetail = (group) => {
        navigate(`/social/group/${group.documentId}`, { state: { groupId: group.documentId } });
    };

    // Add a useEffect to update the selected post when groups data changes
    useEffect(() => {
        if (selectedPost && groups) {
            // Find the updated post in the cache
            let updatedPost = null;
            groups.pages.some(page => {
                page.data.some(group => {
                    if (group?.group_id?.posts?.length > 0) {
                        const foundPost = group.group_id.posts.find(p => p.documentId === selectedPost.documentId);
                        if (foundPost) {
                            updatedPost = foundPost;
                            return true;
                        }
                    }
                    return false;
                });
                return updatedPost !== null;
            });

            // If we found the updated post, update the selected post
            if (updatedPost) {
                setSelectedPost(updatedPost);
            }
        }
    }, [groups, selectedPost?.documentId]);


    return (
        <div className="min-h-screen bg-transparent discus_page">
            <div className="grid grid-cols-12 gap-4 relative">
                {/* Create Group Modal */}
                <CreateGroupModal userData={userData} />
                <div className="col-span-12 lg:col-span-8 p-4">
                    <div className="space-y-4">
                        {statusGroup === 'loading' ? (
                            <Card loading={true}>
                            </Card>
                        ) : (
                            <>
                                {allGroups.map((group) => (
                                    <div key={group?.documentId}>
                                        <PostCard
                                            post={group?.posts?.[0]}
                                            group={group?.group}
                                            onNavigateToDetail={handleNavigateToGroupDetail}
                                            onShowCreateModal={() => handleShowCreateModal(group)}
                                            type="group"
                                        />
                                    </div>
                                ))}

                                {/* Loading indicator and observer target */}
                                <div ref={loadMoreRef} className="py-4 flex justify-center">
                                    {(isFetchingNextPage || statusGroup === 'loading') && (
                                        <Spin size="large" />
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Sidebar - Fixed */}
                <div className="discus_sidebar col-span-12 lg:col-span-4 lg:sticky lg:top-[50px] h-fit p-4 space-y-4">
                    {/* List Group Card */}
                    <ListGroupCard
                        skin={skin}
                        status={statusJoinedGroup}
                        groups={joinedGroups}
                        userData={userData}
                        refetch={refetchJoinedGroups}
                        onNavigateToDetail={handleNavigateToGroupDetail}
                    />

                    {/* Suggest Group Card */}
                    <SuggestGroupCard skin={skin} status={statusSuggestGroup} suggestGroups={suggestGroups} userData={userData} onNavigateToDetail={handleNavigateToGroupDetail} />
                </div>
            </div>

            {/* Post Form Modal (for both create and edit) */}
            <PostFormModal
                visible={showPostFormModal}
                onClose={handleClosePostFormModal}
                onSubmit={handlePostSubmit}
                userData={userData}
                intl={intl}
                language={language}
                isSubmitting={isSubmitting}
                isEditing={postFormType === 'edit'}
                postData={postToEdit}
                groupId={selectedGroup?.documentId}
            />
        </div>
    );
};

export default Dashboard;

