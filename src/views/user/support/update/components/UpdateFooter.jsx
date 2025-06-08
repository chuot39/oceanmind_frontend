import React from 'react';
import { AiFillHeart } from 'react-icons/ai';

const UpdateFooter = () => {
    return (
        <div className="text-center mt-8 ">
            <p className="flex items-center text_secondary justify-center gap-2">
                Cảm ơn các bạn đã sử dụng OceanMind! Chúng tôi sẽ tiếp tục cải thiện và cập nhật để mang lại những trải nghiệm tốt nhất cho các bạn. Hãy tiếp tục chia sẻ ý kiến và góp ý với chúng tôi nhé!
                <AiFillHeart className="text-red-500" />
            </p>
        </div>
    );
};

export default UpdateFooter; 