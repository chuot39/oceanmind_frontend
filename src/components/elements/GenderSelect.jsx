import React, { useState, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import { customStyles } from "@/utils/Utils";
import { useGender } from "@/views/user/profile/manage_account/hook";
import useSkin from "@/utils/hooks/useSkin";

const GenderSelect = ({ value, onChange, disabled }) => {
    const intl = useIntl();
    const { language } = useSkin();
    const [selectedValue, setSelectedValue] = useState(null);

    // Fetch genders
    const { data: genders, isLoading } = useGender();

    // Process options with useMemo to avoid unnecessary recalculations
    const options = useMemo(() => {
        if (!genders?.data) return [];
        return genders.data.map(gender => ({
            value: gender.documentId,
            label: language === 'vi' ? gender.name_vi : gender.name_en
        }));
    }, [genders, language]);

    // Update selected value when prop changes or language/options change
    useEffect(() => {
        if (value && options.length > 0) {
            const selectedOption = options.find(option => option.value === value);
            setSelectedValue(selectedOption || null);
        } else {
            setSelectedValue(null);
        }
    }, [value, options]);

    return (
        <div className="ant-select-wrapper" style={{ width: '100%' }}>
            <Select
                className="async-select"
                styles={customStyles}
                options={options}
                value={selectedValue}
                onChange={(val) => {
                    setSelectedValue(val);
                    onChange?.(val?.value);
                }}
                placeholder={intl.formatMessage({ id: 'select.select_gender' }) || "Select gender"}
                isDisabled={disabled || isLoading}
                isClearable
                isLoading={isLoading}
                noOptionsMessage={() => intl.formatMessage({ id: 'select.no_options' }) || "No options"}
            />
        </div>
    );
};

export default GenderSelect;
