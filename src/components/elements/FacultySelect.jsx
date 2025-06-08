import React, { useState, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { customStyles } from "@/utils/Utils";
import { useFaculty } from "@/views/user/learning/training_program/hook";
import useSkin from "@/utils/hooks/useSkin";
import AsyncSelect from "react-select/async";

const FacultySelect = ({ value, onChange, disabled }) => {
    const intl = useIntl();
    const { language } = useSkin();
    const [selectedValue, setSelectedValue] = useState(null);

    console.log('value', value);
    // Fetch faculties
    const { data: faculties, status: facultyStatus } = useFaculty();

    // Process options with useMemo to avoid unnecessary recalculations
    const options = useMemo(() => {
        if (!faculties?.data) return [];
        return faculties.data.map(faculty => ({
            documentId: faculty.documentId,
            name: language === 'vi' ? faculty.name_vi : faculty.name_en,
            ...faculty
        }));
    }, [faculties, language]);

    console.log('options faculty', options);

    // Update selected value when prop changes or language changes
    useEffect(() => {
        if (value) {
            const found = options.find(option => option.documentId === value);
            setSelectedValue(found || value);
        } else {
            setSelectedValue(null);
        }
    }, [value, options]);

    // Function to load options for AsyncSelect with filtering
    const loadOptions = (inputValue, callback) => {
        const filtered = inputValue
            ? options.filter(option =>
                option.name.toLowerCase().includes(inputValue.toLowerCase())
            )
            : options;

        callback(filtered);
    };

    return (
        <div className="ant-select-wrapper" style={{ width: '100%' }}>
            <AsyncSelect
                className="async-select"
                styles={customStyles}
                cacheOptions
                defaultOptions={options}
                value={selectedValue}
                getOptionLabel={(option) => option?.name}
                getOptionValue={(option) => option?.documentId}
                loadOptions={loadOptions}
                onChange={(val) => {
                    setSelectedValue(val);
                    onChange?.(val);
                }}
                placeholder={intl.formatMessage({ id: 'select.select_faculty' }) || "Select faculty"}
                isDisabled={disabled || facultyStatus === 'loading'}
                isClearable
                isLoading={facultyStatus === 'loading'}
                noOptionsMessage={() => intl.formatMessage({ id: 'select.no_options' }) || "No options"}
            />
        </div>
    );
};

export default FacultySelect;
