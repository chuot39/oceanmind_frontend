import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Skeleton, Empty, Modal, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { handleNavigateToDetail } from '@/views/user/social/shared/actions/actionStore';
import { BtnRequestGroup } from '@/components/button/ui';

const ListGroupCard = ({ groupList, statusGroupUser, userData, skin, onLeaveSuccess }) => {
    const navigate = useNavigate();
    const [groupStatuses, setGroupStatuses] = useState({});

    // Handle status update from child component
    const handleStatusChange = (groupId, newStatus) => {
        setGroupStatuses(prev => ({
            ...prev,
            [groupId]: newStatus
        }));
    };

    const renderGroupCards = () => {
        if (statusGroupUser === 'loading') {
            return Array(6)
                .fill(null)
                .map((_, index) => (
                    <Col xs={24} sm={12} md={8} key={index} className="mb-4">
                        <Card>
                            <Skeleton active avatar paragraph={{ rows: 4 }} />
                        </Card>
                    </Col>
                ));
        }

        if (!groupList || groupList.length === 0) {
            return (
                <Col span={24}>
                    <Empty
                        description={
                            <span>
                                <FormattedMessage id="social.group.no_groups" defaultMessage="No groups found" />
                            </span>
                        }
                    />
                </Col>
            );
        }

        return groupList.map((item) => {
            const isAdmin = item?.groupDetail?.group_created_by?.username === userData?.username;
            return (
                <Col xs={24} sm={12} md={8} key={item?.groupDetail?.documentId} className="mb-4">
                    <Card className="group_card h-full overflow-hidden rounded-lg border">
                        <div className="relative">
                            <div className="h-32 w-full overflow-hidden">
                                <img
                                    alt="cover"
                                    src={item?.avatar}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="p-4">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text_first">
                                        {item?.name}
                                    </h3>
                                    <p className="text-sm mb-4 text_secondary">
                                        {item?.members} <FormattedMessage id="social.group.members" />
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        type="primary"
                                        className="flex-1 btn_custom_accept"
                                        onClick={() => handleNavigateToDetail({ object: { ...item?.groupDetail }, type: 'group', navigate })}
                                    >
                                        <FormattedMessage id="social.group.access" />
                                    </Button>
                                    {!isAdmin && (
                                        <BtnRequestGroup
                                            group={{
                                                documentId: item?.groupDetail?.documentId,
                                                name: item?.name
                                            }}
                                            status="leave_group"
                                            setStatusRequestSend={(newStatus) => handleStatusChange(item?.groupDetail?.documentId, newStatus)}
                                            onSuccessLeave={onLeaveSuccess}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            );
        });
    };

    return (
        <>
            <Card className="profile-groups-card mb-6">
                <h2 className="text-xl font-bold mb-6 text_first">
                    <FormattedMessage id="social.group.joined_groups" defaultMessage="Joined Groups" />
                </h2>
                <Row gutter={16}>{renderGroupCards()}</Row>
            </Card>
        </>
    );
};

export default ListGroupCard; 