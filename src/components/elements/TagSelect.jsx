import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Select, Spin, Tag } from 'antd';
import { useIntl } from 'react-intl';
import { useMutation } from 'react-query';
import { API_BASE_URL } from '@/constants';
import apiClient from '@/utils/api';
import { notifyError } from '@/utils/Utils';
import useSkin from '@/utils/hooks/useSkin';

// Unified hook to fetch tags with optional search
export const useTagsFetch = () => useMutation(
    async ({ searchTerm = '', pageSize = 5 } = {}) => {
        try {
            let url = `${API_BASE_URL}/tags?page=1&limit=${pageSize}`;

            // Add search filters if searchTerm is provided
            if (searchTerm && searchTerm.trim() !== '') {
                url = `${API_BASE_URL}/tags/search/${searchTerm}`;
            }

            const response = await apiClient.get(url);
            return response?.data?.data || [];
        } catch (error) {
            console.error('Error fetching tags:', error);
            throw error;
        }
    },
    {
        onError: (error) => notifyError('Failed to fetch tags', error)
    }
);

/**
 * A reusable tag selection component with search functionality
 */
const TagSelect = ({ value, onChange, placeholder, style, type = 'single', excludeTags = [], options: providedOptions }) => {
    const intl = useIntl();
    const { language } = useSkin();
    const [options, setOptions] = useState(providedOptions || []);
    const [searchText, setSearchText] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchTimeoutRef = useRef(null);
    const defaultLoadedRef = useRef(false);
    const [selectedTagIds, setSelectedTagIds] = useState([]);

    // Process tags data into options format
    const processTagsToOptions = useCallback((tags) => {
        if (!tags || !Array.isArray(tags)) return [];

        const filteredTags = tags.filter(
            tag => !excludeTags.includes(tag.documentId)
        );

        return filteredTags.map(tag => ({
            label: language === 'vi' ? tag.name_vi : tag.name_en,
            value: tag.documentId,
            tag
        }));
    }, [excludeTags, language]);

    // Unified hook for fetching tags
    const { mutate: fetchTags, isLoading: isFetching } = useTagsFetch();

    // Update options when providedOptions changes
    useEffect(() => {
        if (providedOptions) {
            setOptions(providedOptions);
        }
    }, [providedOptions]);

    // Extract selected tag IDs from value
    useEffect(() => {
        if (!value) return;

        let tagIds = [];
        if (type === 'multiple') {
            if (Array.isArray(value)) {
                tagIds = value
                    .filter(item => item && (typeof item === 'string' || item?.documentId))
                    .map(item => typeof item === 'string' ? item : item.documentId);
            }
        } else {
            tagIds = [typeof value === 'string' ? value : value?.documentId].filter(Boolean);
        }

        setSelectedTagIds(tagIds);
    }, [value, type]);

    // Fetch selected tags if they're not in the options
    useEffect(() => {
        if (selectedTagIds.length === 0) return;

        // Find which tag IDs are not in the options
        const missingTagIds = selectedTagIds.filter(
            tagId => !options.some(option => option.value === tagId)
        );

        if (missingTagIds.length === 0) return;

        // Fetch missing tags
        const fetchMissingTags = async () => {
            try {
                const response = await apiClient.get(`${API_BASE_URL}/tags`);
                const missingTags = response?.data?.data || [];

                if (missingTags.length === 0) return;

                // Process missing tags into options
                const missingOptions = processTagsToOptions(missingTags);

                // Add missing options to existing options
                const combinedOptions = [...options];
                missingOptions.forEach(missingOption => {
                    if (!combinedOptions.some(opt => opt.value === missingOption.value)) {
                        combinedOptions.push(missingOption);
                    }
                });

                setOptions(combinedOptions);
            } catch (error) {
                console.error('Error fetching missing tags:', error);
            }
        };

        fetchMissingTags();
    }, [selectedTagIds, options, processTagsToOptions]);

    // Load tags immediately when component mounts
    useEffect(() => {
        // Load tags immediately
        loadDefaultTags();
    }, []);

    // Format value for select component - memoized to prevent unnecessary calculations
    const formattedValue = useMemo(() => {
        if (!value) {
            return type === 'multiple' ? [] : undefined;
        }

        if (type === 'multiple') {
            if (Array.isArray(value)) {
                return value
                    .filter(item => item && (typeof item === 'string' || item?.documentId))
                    .map(item => typeof item === 'string' ? item : item.documentId);
            }
            return [];
        }

        return typeof value === 'string' ? value : value?.documentId;
    }, [value, type]);

    // Load default tags (only once when dropdown opens)
    const loadDefaultTags = useCallback(() => {
        if (defaultLoadedRef.current) return;

        setLoading(true);
        fetchTags({ pageSize: 5 }, {
            onSuccess: (data) => {
                if (!data) return;
                const defaultOptions = processTagsToOptions(data);

                // Combine provided options with default options, removing duplicates
                const combinedOptions = [...(providedOptions || [])];
                defaultOptions.forEach(defaultOption => {
                    if (!combinedOptions.some(opt => opt.value === defaultOption.value)) {
                        combinedOptions.push(defaultOption);
                    }
                });

                setOptions(combinedOptions);
                setLoading(false);
                defaultLoadedRef.current = true;
            },
            onError: () => {
                setLoading(false);
            }
        });
    }, [fetchTags, processTagsToOptions, providedOptions]);

    // Handle dropdown visibility change
    const handleDropdownVisibleChange = useCallback((open) => {
        setDropdownOpen(open);

        // Load default tags when dropdown opens if not already loaded
        if (open && !defaultLoadedRef.current) {
            loadDefaultTags();
        }
    }, [loadDefaultTags]);

    // Execute search with given text
    const executeSearch = useCallback((text) => {
        if (!text || !text.trim()) {
            // Reset loaded flag to load default data
            defaultLoadedRef.current = false;
            loadDefaultTags();
            return;
        }

        setLoading(true);
        fetchTags({
            searchTerm: text,
            pageSize: 5
        }, {
            onSuccess: (data) => {
                if (!data) return;
                const searchOptions = processTagsToOptions(data);

                // Combine provided options with search results, removing duplicates
                const combinedOptions = [...(providedOptions || [])];
                searchOptions.forEach(searchOption => {
                    if (!combinedOptions.some(opt => opt.value === searchOption.value)) {
                        combinedOptions.push(searchOption);
                    }
                });

                setOptions(combinedOptions);
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            }
        });
    }, [fetchTags, processTagsToOptions, providedOptions, loadDefaultTags]);

    // Handle search text changes with debounce
    const handleSearch = useCallback((text) => {
        // Clear any existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        setSearchText(text);

        // If text is empty, load default tags immediately
        if (!text.trim()) {
            setLoading(true);
            // Reset loaded flag to load default data again
            defaultLoadedRef.current = false;
            loadDefaultTags();
            return;
        }

        // Only set loading if we're going to make a request
        setLoading(true);

        // Set new timeout
        searchTimeoutRef.current = setTimeout(() => {
            executeSearch(text);
        }, 1000);
    }, [executeSearch, loadDefaultTags]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Handle selection change
    const handleChange = useCallback((selectedValue, selectedOptions) => {
        if (type === 'multiple') {
            if (!selectedValue || selectedValue.length === 0) {
                onChange?.([]);
                return;
            }

            const selectedTags = Array.isArray(selectedOptions)
                ? selectedOptions.map(option => option.tag)
                : [];

            onChange?.(selectedTags);
        } else {
            onChange?.(selectedOptions?.tag || null);
        }
    }, [onChange, type]);

    // Custom render for options - memoized to prevent recreating option objects
    const renderOption = useCallback((option) => {
        return {
            value: option.value,
            label: (
                <div className="flex gap-2 items-center">
                    {option.label}
                </div>
            ),
            tag: option.tag
        };
    }, []);

    // Memoize the transformed options to prevent unnecessary re-renders
    const memoizedOptions = useMemo(() => {
        return options.map(renderOption);
    }, [options, renderOption]);

    // Handle clear
    const handleClear = useCallback(() => {
        setSearchText('');
        onChange?.(type === 'multiple' ? [] : null);
    }, [onChange, type]);

    const isLoading = isFetching || loading;

    return (
        <Select
            mode={type === 'multiple' ? 'multiple' : undefined}
            showSearch
            value={formattedValue}
            placeholder={placeholder || intl.formatMessage({ id: 'common.select_tag', defaultMessage: 'Select tag' })}
            style={style || { width: '100%' }}
            filterOption={false}
            searchValue={searchText}
            onSearch={handleSearch}
            onChange={handleChange}
            onDropdownVisibleChange={handleDropdownVisibleChange}
            notFoundContent={isLoading ? <Spin size="small" /> : null}
            options={memoizedOptions}
            loading={isLoading}
            allowClear
            onClear={handleClear}
        // dropdownMatchSelectWidth={false}
        />
    );
};

export default TagSelect;
