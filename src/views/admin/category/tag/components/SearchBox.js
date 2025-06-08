import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchBox = ({ value, onChange, onSearch }) => {
    return (
        <Input
            placeholder="Search by tag name"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPressEnter={() => onSearch()}
            className="w-full md:w-64"
            allowClear
        />
    );
};

export default SearchBox; 