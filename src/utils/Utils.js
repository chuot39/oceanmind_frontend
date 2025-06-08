import { toast } from 'react-toastify';

export const isUserLoggedIn = () => localStorage.getItem('userData');

export const handleNoticeAction = ({ message, action, skin }) => {
    // const { skin } = useSkin();
    toast(`🦄 ${message} ${action}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: skin,
    });
}

export const notifySuccess = (message) => {
    toast.dismiss();
    toast.success(message);
}

export const notifyError = (message) => {
    toast.dismiss();
    toast.error(message);
}

export const notifyWarning = (message) => {
    toast.warning(message);
}

export const handleScrollToTop = () => {

    const topElement = document.getElementById('top-of-page');

    if (topElement) {
        topElement.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

export const customStyles = {
    // Container - Bọc toàn bộ component
    container: (provided) => ({
        ...provided,
        width: '100%' // Chiều rộng 100% để phù hợp với Form.Item
    }),

    // Control - Phần input chính (border, background)
    control: (provided, state) => ({
        ...provided,
        minHeight: '32px', // Chiều cao tối thiểu giống Ant Design
        height: '32px', // Chiều cao cố định giống Ant Design
        boxShadow: 'none', // Không có shadow khi focus
        borderRadius: '2px', // Bo góc nhẹ giống Ant Design
        borderColor: state.isFocused ? 'var(--primary-color, #40a9ff)' : 'var(--border-color-base, #d9d9d9)', // Màu viền: xanh khi focus, xám khi bình thường
        '&:hover': {
            borderColor: 'var(--text-primary-color)' // Màu viền xanh khi hover
        }
    }),

    // ValueContainer - Chứa giá trị đã chọn và input
    valueContainer: (provided) => ({
        ...provided,
        height: '32px', // Chiều cao giống control
        padding: '0 11px' // Padding giống Ant Design
    }),

    // Input - Phần nhập text
    input: (provided) => ({
        ...provided,
        margin: '0', // Không có margin
        padding: '0' // Không có padding
    }),

    // IndicatorsContainer - Chứa các indicators (clear, dropdown)
    indicatorsContainer: (provided) => ({
        ...provided,
        height: '32px' // Chiều cao giống control
    }),

    // DropdownIndicator - Mũi tên dropdown
    dropdownIndicator: (provided, state) => ({
        ...provided,
        padding: '0 8px', // Padding giống Ant Design
        color: state.isFocused ? 'var(--text-primary-color)' : '#bfbfbf', // Màu xanh khi focus, xám khi bình thường
        '&:hover': {
            color: 'var(--color-active)' // Màu xanh khi hover
        }
    }),

    // ClearIndicator - Nút xóa giá trị
    clearIndicator: (provided) => ({
        ...provided,
        padding: '0 8px', // Padding giống Ant Design
        color: 'var(--text-primary-color)', // Màu xám cho icon
        '&:hover': {
            color: 'var(--color-active)' // Màu xanh khi hover
        }
    }),

    // Menu - Dropdown menu container
    menu: (provided) => ({
        ...provided,
        borderRadius: '2px', // Bo góc nhẹ giống Ant Design
        boxShadow: 'var(--box-shadow-base, 0 2px 8px rgba(0, 0, 0, 0.15))', // Shadow giống Ant Design dropdown
        zIndex: 1050 // z-index cao hơn để không bị che bởi các phần tử khác
    }),

    // MenuList - Danh sách các options trong dropdown
    menuList: (provided) => ({
        ...provided,
        padding: '4px 4px !important', // Padding top/bottom giống Ant Design
        '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px'
        },
        '&::-webkit-scrollbar-track': {
            background: 'var(--background-primary-color)',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'var(--color-divider)',
            borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: 'var(--secondary-color)'
        }
    }),

    // Option - Từng option trong dropdown
    option: (provided, state) => ({
        ...provided,
        padding: '5px 12px', // Padding giống Ant Design
        color: 'var(--text-primary-color)',
        borderRadius: '4px',
        // margin: '0px 10px',
        backgroundColor: state.isSelected
            ? ' var(--bg-dropdown-selected-item)' // Màu nền xanh nhạt khi được chọn
            : state.isFocused
                ? 'var(--bg-list-notice-hover)' // Màu nền xám nhạt khi hover
                : null, // Không có màu nền khi bình thường
        // color: state.isSelected ? 'var(--primary-color, #1890ff)' : 'var(--text-color, #000000d9)', // Màu chữ xanh khi chọn, đen khi bình thường
        fontWeight: state.isSelected ? 600 : 400, // Đậm hơn khi được chọn
        '&:active': {
            backgroundColor: 'var(--bg-dropdown-selected-item)', // Màu nền xanh nhạt khi click
            color: 'var(--text-primary-color)'
        }
    }),

    // Placeholder - Text hiển thị khi chưa chọn giá trị
    placeholder: (provided) => ({
        ...provided,
        color: 'var(--secondary-color)' // Màu xám nhạt giống Ant Design placeholder
    }),

    // SingleValue - Giá trị đã chọn (chế độ single select)
    singleValue: (provided) => ({
        ...provided,
        marginLeft: '0', // Không có margin left
        marginRight: '0', // Không có margin right
        color: 'var(--text-primary-color)' // Màu chữ đen với opacity giống Ant Design
    }),

    // MultiValue - Container cho mỗi tag (chế độ multi select)
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: 'var(--color-cyan-300-text, #f5f5f5)', // Màu nền xám nhạt cho tag
        borderRadius: '2px' // Bo góc nhẹ giống Ant Design tag
    }),

    // MultiValueLabel - Text trong tag
    multiValueLabel: (provided) => ({
        ...provided,
        // color: 'var(--text-color, #000000d9)', // Màu chữ đen với opacity
        padding: '0 4px' // Padding giống Ant Design tag
    }),

    // MultiValueRemove - Nút xóa tag
    multiValueRemove: (provided) => ({
        ...provided,
        color: 'var(--text-color-secondary, #00000073)', // Màu xám đậm cho icon xóa
        '&:hover': {
            backgroundColor: 'var(--color-cyan-100-text, #e6f7ff)', // Màu nền xanh nhạt khi hover
            color: 'var(--color-active)' // Màu chữ xanh khi hover
        }
    })
};