import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Button, Spin, Result } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { FaUser, FaProjectDiagram, FaFileAlt, FaTrophy } from 'react-icons/fa';

// Components
import ProfileHeader from './components/ProfileHeader';
import About from './components/About';
import Projects from './components/Projects';
import Posts from './components/Posts';
import Achievements from './components/Achievements';

// Hooks
import { useUserProfileByAlias, useUserPostsByAlias, useUserAchievementsByAlias } from './hook';

// Styles
import './styles.scss';
import Hamster from '@/components/loader/Hamster/Hamster';

const ProfileDetail = () => {
    const { alias } = useParams();
    const intl = useIntl();

    const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useUserProfileByAlias(alias);
    const { data: postsData, isLoading: isPostsLoading } = useUserPostsByAlias(alias);
    const { data: achievementsData, isLoading: isAchievementsLoading } = useUserAchievementsByAlias(alias);

    // Extract data
    const posts = postsData?.data;
    const achievements = achievementsData?.data;

    // Handle loading state
    const isLoading = isProfileLoading || isPostsLoading || isAchievementsLoading;

    // Handle error state
    if (isProfileError) {
        return (
            <Result
                status="404"
                title={intl.formatMessage({ id: 'profile.not_found', defaultMessage: 'Profile Not Found' })}
                subTitle={intl.formatMessage({
                    id: 'profile.not_found_message',
                    defaultMessage: 'Sorry, the profile you are looking for does not exist or has been removed.'
                })}
                extra={
                    <Button type="primary" onClick={() => window.history.back()}>
                        <FormattedMessage id="profile.go_back" defaultMessage="Go Back" />
                    </Button>
                }
            />
        );
    }

    // Define tabs
    const items = [
        {
            key: 'about',
            label: (
                <span>
                    <FaUser />
                    <FormattedMessage id="profile.about" defaultMessage="About" />
                </span>
            ),
            children: <About profile={profile} />,
        },
        {
            key: 'projects',
            label: (
                <span>
                    <FaProjectDiagram />
                    <FormattedMessage id="profile.projects" defaultMessage="Projects" />
                </span>
            ),
            children: <Projects profile={profile} />,
        },
        {
            key: 'posts',
            label: (
                <span>
                    <FaFileAlt />
                    <FormattedMessage id="profile.posts" defaultMessage="Posts" />
                </span>
            ),
            children: <Posts posts={posts} profile={profile} />,
        },
        {
            key: 'achievements',
            label: (
                <span>
                    <FaTrophy />
                    <FormattedMessage id="profile.achievements" defaultMessage="Achievements" />
                </span>
            ),
            children: <Achievements achievements={achievements} />,
        },
    ];

    return (
        <div className="profile-detail-page min-h-screen p-4">
            {isLoading ? (
                <div className="flex justify-center items-center h-[calc(100vh-150px)]">
                    <Hamster />
                </div>
            ) : (
                <div className="max-w-5xl mx-auto">
                    {/* Profile Header */}
                    <ProfileHeader profile={profile} />

                    {/* Profile Content */}
                    <div className="rounded-lg shadow-sm p-6">
                        <Tabs
                            defaultActiveKey="about"
                            items={items}
                            className="profile-tabs"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDetail;
