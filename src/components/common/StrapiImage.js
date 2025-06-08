import React from 'react';
import PropTypes from 'prop-types';

const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';


const StrapiImage = ({ src, alt, className, ...props }) => {
    // Xử lý URL
    const fullSrc = src && !src.startsWith('http') && !src.startsWith('data:')
        ? `${STRAPI_BASE_URL}${src}`
        : src;

    return (
        <img
            src={fullSrc}
            alt={alt || 'Image'}
            className={className}
            {...props}
            onError={(e) => {
                console.error('Error loading image:', src);
                e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
            }}
        />
    );
};

StrapiImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    className: PropTypes.string
};

export default StrapiImage; 