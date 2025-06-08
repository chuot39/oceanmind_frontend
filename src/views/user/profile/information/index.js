import React, { useEffect, useMemo, useState } from 'react';
import { Tabs } from 'antd';
import { BsPerson, BsPeople, BsFileText, BsGrid } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUserData } from '@utils/hooks/useAuth';
import '@core/scss/styles/pages/profile/index.scss';
import { useFriend } from '../../components/hook';
import useSkin from '@/utils/hooks/useSkin';
import InfoCard from './components/InfoCard';
import ContactCard from './components/ContactCard';
import OverviewCard from './components/OverviewCard';
import ConnectionsCard from './components/ConnectionsCard';
import GroupsCard from './components/GroupsCard';
import ListGroupCard from './components/ListGroupCard';
import PostList from './components/PostList';
import ProfileHeader from './components/ProfileHeader';
import FriendsList from '../../social/friend/components/FriendsList';
import { useGroup } from '../../social/group/hook';


const Information = () => {
    const { userData } = useUserData();
    const intl = useIntl();
    const { skin } = useSkin();
    const { status: statusFriend, data: userFriends, fetchNextPage, hasNextPage, isFetchingNextPage } = useFriend(userData?.documentId)
    const { status: statusGroupUser, data: groupUser, fetchNextPage: fetchNextPageGroup, hasNextPage: hasNextPageGroup, isFetchingNextPage: isFetchingNextPageGroup } = useGroup(userData?.documentId)
    const [localGroups, setLocalGroups] = useState(groupUser?.data || []);

    const allFriends = userFriends?.pages?.flatMap(page => page?.data) || []
    const allGroups = groupUser?.pages?.flatMap(page => page?.data) || []

    useEffect(() => {
        if (allGroups) {
            setLocalGroups(allGroups);
        }
    }, [groupUser])

    // console.log('groupUser', groupUser)
    // console.log('localGroups', localGroups)

    const groupList = useMemo(() => localGroups?.map(item => ({
        name: item?.group?.name,
        avatar: item?.group?.coverImage?.file_path,
        members: item?.group?.memberCount,
        role: item?.group?.creator?.username === userData?.username ? 'Leader' : 'Member',
        groupDetail: item?.group,
        ...item
    })), [localGroups, userData])



    // Hàm xử lý khi rời nhóm thành công
    const handleSuccessLeave = (groupId) => {
        setLocalGroups(currentGroups =>
            currentGroups.filter(group => group?.group?.documentId !== groupId)
        );
    };


    const tabItems = [
        {
            key: 'profile',
            label: (
                <span className="flex items-center gap-2">
                    <BsPerson />
                    <FormattedMessage id="profile.tabs.profile" defaultMessage="Profile" />
                </span>
            ),
            children: (
                <div className="flex flex-row gap-6">
                    <div className="flex w-2/5 flex-col">
                        <InfoCard userData={userData} />
                        <ContactCard userData={userData} />
                        <OverviewCard userData={userData} allFriends={allFriends} statusFriend={statusFriend} />
                    </div>
                    <div className="flex w-3/5 flex-col gap-6  ">
                        <ConnectionsCard allFriends={allFriends} statusFriend={statusFriend} />
                        <GroupsCard groupList={groupList} statusGroupUser={statusGroupUser} userData={userData} setLocalGroups={handleSuccessLeave} />
                    </div>
                </div>
            )
        },
        {
            key: 'groups',
            label: (
                <span className="flex items-center gap-2">
                    <BsPeople />
                    <FormattedMessage id="profile.tabs.groups" defaultMessage="Groups" />
                </span>
            ),
            children: <ListGroupCard skin={skin} groupList={groupList} statusGroupUser={statusGroupUser} userData={userData} onLeaveSuccess={handleSuccessLeave} />
        },
        {
            key: 'posts',
            label: (
                <span className="flex items-center gap-2">
                    <BsFileText />
                    <FormattedMessage id="profile.tabs.posts" defaultMessage="Posts" />
                </span>
            ),
            children: <PostList skin={skin} userData={userData} />
        },
        {
            key: 'friends',
            label: (
                <span className="flex items-center gap-2">
                    <BsGrid />
                    <FormattedMessage id="profile.tabs.friends" defaultMessage="Friends" />
                </span>
            ),
            children: <FriendsList userData={userData} intl={intl} />
        }
    ];

    return (
        <div className="profile-page p-6">
            <ProfileHeader userData={userData} />

            <Tabs defaultActiveKey="profile" className="profile-nav" items={tabItems} />

            {/* <div className="mt-6">
                <ProjectsCard projects={projects} />
            </div> */}
        </div>
    );
};

export default Information;