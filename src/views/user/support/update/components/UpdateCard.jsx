import React from 'react';
import { Card } from 'antd';

const UpdateCard = ({ icon, title, description }) => {
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                    <span className="text-3xl">{icon}</span>
                </div>
                <h2 className="text-lg font-semibold mb-3">{title}</h2>
                <p className="text_secondary text-sm">{description}</p>
            </div>
        </Card>
    );
};

export default UpdateCard; 