import React from 'react';
import { Avatar, Button, Tooltip, Divider, Card } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone, FaGlobe, FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaBriefcase } from 'react-icons/fa';
import '../styles.scss';
import { getIcon } from '@/helpers/imgHelper';
import BtnSocial from '@/components/button/action/BtnSocial';

const ProfileHeader = ({ profile }) => {
    if (!profile) return null;

    console.log('profile', profile);
    return (
        <Card className="profile-header">
            {/* Cover Image */}
            <div
                className="cover-image"
                style={{
                    backgroundImage: `url(${profile?.banner?.file_path})`,
                    height: '250px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '6px',
                    position: 'relative'
                }}
            />

            {/* Profile Info Section */}
            <div className="profile-info p-6 rounded-b-lg relative">
                {/* Avatar */}
                <div className="avatar-container absolute -top-16 left-8">
                    <Avatar
                        src={profile?.avatar?.file_path}
                        size={120}
                        className="border-4 border-white shadow-md"
                    />
                </div>

                {/* Name and Bio */}
                <div className="ml-36 mt-2">
                    <h1 className="text-2xl font-bold mb-1">{profile?.fullname}</h1>
                    <p className="text_secondary mb-4">{profile?.biography}</p>

                    {/* Basic Info */}
                    <div className="flex flex-wrap gap-4 text_secondary mb-4">
                        {profile?.address && (
                            <Tooltip title="Location">
                                <div className="flex items-center gap-1">
                                    <FaMapMarkerAlt />
                                    <span>{profile?.address}</span>
                                </div>
                            </Tooltip>
                        )}

                        {profile?.career && (
                            <Tooltip title="Career">
                                <div className="flex items-center gap-1">
                                    <FaBriefcase />
                                    <span>{profile?.career?.name}</span>
                                </div>
                            </Tooltip>
                        )}

                        {profile?.email && (
                            <Tooltip title="Email">
                                <div className="flex items-center gap-1">
                                    <FaEnvelope />
                                    <span>{profile?.email}</span>
                                </div>
                            </Tooltip>
                        )}

                        {profile?.phone && (
                            <Tooltip title="Phone">
                                <div className="flex items-center gap-1">
                                    <FaPhone />
                                    <span>{profile?.phone}</span>
                                </div>
                            </Tooltip>
                        )}

                        {profile?.website && (
                            <Tooltip title="Website">
                                <div className="flex items-center gap-1">
                                    <FaGlobe />
                                    <a href={profile?.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        {profile?.website?.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            </Tooltip>
                        )}
                    </div>

                    {/* Social Links */}
                    {/* {profile?.socialLinks && (
                        <div className="flex gap-3 mb-2">
                            {profile?.socialLinks?.map(item => (
                                <Tooltip title={item?.social?.platform}>
                                    <a
                                        href={item?.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className=" text-xl"
                                    >
                                        {getIcon(item?.social?.platform?.toLowerCase())}
                                    </a>
                                </Tooltip>

                            ))}

                        </div>
                    )} */}

                    <BtnSocial />
                </div>

                {/* Action Buttons */}
                <div className="absolute top-6 right-6 flex gap-2">
                    <Button type="primary">
                        <FormattedMessage id="profile.connect" defaultMessage="Connect" />
                    </Button>
                    <Button>
                        <FormattedMessage id="profile.message" defaultMessage="Message" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ProfileHeader; 