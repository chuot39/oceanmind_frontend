import React, { useState } from 'react';
import { Card, Avatar, Button } from 'antd';
import { BsImages, BsGeoAlt, BsTag } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUserData } from '@/utils/hooks/useAuth';
import useSkin from '@/utils/hooks/useSkin';
import { useFriend } from '@/views/user/components/hook';
import { useCreatePost, useUpdatePost } from '../actions/mutationHooks';
import PostFormModal from './PostFormModal';


const CreatePostCard = ({ group }) => {
    const { skin, language } = useSkin();
    const { userData } = useUserData();
    const intl = useIntl();

    const createPostMutation = useCreatePost();
    const updatePostMutation = useUpdatePost();
    // const { status: friendsStatus, data: friends } = useFriend(userData?.username);

    // PostFormModal states
    const [showPostFormModal, setShowPostFormModal] = useState(false);
    const [postFormType, setPostFormType] = useState('create'); // 'create' or 'edit'
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Show create post modal
    const handleShowCreateModal = () => {
        setPostFormType('create');
        setShowPostFormModal(true);
    };


    // Close post form modal
    const handleClosePostFormModal = () => {
        setShowPostFormModal(false);
    };


    // Handle post submission (create or edit)
    const handlePostSubmit = async (formData) => {
        try {
            setIsSubmitting(true);
            const postData = {
                ...formData,
                group_id: group?.documentId
            };
            if (postFormType === 'create') {
                await createPostMutation.mutateAsync(postData);
            } else {
                await updatePostMutation.mutateAsync(postData);
            }
            handleClosePostFormModal();
        } catch (error) {
            console.error(`Error ${postFormType === 'create' ? 'creating' : 'updating'} post:`, error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (

        <>
            <Card className="mb-4 card_new_post">
                <div className="flex gap-3">
                    <Avatar
                        src={userData?.avatar?.file_path}
                        size={40}
                        className="rounded-full"
                    />
                    <div
                        className={`flex-1 px-4 py-2 rounded-full cursor-pointer ${skin === 'dark'
                            ? 'bg-slate-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        onClick={handleShowCreateModal}
                    >
                        <FormattedMessage id="social.post.write_something" />
                    </div>
                </div>

                <div className="flex gap-2 mt-4 ">
                    <Button
                        type="text"
                        icon={<BsImages className="text-lg !text-green-500" />}
                        className="flex items-center gap-2 discus_btn_action"
                        onClick={handleShowCreateModal}
                    >
                        <FormattedMessage id="social.post.photo_video" defaultMessage="Photo/Video" />
                    </Button>
                    <Button
                        type="text"
                        icon={<BsTag className="text-lg !text-blue-500" />}
                        className="flex items-center gap-2 discus_btn_action"
                        onClick={handleShowCreateModal}
                    >
                        <FormattedMessage id="social.post.tag_friends" defaultMessage="Tag Friends" />
                    </Button>
                    <Button
                        type="text"
                        icon={<BsGeoAlt className="text-lg !text-red-500" />}
                        className="flex items-center gap-2 discus_btn_action"
                        onClick={handleShowCreateModal}
                    >
                        <FormattedMessage id="social.post.location" defaultMessage="Location" />
                    </Button>
                </div>
            </Card>

            {/* Post Form Modal (for both create and edit) */}
            <PostFormModal
                visible={showPostFormModal}
                onClose={handleClosePostFormModal}
                onSubmit={handlePostSubmit}
                userData={userData}
                intl={intl}
                language={language}
                // friends={friends}
                isSubmitting={isSubmitting}
                isEditing={postFormType === 'edit'}
            />
        </>

    );
};

export default CreatePostCard; 