import React from 'react';
import { Select } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useYearsForFilter } from '../hook';

const { Option } = Select;

const YearFilter = ({ value, onChange }) => {
    const intl = useIntl();
    const { data: years, isLoading } = useYearsForFilter();

    const handleChange = (value) => {
        onChange(value);
    };

    return (
        <Select
            placeholder={intl.formatMessage({
                id: 'batch.filter.year.placeholder',
                defaultMessage: 'Filter by academic year'
            })}
            value={value}
            onChange={handleChange}
            allowClear
            loading={isLoading}
            style={{ width: '100%' }}
        >
            {years?.map(year => (
                <Option key={year} value={year}>
                    {year} - {year + 1}
                </Option>
            ))}
        </Select>
    );
};

export default YearFilter; 