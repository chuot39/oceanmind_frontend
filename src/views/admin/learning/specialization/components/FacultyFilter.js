import React from 'react';
import { Select } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFacultiesDropdown } from '../hook';

const { Option } = Select;

const FacultyFilter = ({ value, onChange }) => {
    const intl = useIntl();
    const { data: faculties, isLoading } = useFacultiesDropdown();

    const handleChange = (value) => {
        onChange(value);
    };

    return (
        <Select
            placeholder={intl.formatMessage({
                id: 'specialization.filter.faculty.placeholder',
                defaultMessage: 'Filter by faculty'
            })}
            value={value}
            onChange={handleChange}
            allowClear
            loading={isLoading}
            style={{ width: '100%' }}
        >
            {faculties?.map(faculty => (
                <Option key={faculty.documentId} value={faculty.documentId}>
                    {faculty.name_vi}
                </Option>
            ))}
        </Select>
    );
};

export default FacultyFilter; 