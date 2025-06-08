import { useUserData } from "@/utils/hooks/useAuth";
import { useIntl } from "react-intl";
import { Select, Spin, Avatar } from "antd";
import { useState, useEffect, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import { useMutation } from "react-query";
import { API_BASE_URL } from "@/constants";
import apiClient from "@/utils/api";
import { notifyError } from "@/utils/Utils";

// Hook để lấy và tìm kiếm bạn bè của user
export const useFriendshipSearch = () => useMutation(
    async ({ userId, search }) => {
        try {
            const { data } = await apiClient.get(
                `${API_BASE_URL}/friendships/users/${userId}?page=1&limit=50`
            );

            // Xử lý dữ liệu để lấy ra danh sách bạn bè
            const friendsList = data?.data?.map(friendship => {
                return friendship?.friend;
            });

            // Lọc danh sách bạn bè theo từ khóa tìm kiếm nếu có
            if (search) {
                const searchLower = search.toLowerCase();
                return friendsList?.filter(friend =>
                    friend?.username?.toLowerCase().includes(searchLower) ||
                    friend?.fullname?.toLowerCase().includes(searchLower)
                );
            }

            return friendsList;
        } catch (error) {
            console.error("Error fetching friendships:", error);
            throw error;
        }
    },
    {
        onError: (error) => notifyError('Không thể tải danh sách bạn bè', error)
    }
);

const MemberMultipleSelect = ({ value, onChange, placeholder, style, mode = "multiple" }) => {
    const intl = useIntl();
    const { userData } = useUserData();
    const [options, setOptions] = useState([]);
    const [selectedMemberIds, setSelectedMemberIds] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);


    // Hook để tìm kiếm bạn bè
    const { mutate: searchFriends, data: friendsList, isLoading: isSearching } = useFriendshipSearch();

    // Danh sách ID của các thành viên hiện tại (để loại trừ)
    const currentMemberIds = useMemo(() => {
        if (!value) return [];

        if (Array.isArray(value)) {
            return value.map(member => member?.documentId).filter(Boolean) || [];
        } else if (value?.documentId) {
            return [value.documentId];
        }

        return [];
    }, [value]);

    // Hàm tải dữ liệu ban đầu (tất cả bạn bè)
    const loadInitialData = useCallback(() => {
        if (userData?.documentId) {
            searchFriends({ userId: userData.documentId, search: '' });
        }
    }, [userData, searchFriends]);

    // Tải dữ liệu ban đầu khi component mount
    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    // Cập nhật selectedMemberIds khi value thay đổi
    useEffect(() => {
        if (!value) {
            setSelectedMemberIds([]);
            return;
        }

        if (Array.isArray(value)) {
            const memberIds = value.map(item => item?.documentId).filter(Boolean);
            setSelectedMemberIds(memberIds);
        } else if (value?.documentId) {
            setSelectedMemberIds([value.documentId]);
        }
    }, [value]);

    // Thêm các members từ value vào options
    useEffect(() => {
        if (!value) return;

        if (Array.isArray(value)) {
            const validMembers = value.filter(item => item?.documentId);
            const newOptions = validMembers
                .filter(item => !options.some(opt => opt.value === item.documentId))
                .map(item => ({
                    label: item.username || item.fullname,
                    value: item.documentId,
                    member: item
                }));

            if (newOptions.length > 0) {
                setOptions(prev => [...prev, ...newOptions]);
            }
        } else if (value?.documentId) {
            if (!options.some(opt => opt.value === value.documentId)) {
                const newOption = {
                    label: value.username || value.fullname,
                    value: value.documentId,
                    member: value
                };
                setOptions(prev => [...prev, newOption]);
            }
        }
    }, [value, options]);

    // Cập nhật options khi có kết quả tìm kiếm bạn bè
    useEffect(() => {
        if (friendsList) {
            // Lọc ra những bạn bè chưa là thành viên hiện tại
            const availableFriends = friendsList.filter(
                friend => !currentMemberIds.includes(friend.documentId)
            );

            // Định dạng danh sách options
            const formattedOptions = availableFriends.map(friend => ({
                label: friend.fullname || friend.username,
                value: friend.documentId,
                member: friend
            }));

            setOptions(formattedOptions);
        }
    }, [friendsList, currentMemberIds]);

    // Hàm search với debounce
    const debouncedSearch = useMemo(() =>
        debounce(text => {
            if (userData?.username) {
                searchFriends({ username: userData.username, search: text });
            }
        }, 300),
        [userData, searchFriends]
    );

    // Xử lý khi người dùng nhập text tìm kiếm
    const handleSearch = useCallback((text) => {
        setSearchText(text);
        debouncedSearch(text);
    }, [debouncedSearch]);

    // Xử lý khi người dùng chọn một hoặc nhiều members
    const handleChange = useCallback((values, options) => {
        if (!values || !options) return;

        setSelectedMemberIds(values);

        // Nếu mode là multiple, trả về array của members
        if (mode === "multiple") {
            const selectedMembers = options.map(option => option.member);
            onChange?.(selectedMembers);
        }
        // Nếu mode là default/single, trả về member object
        else {
            onChange?.(options.member);
        }
    }, [onChange, mode]);

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

    // Tùy chỉnh hiển thị của mỗi option
    const customOptionRender = useCallback((option) => ({
        value: option.value,
        label: (
            <div className="flex items-center gap-2">
                <Avatar
                    src={option.member?.avatar?.file_path}
                    size="small"
                >
                    {option.label?.charAt(0)?.toUpperCase()}
                </Avatar>
                <span>{option.label}</span>
            </div>
        ),
        member: option.member
    }), []);


    return (
        <Select
            mode={mode === "multiple" ? "multiple" : undefined}
            showSearch
            value={mode === "multiple" ? selectedMemberIds : selectedMemberIds[0]}
            placeholder={placeholder || intl.formatMessage({ id: 'learning.task.select_members' })}
            style={style || { width: '100%' }}
            defaultActiveFirstOption={false}
            filterOption={false}
            searchValue={dropdownOpen ? searchText : undefined}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={isSearching ? <Spin size="small" /> : null}
            options={options.map(customOptionRender)}
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

export default MemberMultipleSelect;