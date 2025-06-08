import React from 'react';
import { Select } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useBatches } from '../hook';

const { Option } = Select;

const BatchFilter = ({ value, onChange }) => {
    const intl = useIntl();
    const { data: batches, isLoading } = useBatches();

    const handleChange = (value) => {
        onChange(value);
    };

    return (
        <Select
            placeholder={intl.formatMessage({
                id: 'admin.class.filter_batch',
                defaultMessage: 'Filter by batch'
            })}
            value={value}
            onChange={handleChange}
            allowClear
            loading={isLoading}
            style={{ width: '100%' }}
        >
            {batches?.map(batch => (
                <Option key={batch.documentId} value={batch.documentId}>
                    {batch.name}
                </Option>
            ))}
        </Select>
    );
};

export default BatchFilter; 