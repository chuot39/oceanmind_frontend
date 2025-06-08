import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import AsyncSelect from "react-select/async";
import _ from "lodash";
import apiClient from "@/utils/api";
import { API_BASE_URL } from "@/constants";
import { useUserData } from "@/utils/hooks/useAuth";
import { customStyles } from "@/utils/Utils";

// Debounced function to load projects
const debouncedLoadProjects = _.debounce((userId, inputValue, callback) => {
    apiClient.get(`${API_BASE_URL}/project-members`, {
        params: {
            user_id: userId,
            limit: 10,
            search: inputValue || "",
            time: Date.now() // Prevent caching
        }
    })
        .then((response) => {
            const projects = response.data.data.map(item => ({
                documentId: item.project?.documentId,
                name: item.project?.name,
                ...item.project
            }));
            callback(projects);
        })
        .catch(() => callback([]));
}, 400);

const ProjectSelect = ({ value, onChange, disabled }) => {
    const intl = useIntl();
    const { userData } = useUserData();
    const [selectedValue, setSelectedValue] = useState(null);

    // Update selected value when prop changes
    useEffect(() => setSelectedValue(value || null), [value]);

    return (
        <div className="ant-select-wrapper" style={{ width: '100%' }}>
            <AsyncSelect
                className="async-select"
                styles={customStyles}
                cacheOptions
                defaultOptions
                value={selectedValue}
                getOptionLabel={(option) => option?.name}
                getOptionValue={(option) => option?.documentId}
                loadOptions={(input, cb) => userData?.documentId ? debouncedLoadProjects(userData.documentId, input, cb) : cb([])}
                onChange={(val) => {
                    setSelectedValue(val);
                    onChange?.(val);
                }}
                placeholder={intl.formatMessage({ id: 'select.select_project' })}
                isDisabled={disabled}
                isClearable
                noOptionsMessage={() => (
                    <span style={{ cursor: 'pointer' }}>
                        {intl.formatMessage({ id: 'select.create_new_project' }) || "Create new project"}
                    </span>
                )}
            />
        </div>
    );
};

export default ProjectSelect;