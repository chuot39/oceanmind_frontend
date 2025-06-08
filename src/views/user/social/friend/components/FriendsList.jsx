import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Input, Spin } from 'antd';
import { BsGrid3X3Gap, BsList } from 'react-icons/bs';
import FriendCard from './FriendCard';
import FriendListItem from './FriendListItem';
import { useFriend } from '@/views/user/components/hook';
import BtnLoadMore from '@/components/button/ui/BtnLoadMore';

const { Search } = Input;

const FriendsList = ({ userData, intl }) => {
    const { status: statusFriends, data: friendsData, fetchNextPage, hasNextPage, isFetchingNextPage } = useFriend(userData?.documentId);

    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');

    // Flatten all pages of friends data
    const allFriends = friendsData?.pages?.flatMap(page => page.data) || [];

    const filteredFriends = allFriends?.filter(item =>
        item?.friend?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.friend?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle load more button click
    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };


    return (
        <div className="friend-list-container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                <Search
                    className="w-full md:w-64"
                    placeholder={intl.formatMessage({ id: 'dashboard.search.placeholder' })}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    allowClear
                    value={searchQuery}
                />
                <div className="view-mode-toggle">
                    <Button
                        type={viewMode === 'list' ? 'primary' : 'default'}
                        icon={<BsList />}
                        onClick={() => setViewMode('list')}
                        className="mr-2"
                    />
                    <Button
                        type={viewMode === 'grid' ? 'primary' : 'default'}
                        icon={<BsGrid3X3Gap />}
                        onClick={() => setViewMode('grid')}
                    />
                </div>
            </div>

            {statusFriends === 'loading' ? (
                <div className="flex justify-start items-start gap-6 h-[calc(100vh-150px)]">
                    <Card className="w-72 h-52" loading={true}></Card>
                    <Card className="w-72 h-52" loading={true}></Card>
                    <Card className="w-72 h-52" loading={true}></Card>
                </div>
            ) : (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFriends?.map(item => (
                            <FriendCard
                                key={item?.friend?.documentId}
                                friend={item?.friend}
                                type="friends"
                                userData={userData}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredFriends?.map(item => (
                            <FriendListItem
                                key={item?.friend?.documentId}
                                friend={item?.friend}
                                type="friends"
                                userData={userData}
                            />
                        ))}
                    </div>
                )
            )}
            {isFetchingNextPage && (
                <div className="flex justify-center my-4">
                    <Spin />
                </div>
            )}

            {hasNextPage && !isFetchingNextPage && filteredFriends.length > 0 && (
                <div className="flex justify-center mt-6" onClick={handleLoadMore}>
                    <BtnLoadMore />
                </div>
            )}
        </div>
    );
};

export default FriendsList;
