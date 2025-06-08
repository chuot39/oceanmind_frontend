import React from 'react';
import { Select } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSpecializations } from '../hook';
import useSkin from '@/utils/hooks/useSkin';

const { Option } = Select;

const SpecializationFilter = ({ value, onChange }) => {
    const intl = useIntl();
    const { data: specializations, isLoading } = useSpecializations();
    const { language } = useSkin()

    const handleChange = (value) => {
        onChange(value);
    };

    return (
        <Select
            placeholder={intl.formatMessage({
                id: 'admin.class.filter_specialization',
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
                    {language === 'vi' ? spec.name_vi : spec.name_en}
                </Option>
            ))}
        </Select>
    );
};

export default SpecializationFilter; 