import imageService from "@/services/media/imageService";
import { BsPhone, BsEnvelope, BsFacebook, BsGithub, BsInstagram, BsLinkedin, BsTiktok, BsYoutube } from 'react-icons/bs';
import { SiZalo } from 'react-icons/si';



export const uploadImage = async (file, folder = "banner") => {

    // 1. Upload file to Strapi Media Library
    // const uploadedFile = await imageService.uploadToMediaLibrary(file);
    const uploadedFile = await imageService.uploadToCloudinary(file, folder);

    // 2. Create media file record with file information
    const mediaFileData = {
        file_path: uploadedFile?.url,
        file_type: uploadedFile?.mime,
        file_size: uploadedFile?.size,
    };

    const mediaFileResponse = await imageService.createMediaFileRecord(mediaFileData);

    return mediaFileResponse;
}

export const getIcon = (platform) => {
    switch (platform) {
        case 'phone':
            return <BsPhone />;
        case 'email':
            return <BsEnvelope />;
        case 'facebook':
            return <BsFacebook />;
        case 'github':
            return <BsGithub />;
        case 'instagram':
            return <BsInstagram />;
        case 'linkedin':
            return <BsLinkedin />;
        case 'tiktok':
            return <BsTiktok />;
        case 'youtube':
            return <BsYoutube />;
        case 'zalo':
            return <SiZalo />;

        default:
            return null;
    }
}

