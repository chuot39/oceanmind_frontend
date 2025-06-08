import React from 'react';
import { Image, Empty, Tabs, Button, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import useSkin from '@/utils/hooks/useSkin';
import { useMediaGroup } from '../hook';
import Hamster from '@/components/loader/Hamster/Hamster';
import BtnLoadMore from '@/components/button/ui/BtnLoadMore';
import Loading from '@/components/loader/Loading';

const Media = ({ group }) => {
    const { skin } = useSkin()

    const { status: mediaGroupStatus, data: mediaGroup, fetchNextPage, hasNextPage, isFetchingNextPage } = useMediaGroup(group?.documentId);

    console.log('mediaGroup: ', mediaGroup);
    // Extract all media from posts
    const allMedia = mediaGroup?.pages?.flatMap(page => page.data) || [];


    console.log('allMedia: ', allMedia);
    // Filter media by type
    const images = allMedia.filter(item =>
        item?.src?.match(/\.(jpeg|jpg|gif|png)$/i)
    );

    const videos = allMedia.filter(item =>
        item?.src?.match(/\.(mp4|webm|ogg|mkv)$/i)
    );

    // Define tabs
    const items = [
        {
            key: 'all',
            label: <FormattedMessage id="social.group.media.all" />,
            children: (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {allMedia.length > 0 ? (
                        <Image.PreviewGroup>
                            {allMedia.map((item) => (
                                <div key={item.id} className="aspect-square overflow-hidden rounded-lg">
                                    <Image
                                        src={item.src}
                                        alt="Media"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </Image.PreviewGroup>
                    ) : (
                        <div className="col-span-full">
                            <Empty
                                description={<FormattedMessage id="social.group.no_media" />}
                                className="py-8"
                            />
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'images',
            label: <FormattedMessage id="social.group.media.images" />,
            children: (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.length > 0 ? (
                        <Image.PreviewGroup>
                            {images.map((item) => (
                                <div key={item.id} className="aspect-square overflow-hidden rounded-lg">
                                    <Image
                                        src={item.src}
                                        alt="Image"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </Image.PreviewGroup>
                    ) : (
                        <div className="col-span-full">
                            <Empty
                                description={<FormattedMessage id="social.group.no_images" />}
                                className="py-8"
                            />
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'videos',
            label: <FormattedMessage id="social.group.media.videos" />,
            children: (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {videos.length > 0 ? (
                        videos.map((item) => (
                            <div key={item.id} className="aspect-video overflow-hidden rounded-lg">
                                <video
                                    src={item.src}
                                    controls
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <Empty
                                description={<FormattedMessage id="social.group.no_videos" />}
                                className="py-8"
                            />
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (
        // <div className="mt-4">
        //     <Tabs
        //         items={items}
        //         // className={`media-tabs ${skin === 'dark' ? 'dark-tabs' : ''}`}
        //         className={`media-tabs`}
        //     />
        // </div>

        <>
            {mediaGroupStatus === 'loading' ? (
                <div className="flex justify-center items-center h-full mt-10">
                    <Hamster />
                </div>
            ) : (
                <div className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 display_image_group">

                        {allMedia.length > 0 ? (
                            <Image.PreviewGroup>
                                {allMedia.map((item) => (
                                    <div key={item.documentId} className="h-full overflow-hidden rounded-lg">
                                        <Image
                                            src={item?.file_path}
                                            alt="Media"
                                            className="w-full !h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </Image.PreviewGroup>
                        ) : (
                            <div className="col-span-full">
                                <Empty
                                    description={<FormattedMessage id="social.group.no_media" />}
                                    className="py-8"
                                />
                            </div>
                        )}
                    </div>

                    {hasNextPage && (
                        <div className="flex justify-center mt-6" onClick={() => fetchNextPage()}>
                            {isFetchingNextPage ? (
                                <Loading />
                            ) : (
                                <BtnLoadMore />
                            )}

                        </div>
                    )}
                </div>
            )}
        </>

    );
};

export default Media; 