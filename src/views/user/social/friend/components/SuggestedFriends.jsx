import React, { useState } from 'react';
import { Button, Card, Input } from 'antd';
import { BsGrid3X3Gap, BsList, BsSearch } from 'react-icons/bs';
import FriendCard from './FriendCard';
import FriendListItem from './FriendListItem';
import { useIntl } from 'react-intl';
import { useSuggestFriend } from '@/views/user/components/hook';
import BtnLoadMore from '@/components/button/ui/BtnLoadMore';

const { Search } = Input;

const SuggestedFriends = ({ userData, intl }) => {

    const { status: statusSuggestFriends, data: suggestFriends, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuggestFriend(userData?.documentId);
    const allFriends = suggestFriends?.pages?.flatMap(page => page.data) || [];

    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFriends = allFriends?.filter(friend =>
        friend?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    placeholder={intl.formatMessage({
                        id: 'dashboard.search.placeholder',
                        defaultMessage: "Enter subject name"
                    })}
                    allowClear
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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

            {statusSuggestFriends === 'loading' ? (
                <div className="flex justify-start items-start gap-6 h-[calc(100vh-150px)]">
                    <Card className="w-72 h-52" loading={true}></Card>
                    <Card className="w-72 h-52" loading={true}></Card>
                    <Card className="w-72 h-52" loading={true}></Card>
                </div>
            ) : (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFriends?.map(friend => (
                            <FriendCard
                                key={friend?.id}
                                friend={friend}
                                type="all"
                                userData={userData}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredFriends?.map(friend => (
                            <FriendListItem
                                key={friend?.id}
                                friend={friend}
                                type="all"
                                userData={userData}
                            />
                        ))}
                    </div>
                )
            )}

            {hasNextPage && !isFetchingNextPage && filteredFriends.length > 0 && (
                <div className="flex justify-center mt-6" onClick={handleLoadMore}>
                    <BtnLoadMore />
                </div>
            )}
        </div>
    );
};

export default SuggestedFriends;
