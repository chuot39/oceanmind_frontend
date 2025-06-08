import { useUserData } from "@/utils/hooks/useAuth";
import { useIntl } from "react-intl";
import { Select, Spin } from "antd";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { debounce } from "lodash";
import { useMutation, useQuery } from "react-query";
import { API_BASE_URL } from "@/constants";
import apiClient from "@/utils/api";
import { notifyError } from "@/utils/Utils";

// Hook để search subjects theo specializedId
export const useSubjectSearch = () => useMutation(
    async ({ specializedId, search, userData, specificId }) => {
        if (!specializedId) return { data: [] };

        let url = `${API_BASE_URL}/specialized-subjects?specialized_id=${specializedId}${userData?.regularClass?.batch?.documentId != null ? `&batch_id=${userData?.regularClass?.batch?.documentId}` : ''}&limit=100`;

        // Tìm kiếm theo tên
        if (search) {
            url += `&search=${search}`;
        }

        // Tìm kiếm theo ID cụ thể nếu có
        if (specificId) {
            url += `&subject_id=${specificId}`;
        }

        const response = await apiClient.get(url);
        return response?.data;
    },
    { onError: (error) => notifyError('Search subject failed', error) }
);

const SubjectSelect = ({ value, onChange, placeholder, style, excludeSubjects = [] }) => {
    const intl = useIntl();
    const { userData } = useUserData();
    const [options, setOptions] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Sử dụng ref để tránh render lặp
    const initialDataLoaded = useRef(false);
    const prevValueRef = useRef(null);
    const prevOptionsRef = useRef([]);
    const prevSpecializedIdRef = useRef(null);

    // Lấy thông tin chi tiết của lớp học để có specializedId
    const specializedId = userData?.regularClass?.specialized?.documentId;

    // Hook để search subjects
    const { mutate: searchSubjects, data: searchResults, isLoading: isSearching } = useSubjectSearch();

    // Hàm tải dữ liệu ban đầu (tất cả subjects của chuyên ngành)
    const loadInitialData = useCallback(() => {
        if (specializedId && !initialDataLoaded.current) {
            initialDataLoaded.current = true;
            searchSubjects({ specializedId, search: '', userData });
        }
    }, [specializedId, searchSubjects, userData]);

    // Tải dữ liệu ban đầu khi component mount hoặc specializedId thay đổi
    useEffect(() => {
        // Chỉ load lại khi specializedId thực sự thay đổi
        if (specializedId && prevSpecializedIdRef.current !== specializedId) {
            prevSpecializedIdRef.current = specializedId;
            initialDataLoaded.current = false;
            loadInitialData();
        }
    }, [specializedId, loadInitialData]);

    // Xử lý khi component nhận được giá trị từ bên ngoài
    useEffect(() => {
        // Ngăn chặn cập nhật state không cần thiết bằng cách so sánh với giá trị trước đó
        if (!value) {
            if (selectedSubjectId !== null) {
                setSelectedSubjectId(null);
            }
            return;
        }

        // Kiểm tra xem value có thay đổi không
        if (prevValueRef.current?.documentId === value?.documentId) {
            return;
        }

        prevValueRef.current = value;

        // Trường hợp value là object đầy đủ
        if (value?.documentId) {
            setSelectedSubjectId(value.documentId);

            // Kiểm tra nếu value có name và chưa có trong options
            if (value.name && !options.some(opt => opt.value === value.documentId)) {
                const newOption = {
                    label: value.name,
                    value: value.documentId,
                    subject: value
                };

                setOptions(prev => [...prev, newOption]);
            } else if (!value.name && !options.some(opt => opt.value === value.documentId) && specializedId) {
                // Load subject information nếu cần thiết và chưa được tải
                searchSubjects({
                    specializedId,
                    search: '',
                    userData,
                    specificId: value.documentId
                });
            }
        }
    }, [value, options, specializedId, searchSubjects, userData, selectedSubjectId]);

    console.log('searchResults', searchResults);

    // Cập nhật options khi có kết quả search
    useEffect(() => {
        if (searchResults?.data) {
            const formattedOptions = searchResults.data
                .filter(item => !excludeSubjects.includes(item.subject.documentId))
                .map(item => ({
                    label: item.subject.name,
                    value: item.subject.documentId,
                    subject: item.subject
                }));

            // Chỉ cập nhật options nếu thực sự thay đổi
            if (JSON.stringify(prevOptionsRef.current) !== JSON.stringify(formattedOptions)) {
                prevOptionsRef.current = formattedOptions;
                setOptions(formattedOptions);
            }
        }
    }, [searchResults, excludeSubjects]);

    // Hàm search với debounce
    const debouncedSearch = useMemo(() =>
        debounce(text => {
            if (specializedId) {
                searchSubjects({ specializedId, search: text, userData });
            }
        }, 500),
        [specializedId, searchSubjects, userData]
    );

    // Xử lý khi người dùng nhập text tìm kiếm
    const handleSearch = useCallback((text) => {
        setSearchText(text);
        debouncedSearch(text);
    }, [debouncedSearch]);

    // Xử lý khi người dùng chọn một subject
    const handleChange = useCallback((value, option) => {
        setSelectedSubjectId(value);
        if (onChange && option?.subject) {
            onChange(option.subject);
        }
    }, [onChange]);

    // Xử lý khi dropdown mở/đóng
    const handleDropdownVisibleChange = useCallback(open => {
        setDropdownOpen(open);

        if (open && !initialDataLoaded.current) {
            loadInitialData();
        }
    }, [loadInitialData]);

    return (
        <Select
            showSearch
            value={selectedSubjectId}
            placeholder={placeholder || intl.formatMessage({ id: 'learning.learning_progress.select_subject' })}
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
                // Không gọi loadInitialData khi clear để tránh gọi API không cần thiết
                if (onChange) {
                    onChange(null);
                }
            }}
        />
    );
};

export default SubjectSelect;   