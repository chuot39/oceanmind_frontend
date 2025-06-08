import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useGroupById } from '../hook';
import GroupDetailHeader from './GroupDetailHeader';
import '@core/scss/styles/pages/social/index.scss'
import { useUserData } from '../../../../../utils/hooks/useAuth';

import Hamster from '@/components/loader/Hamster/Hamster';
import { useQueryClient } from 'react-query';

const GroupDetail = () => {
    const { idGroup } = useParams();
    const { userData } = useUserData();
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.invalidateQueries(['query-group-by-id', idGroup])
        queryClient.invalidateQueries(['post-group', idGroup])
        queryClient.invalidateQueries(['query-group-member', idGroup])
        queryClient.invalidateQueries(['media-group', idGroup])
        queryClient.invalidateQueries(['query-friend-select'])
        queryClient.invalidateQueries(['query-group-join-request', idGroup])
    }, [idGroup])

    const { data: groupDetail, isLoading, isError } = useGroupById(idGroup);


    // Show error state
    if (isError) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">
                    <FormattedMessage id="social.group.error_loading" />
                </p>
                <Button type="primary" onClick={() => window.history.back()}>
                    <FormattedMessage id="social.group.go_back" />
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent group-detail-page">
            {isLoading ? (
                <div className="flex justify-center items-center h-[calc(100vh-150px)]">
                    <Hamster />
                </div>
            ) : (
                <>
                    {/* Group Header */}
                    <div className="mb-4">
                        <GroupDetailHeader group={groupDetail} userData={userData} />
                    </div>
                </>
            )}
        </div>
    );
};

export default GroupDetail; 