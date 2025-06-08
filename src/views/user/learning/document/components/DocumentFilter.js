import React, { useState, useEffect } from 'react';
import { Space, Button, DatePicker, Checkbox, Drawer, Tag, message, Alert } from 'antd';
import { BsFilter, BsGrid, BsList, BsCalendar, BsBookmark, BsPlus, BsX } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import DocumentForm from './DocumentForm';
import useSkin from '@/utils/hooks/useSkin';
import UserSelect from '../../../../../components/elements/UserSelect';
import TagSelect from '@/components/elements/TagSelect';
import { PlusOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const DocumentFilter = ({ viewMode, onViewModeChange, selectedType, selectedUsers = [], dateRange, showBookmarkedOnly = false, onTypeChange, onUserChange, onDateRangeChange, onBookmarkedChange, onClearFilters, onCloseDetailModel }) => {
    const intl = useIntl();
    const { language } = useSkin();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [uploadDrawerVisible, setUploadDrawerVisible] = useState(false);

    // Temporary states for filters
    const [tempType, setTempType] = useState(selectedType);
    const [tempUsers, setTempUsers] = useState(selectedUsers);
    const [tempDateRange, setTempDateRange] = useState(dateRange);
    const [tempBookmarked, setTempBookmarked] = useState(showBookmarkedOnly);

    // Check if there are active filters
    const hasActiveFilters =
        (selectedType !== 'all' && selectedType.length > 0) ||
        (selectedUsers && selectedUsers.length > 0) ||
        dateRange !== null ||
        showBookmarkedOnly;

    // Update temp states when drawer opens
    const openFilterDrawer = () => {
        setTempType(selectedType);
        setTempUsers(selectedUsers);
        setTempDateRange(dateRange);
        setTempBookmarked(showBookmarkedOnly);
        setDrawerVisible(true);
    };

    // Apply filters when Apply button is clicked
    const handleApplyFilters = () => {
        onTypeChange(tempType);
        onUserChange(tempUsers);
        onDateRangeChange(tempDateRange);
        onBookmarkedChange(tempBookmarked);
        setDrawerVisible(false);
    };

    // Clear filters and close drawer
    const handleClearFilters = () => {
        setTempType('all');
        setTempUsers([]);
        setTempDateRange(null);
        setTempBookmarked(false);
        onClearFilters();
        setDrawerVisible(false);
    };


    // Remove individual type filter
    const handleRemoveType = (type) => {
        if (Array.isArray(selectedType)) {
            let newTypes;
            if (typeof type === 'object') {
                newTypes = selectedType.filter(t =>
                    typeof t === 'object' ? t.documentId !== type.documentId : t !== type.documentId
                );
            } else {
                newTypes = selectedType.filter(t =>
                    typeof t === 'object' ? t.documentId !== type : t !== type
                );
            }
            onTypeChange(newTypes.length > 0 ? newTypes : 'all');
        } else {
            onTypeChange('all');
        }
    };

    // Remove individual user filter
    const handleRemoveUser = (user) => {
        const newUsers = selectedUsers.filter(u => u.documentId !== user.documentId);
        onUserChange(newUsers);
    };

    // Clear date range filter
    const handleClearDateRange = () => {
        onDateRangeChange(null);
    };

    // Clear bookmarked filter
    const handleClearBookmarked = () => {
        onBookmarkedChange(false);
    };


    const documentTags = Array.isArray(selectedType) && selectedType?.length > 0
        ? selectedType?.map(tag => ({
            value: tag?.documentId,
            label: language === 'vi' ? tag.name_vi : tag.name_en
        }))
        : [];


    // Get label for a value from a list
    const getLabelByValue = (list, value) => {
        if (typeof value === 'object' && value !== null) {
            return language === 'vi' ? value.name_vi : value.name_en;
        }

        const item = list.find(item => item.value === value);
        return item ? (typeof item.label === 'object' ? item.value : item.label) : value;
    };

    return (
        <>
            <div className="p-4 rounded-lg shadow-sm document-filter mb-4">
                <div className="flex flex-wrap justify-between gap-4 items-center">
                    <Space size="middle" className="flex-1 flex-wrap">
                        <Button
                            icon={<BsFilter />}
                            onClick={openFilterDrawer}
                            className="btn_custom_accept"
                        >
                            <FormattedMessage id="common.filter" />
                        </Button>
                        <Button
                            variant="solid"
                            color="cyan"
                            icon={<PlusOutlined />}
                            onClick={() => setUploadDrawerVisible(true)}
                        >
                            <FormattedMessage id="common.create" defaultMessage="Đăng tài liệu" />
                        </Button>

                        {hasActiveFilters && (
                            <Button
                                onClick={onClearFilters}
                                className="btn_custom_secondary"
                                size="small"
                            >
                                <FormattedMessage id="learning.document.clear_all_filters" defaultMessage="Xóa bộ lọc" />
                            </Button>
                        )}
                    </Space>

                    <div className="flex border p-1 rounded-lg gap-2 items-center view-mode-toggle">
                        <button
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                            onClick={() => onViewModeChange('grid')}
                        >
                            <BsGrid />
                        </button>
                        <button
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                            onClick={() => onViewModeChange('list')}
                        >
                            <BsList />
                        </button>
                    </div>
                </div>

                {/* Active filters display */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap active-filters gap-2 mt-4">

                        {/* Type tags */}
                        {selectedType !== 'all' && Array.isArray(selectedType) && selectedType.map(type => (
                            <Tag
                                key={`type-${typeof type === 'object' ? type.documentId : type}`}
                                closable
                                className="bg-green-50 text-green-700 tag-filter"
                                onClose={() => handleRemoveType(type)}
                            >
                                <span className="font-medium">Loại:</span> {typeof type === 'object' ?
                                    (language === 'vi' ? type.name_vi : type.name_en) :
                                    getLabelByValue(documentTags, type)}
                            </Tag>
                        ))}

                        {/* User tags */}
                        {selectedUsers.map(user => (
                            <Tag
                                key={`user-${user.documentId}`}
                                closable
                                className="bg-purple-50 text-purple-700 tag-filter"
                                onClose={() => handleRemoveUser(user)}
                            >
                                <span className="font-medium"> <FormattedMessage id="reuse.postBy" defaultMessage="Người đăng" />:</span> {user.fullname || user.username || user.email}
                            </Tag>
                        ))}

                        {/* Date range tag */}
                        {dateRange && dateRange[0] && dateRange[1] && (
                            <Tag
                                closable
                                className="bg-orange-50 text-orange-700 tag-filter"
                                onClose={handleClearDateRange}
                            >
                                <span className="font-medium"> <FormattedMessage id="reuse.date_range" defaultMessage="Thời gian" />:</span> {dateRange[0].format('DD/MM/YYYY')} - {dateRange[1].format('DD/MM/YYYY')}
                            </Tag>
                        )}

                        {/* Bookmarked tag */}
                        {showBookmarkedOnly && (
                            <Tag
                                closable
                                className="bg-red-50 text-red-700 tag-filter"
                                onClose={handleClearBookmarked}
                            >
                                <BsBookmark className="inline mr-1" />
                                <span className="font-medium"> <FormattedMessage id="reuse.bookmarked" defaultMessage="Đã đánh dấu" />:</span>
                            </Tag>
                        )}
                    </div>
                )}
            </div>

            <Drawer
                title={<FormattedMessage id="learning.document.filter_options" />}
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={600}
                extra={
                    <Space>
                        <Button onClick={handleClearFilters} className="btn_custom_secondary">
                            <FormattedMessage id="common.clear_filters" />
                        </Button>
                        <Button onClick={handleApplyFilters} type="primary" className="btn_custom_accept">
                            <FormattedMessage id="reuse.apply_filters" defaultMessage="Áp dụng" />
                        </Button>
                    </Space>
                }
            >
                <div className="space-y-6">


                    {/* Document Type Filter - Multiple selection */}
                    <div>
                        <h4 className="text-base font-medium mb-2">
                            <FormattedMessage id="learning.document.document_tags" />
                        </h4>
                        <TagSelect
                            type="multiple"
                            value={tempType}
                            onChange={(selectedTags) => {
                                setTempType(selectedTags);
                            }}
                            placeholder={intl.formatMessage({ id: 'learning.document.select_tags' })}
                        />
                    </div>

                    {/* User Filter - Multiple selection */}
                    <div>
                        <h4 className="text-base font-medium mb-2">
                            <FormattedMessage id="learning.document.filter_by_user" />
                        </h4>
                        <UserSelect
                            type="multiple"
                            value={tempUsers}
                            onChange={(selectedUsers) => {
                                // Lấy danh sách user đã chọn và lưu vào tempUsers
                                setTempUsers(selectedUsers);
                            }}
                            placeholder={intl.formatMessage({ id: 'learning.document.select_users' })}
                        />
                    </div>

                    {/* Date Range Filter */}
                    <div>
                        <h4 className="text-base font-medium mb-2">
                            <BsCalendar className="inline mr-2" />
                            <FormattedMessage id="learning.document.date_range" />
                        </h4>
                        <RangePicker
                            className="w-full"
                            format="DD/MM/YYYY"
                            value={tempDateRange}
                            onChange={setTempDateRange}
                        />
                    </div>

                    {/* Bookmarked Documents Filter */}
                    <div>
                        <Checkbox
                            className="text-base text_first"
                            checked={tempBookmarked}
                            onChange={(e) => setTempBookmarked(e.target.checked)}
                        >
                            <BsBookmark className="inline mr-2" />

                            <FormattedMessage id="learning.document.show_bookmarked_only" />
                        </Checkbox>

                    </div>
                </div>
            </Drawer>

            {/* Upload Document Form */}
            <DocumentForm
                visible={uploadDrawerVisible}
                onCloseDetailModel={onCloseDetailModel}
                onClose={() => setUploadDrawerVisible(false)}
                onSubmit={(formData) => {
                    // Simulate API call
                    message.loading({ content: 'Đang tải lên...', key: 'upload' });

                    setTimeout(() => {
                        message.success({
                            content: 'Tài liệu đã được đăng thành công!',
                            key: 'upload',
                            duration: 2
                        });
                        setUploadDrawerVisible(false);
                    }, 1500);
                }}
                loading={false} // Set to true when submitting to API
            />
        </>
    );
};

export default DocumentFilter; 