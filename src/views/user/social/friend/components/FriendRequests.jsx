import React, { useState } from 'react';
import { Button, Card, Divider, Input, Tabs, Typography } from 'antd';
import { BsGrid3X3Gap, BsList } from 'react-icons/bs';
import FriendCard from './FriendCard';
import FriendListItem from './FriendListItem';
import { FormattedMessage } from 'react-intl';
import { useFriendRequestSend, useFriendRequestReceive } from '../hook';

const { Search } = Input;
const { Title } = Typography;

const FriendRequests = ({ userData, intl, skin }) => {

    const { status: statusFriendRequestSend, data: friendsSend } = useFriendRequestSend(userData?.documentId);
    const { status: statusFriendRequestReceive, data: friendsReceive } = useFriendRequestReceive(userData?.documentId);


    const [viewModeRequest, setViewModeRequest] = useState('grid');
    const [viewModeReceive, setViewModeReceive] = useState('grid');
    const [searchQueryRequest, setSearchQueryRequest] = useState('');
    const [searchQueryReceive, setSearchQueryReceive] = useState('');


    const filteredFriendsRequest = friendsSend?.data?.filter(friend =>
        friend?.friend?.fullname?.toLowerCase().includes(searchQueryRequest.toLowerCase()) ||
        friend?.friend?.username?.toLowerCase().includes(searchQueryRequest.toLowerCase())
    );

    const filteredFriendsReceive = friendsReceive?.data?.filter(friend =>
        friend?.user?.fullname?.toLowerCase().includes(searchQueryReceive.toLowerCase()) ||
        friend?.user?.username?.toLowerCase().includes(searchQueryReceive.toLowerCase())
    );


    return (
        <>
            <div className="friend-list-container">
                <Title level={4} className="mb-6">
                    <FormattedMessage
                        id="social.friend.received.requests"
                        defaultMessage="Friend Requests Received"
                    />
                    <span className="text-sm text-gray-500 ml-2">
                        ({filteredFriendsReceive?.length || 0})
                    </span>
                </Title>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <Search
                        placeholder={intl.formatMessage({ id: 'dashboard.search.placeholder' })}
                        onChange={(e) => setSearchQueryReceive(e.target.value)}
                        className="w-full md:w-64"
                        allowClear
                        value={searchQueryReceive}
                    />
                    <div className="view-mode-toggle">
                        <Button
                            type={viewModeReceive === 'list' ? 'primary' : 'default'}
                            icon={<BsList />}
                            onClick={() => setViewModeReceive('list')}
                            className="mr-2"
                        />
                        <Button
                            type={viewModeReceive === 'grid' ? 'primary' : 'default'}
                            icon={<BsGrid3X3Gap />}
                            onClick={() => setViewModeReceive('grid')}
                        />
                    </div>
                </div>

                {statusFriendRequestReceive === 'loading' ? (
                    <div className="flex justify-start items-start gap-6 h-[calc(100vh-150px)]">
                        <Card className="w-72 h-52" loading={true}></Card>
                        <Card className="w-72 h-52" loading={true}></Card>
                        <Card className="w-72 h-52" loading={true}></Card>
                    </div>
                ) : (
                    viewModeReceive === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredFriendsReceive?.map(friend => (
                                <FriendCard
                                    key={friend?.documentId}
                                    friend={friend?.user}
                                    type="received"
                                    userData={userData}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFriendsReceive?.map(friend => (
                                <FriendListItem
                                    key={friend?.documentId}
                                    friend={friend?.user}
                                    type="received"
                                    userData={userData}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>

            <Divider className={`my-6 border-2 ${skin === 'dark' ? 'border-gray-300' : 'border-gray-500'}`} />

            <div className="friend-list-container mt-9">
                <Title level={4} className="mb-6">
                    <FormattedMessage
                        id="social.friend.sent.requests"
                        defaultMessage="Friend Requests Sent"
                    />
                    <span className="text-sm text-gray-500 ml-2">
                        ({filteredFriendsRequest?.length || 0})
                    </span>
                </Title>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <Search
                        placeholder={intl.formatMessage({ id: 'dashboard.search.placeholder' })}
                        onChange={(e) => setSearchQueryRequest(e.target.value)}
                        className="w-full md:w-64"
                        allowClear
                        value={searchQueryRequest}
                    />
                    <div className="view-mode-toggle">
                        <Button
                            type={viewModeRequest === 'list' ? 'primary' : 'default'}
                            icon={<BsList />}
                            onClick={() => setViewModeRequest('list')}
                            className="mr-2"
                        />
                        <Button
                            type={viewModeRequest === 'grid' ? 'primary' : 'default'}
                            icon={<BsGrid3X3Gap />}
                            onClick={() => setViewModeRequest('grid')}
                        />
                    </div>
                </div>
                {viewModeRequest === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredFriendsRequest?.map(friend => (
                            <FriendCard
                                key={friend?.documentId}
                                friend={friend?.friend}
                                type="requests"
                                userData={userData}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredFriendsRequest?.map(friend => (
                            <FriendListItem
                                key={friend?.documentId}
                                friend={friend?.friend}
                                type="requests"
                                userData={userData}
                            />
                        ))}
                    </div>
                )}

            </div>
        </>

    );
};

export default FriendRequests;
