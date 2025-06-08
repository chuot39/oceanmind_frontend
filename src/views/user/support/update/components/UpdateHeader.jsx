import React from 'react';
import { Card } from 'antd';
import { BiBell } from 'react-icons/bi';

const UpdateHeader = () => {
    return (
        <Card className="mb-8 shadow-sm">
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <BiBell className="text-2xl text-yellow-400" />
                    <h1 className="text-xl font-semibold">Thông báo và Cập nhật Mới</h1>
                    <BiBell className="text-2xl text-yellow-400" />
                </div>
                <p className="text_secondary">
                    Chào các bạn sinh viên thân mến! Dưới đây là một số cập nhật quan trọng và thông báo mới nhất mà OceanMind muốn chia sẻ với các bạn. Hãy cùng xem và đừng quên kiểm tra thường xuyên nhé!
                </p>
            </div>
        </Card>
    );
};

export default UpdateHeader; 