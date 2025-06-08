import React from 'react';
import { Select } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAllCategories } from '../hook';

const { Option } = Select;

const CategoryFilter = ({ value, onChange }) => {
    const intl = useIntl();
    const { data: categories, isLoading } = useAllCategories();

    const handleChange = (value) => {
        onChange(value);
    };

    return (
        <Select
            placeholder={intl.formatMessage({
                id: 'subject.filter.category.placeholder',
                defaultMessage: 'Filter by category'
            })}
            value={value}
            onChange={handleChange}
            allowClear
            loading={isLoading}
            style={{ width: '100%' }}
        >
            {categories?.map(category => (
                <Option key={category.documentId} value={category.documentId}>
                    {category.name_vi}
                </Option>
            ))}
        </Select>
    );
};

export default CategoryFilter; 