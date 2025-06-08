import React, { useState } from 'react';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import useSkin from '../../../../utils/hooks/useSkin';
import DocumentDetailModal from '../../../user/learning/document/components/DocumentDetailModal';
import '../../../../core/scss/styles/pages/profile/index.scss';
import { useUserData } from '../../../../utils/hooks/useAuth';
import { BsPostcardHeart } from 'react-icons/bs';
import { CgFileDocument } from 'react-icons/cg';
import ListDocumentMark from './components/ListDocumentMark';
import PostList from './components/PostList';

const LoveItemPage = () => {
    const { skin, language } = useSkin();
    const { userData } = useUserData()

    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);


    // Define items for Tabs
    const tabItems = [
        {
            key: 'documents',
            label: (
                <span className="flex items-center gap-2">
                    <CgFileDocument className='text-xl' />
                    <FormattedMessage id="profile.love_item.documents" />
                </span>
            ),
            children: (
                <ListDocumentMark userData={userData} />
            ),
        },
        {
            key: 'posts',
            label: (
                <span className="flex items-center gap-2">
                    <BsPostcardHeart className='text-xl' />
                    <FormattedMessage id="profile.love_item.posts" />
                </span>
            ),
            children: (
                <PostList
                    userData={userData}
                    skin={skin}
                />
            ),
        },
    ];

    return (
        <div className="love-item-page p-4">
            <Tabs defaultActiveKey="documents" items={tabItems} />

            <DocumentDetailModal
                visible={showDetailModal}
                document={selectedItem}
                onClose={() => setShowDetailModal(false)}
            />
        </div>
    );
};

export default LoveItemPage;