import React, { useState } from 'react';
import { Card, Avatar, Button } from 'antd';
import { BtnRequestFriend } from '@/components/button/ui';

const ListFriendCard = ({ skin, friends, userData }) => {
    const [friendStatuses, setFriendStatuses] = useState({});

    // Handle status update from child component
    const handleStatusChange = (friendId, newStatus) => {
        setFriendStatuses(prev => ({
            ...prev,
            [friendId]: newStatus
        }));
    };

    const FriendCard = ({ item }) => {
        return (
            <Card
                className="friend-card w-full"
                cover={
                    <div className="h-40 overflow-hidden">
                        <img
                            alt="cover"
                            src={`${item?.details?.banner_url_id?.file_path}`}
                            className="w-full h-full object-fill"
                        />
                    </div>
                }
            >
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <Avatar
                            size={64}
                            src={`${item?.details?.avatar_url_id?.file_path}`}
                            className=" border-4 avatar_friend"
                        />
                        <div className=' items-center gap-2'>
                            <h3 className={`text-lg font-semibold ${skin === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                {item?.details?.fullname}
                            </h3>
                            <p className="text-sm text-gray-500">
                                @{item?.details?.username}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {/* Sử dụng BtnRequestFriend để quản lý trạng thái bạn bè */}
                        <BtnRequestFriend
                            friend={{
                                documentId: item?.details?.documentId,
                                fullname: item?.details?.fullname,
                                username: item?.details?.username
                            }}
                            status={friendStatuses[item?.details?.documentId] || "chat_now"}
                            setStatusRequestSend={(newStatus) => handleStatusChange(item?.details?.documentId, newStatus)}
                        />
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends?.filter(item => item?.details?.documentId !== userData?.documentId)?.map((item) => (
                <FriendCard key={item?.details?.documentId} item={item} />
            ))}
        </div>
    );
};

export default ListFriendCard; 