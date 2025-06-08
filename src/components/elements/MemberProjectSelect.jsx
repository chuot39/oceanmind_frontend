import { useUserData } from "@/utils/hooks/useAuth";
import { useIntl } from "react-intl";
import { Select, Spin } from "antd";
import { useState, useEffect, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import { useMutation } from "react-query";
import { API_BASE_URL } from "@/constants";
import apiClient from "@/utils/api";
import { notifyError } from "@/utils/Utils";

// Hook để search members của project
export const useProjectMemberSearch = () => useMutation(
    async ({ projectId, search }) => {
        const { data } = await apiClient.get(
            `${API_BASE_URL}/project-members?populate=*&filters[$and][0][project_id][documentId][$eq]=${projectId}${search ? `&filters[$and][1][user_id][username][$contains]=${search}` : ''}&pagination[page]=1&pagination[pageSize]=100&sort=updatedAt:DESC`
        );
        return data;
    },
    { onError: (error) => notifyError('Search project member failed', error) }
);

const MemberProjectSelect = ({ value, onChange, placeholder, style, projectId }) => {
    const intl = useIntl();
    const { userData } = useUserData();
    const [options, setOptions] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Hooks để fetch dữ liệu
    const { mutate: searchMembers, data: searchResults, isLoading: isSearching } = useProjectMemberSearch();

    // Hàm tải dữ liệu ban đầu (tất cả members của project)
    const loadInitialData = useCallback(() => {
        if (projectId) {
            searchMembers({ projectId, search: '' });
        }
    }, [projectId, searchMembers]);

    // Tải dữ liệu ban đầu khi component mount hoặc projectId thay đổi
    useEffect(() => {
        projectId && loadInitialData();
    }, [projectId, loadInitialData]);

    // Xử lý khi component nhận được giá trị từ bên ngoài
    useEffect(() => {
        if (!value) {
            setSelectedMemberId(null);
            return;
        }

        // Giả định value luôn là object đầy đủ
        if (value.documentId) {
            setSelectedMemberId(value.documentId);

            // Thêm member vào options nếu chưa có
            setOptions(prev => !prev.some(opt => opt.value === value.documentId)
                ? [...prev, { label: value.username, value: value.documentId, member: value }]
                : prev
            );
        }
    }, [value]);

    // Cập nhật options khi có kết quả search
    useEffect(() => {
        if (searchResults?.data) {
            const formattedOptions = searchResults.data.map(item => ({
                label: item.user_id.username,
                value: item.user_id.documentId,
                member: item.user_id
            }));
            setOptions(formattedOptions);
        }
    }, [searchResults]);

    // Hàm search với debounce
    const debouncedSearch = useMemo(() =>
        debounce(text => {
            if (projectId) {
                searchMembers({ projectId, search: text });
            }
        }, 500),
        [projectId, searchMembers]
    );

    // Xử lý khi người dùng nhập text tìm kiếm
    const handleSearch = useCallback((text) => {
        setSearchText(text);
        debouncedSearch(text);
    }, [debouncedSearch]);

    // Xử lý khi người dùng chọn một member
    const handleChange = useCallback((value, option) => {
        setSelectedMemberId(value);
        onChange?.(option.member);
    }, [onChange]);

    // Xử lý khi dropdown mở/đóng
    const handleDropdownVisibleChange = useCallback(open => {
        setDropdownOpen(open);

        if (open) {
            // Nếu không có options hoặc searchText rỗng, load dữ liệu ban đầu
            if (options.length === 0 || searchText === '') {
                loadInitialData();
            }
        }
    }, [options.length, searchText, loadInitialData]);

    return (
        <Select
            showSearch
            value={selectedMemberId}
            placeholder={placeholder || intl.formatMessage({ id: 'learning.task.select_member' })}
            style={style || { width: '100%' }}
            defaultActiveFirstOption={false}
            filterOption={false}
            searchValue={dropdownOpen ? searchText : undefined}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={isSearching ? <Spin size="small" /> : null}
            options={options}
            loading={isSearching}
            onDropdownVisibleChange={handleDropdownVisibleChange}
            allowClear
            onClear={() => {
                setSearchText('');
                loadInitialData();
            }}
        />
    );
};

export default MemberProjectSelect;   