export const getFirstLetter = (text) => {
    return text
        ?.split(' ')           // Split the string by spaces
        ?.map(word => word.charAt(0).toUpperCase())  // Get the first character and convert it to uppercase
        ?.join('');
};


export const getGradientColor = (letter) => {
    const gradients = {
        A: 'linear-gradient(45deg, #FF6B6B, #FFE66D)',
        B: 'linear-gradient(45deg, #4ECDC4, #556270)',
        C: 'linear-gradient(45deg, #556270, #4ECDC4)',
        D: 'linear-gradient(45deg, #5691c8, #457fca)',
        E: 'linear-gradient(45deg, #B24592, #F15F79)',
        F: 'linear-gradient(45deg, #00C9FF, #92FE9D)',
        G: 'linear-gradient(45deg, #FC466B, #3F5EFB)',
        H: 'linear-gradient(45deg, #3F2B96, #A8C0FF)',
        I: 'linear-gradient(45deg, #11998e, #38ef7d)',
        J: 'linear-gradient(45deg, #108dc7, #ef8e38)',
        K: 'linear-gradient(45deg, #FC5C7D, #6A82FB)',
        L: 'linear-gradient(45deg, #c94b4b, #4b134f)',
        M: 'linear-gradient(45deg, #23074d, #cc5333)',
        N: 'linear-gradient(45deg, #544a7d, #ffd452)',
        O: 'linear-gradient(45deg, #009FFF, #ec2F4B)',
        P: 'linear-gradient(45deg, #654ea3, #eaafc8)',
        Q: 'linear-gradient(45deg, #6190E8, #A7BFE8)',
        R: 'linear-gradient(45deg, #44A08D, #093637)',
        S: 'linear-gradient(45deg, #200122, #6f0000)',
        T: 'linear-gradient(45deg, #0575E6, #021B79)',
        U: 'linear-gradient(45deg, #4568DC, #B06AB3)',
        V: 'linear-gradient(45deg, #43C6AC, #191654)',
        W: 'linear-gradient(45deg, #093028, #237A57)',
        X: 'linear-gradient(45deg, #6D6027, #D3CBB8)',
        Y: 'linear-gradient(45deg, #1A2980, #26D0CE)',
        Z: 'linear-gradient(45deg, #FF512F, #DD2476)',
    };

    const defaultGradient = 'linear-gradient(45deg, #4b6cb7, #182848)';
    return gradients[letter?.toUpperCase()] || defaultGradient;
};


export const getTagColor = (tagName) => {

    const tags = {
        primary: 'tag-primary',
        success: 'tag-success',
        warning: 'tag-warning',
        error: 'tag-error',
        info: 'tag-info',
        default: 'tag-default',
        processing: 'tag-processing',
    };

    // Get the first character of the tagName, convert it to uppercase
    const firstChar = tagName?.charAt(0)?.toUpperCase();

    // Create an array of tag keys
    const tagKeys = Object.keys(tags);

    // Determine the index based on the character's charCode
    const index = firstChar?.charCodeAt(0) % tagKeys?.length;

    // Return the corresponding tag class
    return tags[tagKeys[index]];
};

export const getPlaceholderSocial = (value) => {
    switch (value) {
        case 'phone':
            return '0368686868';
        case 'address':
            return '275 Tây Sơn - Đống Đa - Hà Nội';
        case 'tiktok':
            return 'https://www.tiktok.com/@username';
        case 'instagram':
            return 'https://www.instagram.com/username';
        case 'facebook':
            return 'https://www.facebook.com/username';
        case 'youtube':
            return 'https://www.youtube.com/username';
        case 'twitter':
            return 'https://www.twitter.com/username';
        case 'linkedin':
            return 'https://www.linkedin.com/username';
        case 'github':
            return 'https://www.github.com/username';
        case 'gitlab':
            return 'https://www.gitlab.com/username';
        case 'bitbucket':
            return 'https://www.bitbucket.com/username';
        case 'zalo':
            return 'https://zalo.me/username';
        case 'whatsapp':
            return 'https://wa.me/username';
        case 'telegram':
            return 'https://t.me/username';
        case 'snapchat':
            return 'https://snapchat.com/username';

        default:
            return '';
    }
};

