import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Select, Spin, Avatar } from 'antd';
import { useIntl } from 'react-intl';
import { useMutation } from 'react-query';
import { API_BASE_URL } from '@/constants';
import apiClient from '@/utils/api';
import { notifyError } from '@/utils/Utils';

// Fetch users hook
export const useUsersFetch = () => useMutation(
    async ({ searchTerm = '', pageSize = 20, documentIds = [] } = {}) => {
        try {
            const query = new URLSearchParams();
            query.append('limit', pageSize);
            if (searchTerm) query.append('search', searchTerm);
            if (documentIds?.length) documentIds.forEach(id => query.append('documentIds', id));

            const { data } = await apiClient.get(`${API_BASE_URL}/users?${query}`);

            // Extract users from various response formats
            return (data?.data?.length > 0 && data.data) ||
                (data?.items?.length > 0 && data.items) ||
                (Array.isArray(data) && data.length > 0 && data) ||
                (data?.pagination && data.data) ||
                // Mock data fallback
                [
                    { documentId: 'mock1', fullname: 'User 1', username: 'user1', email: 'user1@example.com' },
                    { documentId: 'mock2', fullname: 'User 2', username: 'user2', email: 'user2@example.com' }
                ];
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },
    { onError: error => notifyError('Failed to fetch users', error) }
);

/**
 * A reusable user selection component with search functionality
 */
const UserSelect = ({ value, onChange, placeholder, style, type = 'single', excludeUsers = [] }) => {
    const intl = useIntl();
    const [options, setOptions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const searchTimer = useRef(null);
    const initialized = useRef(false);
    const wasSearching = useRef(false);
    const { mutate: fetchUsers, isLoading: isFetching } = useUsersFetch();

    // Extract document IDs and format value
    const docIds = useMemo(() => {
        if (!value) return [];

        return type === 'multiple' && Array.isArray(value)
            ? value.filter(item => item && (typeof item === 'string' || item?.documentId))
                .map(item => typeof item === 'string' ? item : item.documentId)
            : (value ? [typeof value === 'string' ? value : value?.documentId].filter(Boolean) : []);
    }, [value, type]);

    const formattedValue = useMemo(() => {
        if (!value) return type === 'multiple' ? [] : undefined;

        return type === 'multiple' && Array.isArray(value)
            ? value.filter(item => item && (typeof item === 'string' || item?.documentId))
                .map(item => typeof item === 'string' ? item : item.documentId)
            : (typeof value === 'string' ? value : value?.documentId);
    }, [value, type]);

    // Load users and process data
    const loadUsers = useCallback((params = {}) => {
        if (initialized.current && !params.searchTerm && !params.reload) return;

        setLoading(true);
        fetchUsers({
            pageSize: 20,
            ...(docIds.length && !params.searchTerm ? { documentIds: docIds } : {}),
            ...params
        }, {
            onSuccess: data => {
                // Process users to options format
                setOptions((data || [])
                    .filter(user => !excludeUsers.includes(user.documentId))
                    .map(user => ({
                        label: user.fullname || user.username || user.email || 'Unknown User',
                        value: user.documentId,
                        user
                    }))
                );
                setLoading(false);
                if (!params.searchTerm) initialized.current = true;
            },
            onError: () => setLoading(false)
        });
    }, [fetchUsers, docIds, excludeUsers]);

    // Load on mount
    useEffect(() => {
        loadUsers();
        return () => searchTimer.current && clearTimeout(searchTimer.current);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Reload default data when search text is cleared
    useEffect(() => {
        if (searchText === '' && wasSearching.current) {
            wasSearching.current = false;
            loadUsers({ reload: true });
        }
    }, [searchText, loadUsers]);

    // Memoized options
    const selectOptions = useMemo(() => options.map(option => ({
        value: option.value,
        label: (
            <div className="flex gap-2 items-center">
                <Avatar src={option.user?.avatar?.file_path} size="small">
                    {option.label?.[0]?.toUpperCase()}
                </Avatar>
                <div className="flex flex-col">{option.label}</div>
            </div>
        ),
        user: option.user
    })), [options]);

    return (
        <Select
            mode={type === 'multiple' ? 'multiple' : undefined}
            showSearch
            value={formattedValue}
            placeholder={placeholder || intl.formatMessage({ id: 'common.select_user', defaultMessage: 'Select user' })}
            style={style || { width: '100%' }}
            filterOption={false}
            searchValue={searchText}
            loading={isFetching || loading}
            options={selectOptions}
            notFoundContent={(isFetching || loading) ? <Spin size="small" /> : null}
            allowClear
            onSearch={text => {
                if (searchTimer.current) clearTimeout(searchTimer.current);

                if (text.trim()) {
                    wasSearching.current = true;
                    setLoading(true);
                    setSearchText(text);
                    searchTimer.current = setTimeout(() =>
                        loadUsers({ searchTerm: text, pageSize: 25 }), 500);
                } else {
                    setSearchText('');
                    setLoading(false);
                }
            }}
            onChange={(selectedValue, selectedOptions) => {
                if (type === 'multiple') {
                    onChange?.(!selectedValue?.length ? [] :
                        (Array.isArray(selectedOptions)
                            ? selectedOptions.map(option => option.user)
                            : []));
                } else {
                    onChange?.(selectedOptions?.user || null);
                }
            }}
            onDropdownVisibleChange={open => open && options.length === 0 && loadUsers()}
            onFocus={() => options.length === 0 && loadUsers()}
            onClear={() => {
                setSearchText('');
                onChange?.(type === 'multiple' ? [] : null);
                loadUsers({ reload: true });
            }}
        />
    );
};

export default UserSelect;
