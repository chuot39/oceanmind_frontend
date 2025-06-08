import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import Select from 'react-select';
import { customStyles } from '@/utils/Utils';
import { useClass } from '@/views/user/profile/manage_account/hook';

const ClassSelect = ({ value, onChange, disabled, specializedId }) => {
    const intl = useIntl();
    const [selectedValue, setSelectedValue] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [prevSpecializedId, setPrevSpecializedId] = useState(specializedId);

    // Fetch classes data based on specializedId
    const { data: classes, status: classStatus } = useClass(specializedId);

    // Process options with useMemo to avoid unnecessary recalculations
    const options = useMemo(() => {
        if (!classes?.data) return [];
        return classes.data.map(item => ({
            value: item.documentId,
            label: item.name,
            ...item
        }));
    }, [classes]);

    // Filtered options based on search query
    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        return options.filter(option =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    // Update selected value when prop changes
    useEffect(() => {
        if (value) {
            // Handle both object format {value, label} and direct value format
            const valueToFind = typeof value === 'object' && value?.value ? value.value : value;
            const found = options.find(option => option.value === valueToFind);
            setSelectedValue(found || null);
        } else {
            setSelectedValue(null);
        }
    }, [value, options]);

    // Clear selected value when specializedId changes
    useEffect(() => {
        if (prevSpecializedId !== specializedId && prevSpecializedId !== undefined) {
            setSelectedValue(null);
            setSearchQuery('');
            if (onChange) {
                onChange(null);
            }
        }
        setPrevSpecializedId(specializedId);
    }, [specializedId, prevSpecializedId, onChange]);

    // Handle input change for search
    const handleInputChange = (inputValue) => {
        setSearchQuery(inputValue);
    };

    return (
        <div className="ant-select-wrapper" style={{ width: '100%' }}>
            <Select
                className="async-select"
                styles={customStyles}
                options={filteredOptions}
                value={selectedValue}
                onInputChange={handleInputChange}
                onChange={(val) => {
                    setSelectedValue(val);
                    // Return the full object with value and label for labelInValue support
                    onChange?.(val ? { value: val.value, label: val.label } : null);
                }}
                placeholder={intl.formatMessage({ id: 'select.select_class' }) || "Select class"}
                isDisabled={disabled || classStatus === 'loading'}
                isClearable
                isLoading={classStatus === 'loading'}
                noOptionsMessage={() => intl.formatMessage({ id: 'select.no_options' }) || "No options"}
                filterOption={() => true} // Disable default filtering to use our custom filtering
                key={specializedId || 'no-specialized'} // Force re-render when specializedId changes
            />
        </div>
    );
};

export default ClassSelect;
