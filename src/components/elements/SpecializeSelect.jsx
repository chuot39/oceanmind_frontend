import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import Select from 'react-select';
import { customStyles } from '@/utils/Utils';
import { useSpecialized } from '@/views/user/profile/manage_account/hook';
import useSkin from '@/utils/hooks/useSkin';

const SpecializeSelect = ({ value, onChange, disabled, facultyId }) => {
    const intl = useIntl();
    const { language } = useSkin();
    const [selectedValue, setSelectedValue] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [prevFacultyId, setPrevFacultyId] = useState(facultyId);

    // Fetch specialized data based on facultyId
    const { data: specialized, status: specializedStatus } = useSpecialized(facultyId);

    // Process options with useMemo to avoid unnecessary recalculations
    const options = useMemo(() => {
        if (!specialized?.data) return [];
        return specialized.data.map(item => ({
            value: item.documentId,
            label: language === 'vi' ? item.name_vi : item.name_en,
            ...item
        }));
    }, [specialized, language]);

    // Filtered options based on search query
    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        return options.filter(option =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    // Update selected value when prop changes or language changes
    useEffect(() => {
        if (value) {
            const found = options.find(option => option.value === value);
            setSelectedValue(found || null);
        } else {
            setSelectedValue(null);
        }
    }, [value, options]);

    // Clear selected value when facultyId changes
    useEffect(() => {
        if (prevFacultyId !== facultyId && prevFacultyId !== undefined) {
            setSelectedValue(null);
            setSearchQuery('');
            if (onChange) {
                onChange(null);
            }
        }
        setPrevFacultyId(facultyId);
    }, [facultyId, prevFacultyId, onChange]);

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
                    onChange?.(val?.value);
                }}
                placeholder={intl.formatMessage({ id: 'select.select_specialized' }) || "Select specialized"}
                isDisabled={disabled || specializedStatus === 'loading'}
                isClearable
                isLoading={specializedStatus === 'loading'}
                noOptionsMessage={() => intl.formatMessage({ id: 'select.no_options' }) || "No options"}
                filterOption={() => true} // Disable default filtering to use our custom filtering
                key={facultyId || 'no-faculty'} // Force re-render when facultyId changes
            />
        </div>
    );
};

export default SpecializeSelect;
