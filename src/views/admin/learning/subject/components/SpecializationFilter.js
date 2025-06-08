import React from 'react';
import { Select } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAllSpecializations } from '../hook';

const { Option } = Select;

const SpecializationFilter = ({ value, onChange }) => {
    const intl = useIntl();
    const { data: specializations, isLoading } = useAllSpecializations();

    const handleChange = (value) => {
        onChange(value);
    };

    return (
        <Select
            placeholder={intl.formatMessage({
                id: 'subject.filter.specialization.placeholder',
                defaultMessage: 'Filter by specialization'
            })}
            value={value}
            onChange={handleChange}
            allowClear
            loading={isLoading}
            style={{ width: '100%' }}
        >
            {specializations?.map(spec => (
                <Option key={spec.documentId} value={spec.documentId}>
                    {spec.name_vi}
                </Option>
            ))}
        </Select>
    );
};

export default SpecializationFilter; 