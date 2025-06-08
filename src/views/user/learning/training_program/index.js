import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Input, Button, Select, Tag, Divider, Space } from 'antd';
import { BsFilter, BsPlus, BsX } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import '../../../../core/scss/styles/pages/learning/index.scss';
import FilterDrawer from './components/FilterDrawer';
import { useUserData } from '../../../../utils/hooks/useAuth';
import { useBatch, useDetailClassUser, useFaculty, useSpecialized, useSubject, useCategorySubject } from './hook';
import useSkin from '../../../../utils/hooks/useSkin';

const { Search } = Input;

const TrainingProgram = () => {
    const intl = useIntl();
    const { userData } = useUserData();
    const { language } = useSkin()

    const { status: facultyStatus, data: faculty } = useFaculty();
    const { status: categorySubjectStatus, data: categorySubject } = useCategorySubject();

    const [selectedBatch, setSelectedBatch] = useState({});
    const [selectedMajor, setSelectedMajor] = useState({});
    const [selectedFaculty, setSelectedFaculty] = useState({});

    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState('');
    const [filterValues, setFilterValues] = useState({});
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    useEffect(() => {
        setSelectedBatch({
            value: userData?.regularClass?.batch?.documentId,
            label: userData?.regularClass?.batch?.name
        });

        setSelectedMajor({
            value: userData?.regularClass?.specialized?.documentId,
            label: language === 'vi' ? userData?.regularClass?.specialized?.name_vi : userData?.regularClass?.specialized?.name_en
        });

        setSelectedFaculty({
            value: userData?.regularClass?.specialized?.faculty?.documentId,
            label: language === 'vi' ? userData?.regularClass?.specialized?.faculty?.name_vi : userData?.regularClass?.specialized?.faculty?.name_en
        });
    }, [userData])

    const { status: subjectStatus, data: subject } = useSubject(selectedMajor?.value, selectedBatch?.value);
    const { status: specializedStatus, data: specialized } = useSpecialized(selectedFaculty?.value);
    const { status: batchStatus, data: batch } = useBatch();


    const columns = [
        {
            title: <FormattedMessage id="learning.training_program.stt" />,
            dataIndex: 'stt',
            key: 'stt',
            width: 70,
            sorter: (a, b) => a?.key - b?.key,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: <FormattedMessage id="learning.training_program.subject_code" />,
            dataIndex: 'code',
            key: 'code',
            width: 120,
            sorter: (a, b) => a?.code?.localeCompare(b?.code),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: <FormattedMessage id="learning.training_program.subject_name" />,
            dataIndex: 'name',
            key: 'name',
            width: 200,
            sorter: (a, b) => a?.name?.localeCompare(b?.name),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: <FormattedMessage id="learning.training_program.subject_prerequisite" />,
            dataIndex: 'prerequisite',
            key: 'prerequisite',
            width: 150,
            sorter: (a, b) => a?.prerequisite - b?.prerequisite,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: <FormattedMessage id="learning.training_program.subject_required" />,
            dataIndex: 'required',
            key: 'required',
            width: 150,
            sorter: (a, b) => a?.required - b?.required,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: <FormattedMessage id="learning.training_program.subject_credit" />,
            dataIndex: 'credits',
            key: 'credits',
            width: 100,
            align: 'center',
            sorter: (a, b) => a?.credits - b?.credits,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: <FormattedMessage id="learning.training_program.semester" defaultMessage="Semester" />,
            dataIndex: 'semester',
            key: 'semester',
            width: 100,
            align: 'center',
            sorter: (a, b) => a?.semester - b?.semester,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: <FormattedMessage id="learning.training_program.type" defaultMessage="Type" />,
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (text, record, index) => (
                <Tag color={index % 2 === 0 ? 'purple' : 'processing'}>{text}</Tag>
            )
        }
    ];

    console.log('subject', subject?.data)

    const filteredData = useMemo(() => {
        if (!subject?.data) return [];

        let result = subject?.data?.map((item, index) => ({
            key: index + 1,
            stt: index + 1,
            code: item?.subject?.subject_code,
            name: item?.subject?.name,
            prerequisite: item?.subject?.detail_prepequisite_subjects?.length > 0 ? item?.subject?.detail_prepequisite_subjects?.map(item => item?.prerequisite_subject?.name) : '--',
            required: item?.subject?.detail_previous_subjects?.length > 0 ? item?.subject?.detail_previous_subjects?.map(item => item?.previous_subject?.name) : '--',
            credits: item?.subject?.credits,
            semester: item?.semester || '--',
            type: language === 'vi' ? item?.category_subject?.name_vi : item?.category_subject?.name_en,
            typeId: item?.category_subject?.documentId,
            requiredStatus: item?.subject?.is_required
        }));

        // Apply search filter
        if (searchText) {
            const lowerSearchText = searchText.toLowerCase();
            result = result.filter(item =>
                (item.name && item.name.toLowerCase().includes(lowerSearchText)) ||
                (item.code && item.code.toLowerCase().includes(lowerSearchText))
            );
        }

        // Apply drawer filters
        if (filterValues.semester && filterValues.semester.length > 0) {
            result = result.filter(item => filterValues.semester.includes(item.semester));
        }

        if (filterValues.type && filterValues.type.length > 0) {
            result = result.filter(item => filterValues.type.includes(item.typeId));
        }

        if (filterValues.credits && filterValues.credits.length > 0) {
            result = result.filter(item => filterValues.credits.includes(item.credits));
        }

        if (filterValues.required !== undefined) {
            result = result.filter(item => item.requiredStatus === filterValues.required);
        }

        // Reindex items after filtering
        return result.map((item, index) => ({
            ...item,
            stt: index + 1,
            key: index + 1
        }));
    }, [subject?.data, searchText, filterValues, language]);

    const handleFilter = (values) => {
        setFilterValues(values);
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setPageSize(pagination.pageSize);
    };


    const handleFacultyChange = (value, option) => {
        setSelectedFaculty(option);
        setSelectedMajor(null); // Reset major when faculty changes
    };

    // Handle removing individual filter
    const handleRemoveFilter = (filterKey, value) => {
        const updatedFilters = { ...filterValues };

        if (Array.isArray(updatedFilters[filterKey])) {
            updatedFilters[filterKey] = updatedFilters[filterKey].filter(item => item !== value);
            if (updatedFilters[filterKey].length === 0) {
                delete updatedFilters[filterKey];
            }
        } else {
            delete updatedFilters[filterKey];
        }

        setFilterValues(updatedFilters);
    };

    // Handle clearing all filters
    const handleClearAllFilters = () => {
        setFilterValues({});
    };

    // Get filter tags for display
    const getFilterTags = () => {
        const tags = [];

        // Semester filter tags
        if (filterValues.semester && filterValues.semester.length > 0) {
            filterValues.semester.forEach(semester => {
                tags.push({
                    key: `semester-${semester}`,
                    label: `${intl.formatMessage({ id: 'learning.training_program.semester' })}: ${semester}`,
                    value: semester,
                    filterKey: 'semester'
                });
            });
        }

        // Type filter tags
        if (filterValues.type && filterValues.type.length > 0) {
            filterValues.type.forEach(typeId => {
                const typeObj = categorySubject?.data?.find(item => item.documentId === typeId);
                const typeName = typeObj ? (language === 'vi' ? typeObj.name_vi : typeObj.name_en) : typeId;

                tags.push({
                    key: `type-${typeId}`,
                    label: `${intl.formatMessage({ id: 'learning.training_program.type' })}: ${typeName}`,
                    value: typeId,
                    filterKey: 'type'
                });
            });
        }

        // Credits filter tags
        if (filterValues.credits && filterValues.credits.length > 0) {
            filterValues.credits.forEach(credit => {
                tags.push({
                    key: `credit-${credit}`,
                    label: `${intl.formatMessage({ id: 'learning.training_program.subject_credit' })}: ${credit}`,
                    value: credit,
                    filterKey: 'credits'
                });
            });
        }

        // Required filter tag
        if (filterValues.required !== undefined) {
            const requiredLabel = filterValues.required
                ? intl.formatMessage({ id: 'learning.training_program.required_yes', defaultMessage: "Required" })
                : intl.formatMessage({ id: 'learning.training_program.required_no', defaultMessage: "Not Required" });

            tags.push({
                key: 'required',
                label: `${intl.formatMessage({ id: 'learning.training_program.subject_required' })}: ${requiredLabel}`,
                value: filterValues.required,
                filterKey: 'required'
            });
        }

        return tags;
    };

    const filterTags = getFilterTags();

    return (
        <Card className="training-program-page p-0 mb-10">
            <div className="mb-4">
                <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                    <span className='text-primary'>
                        <FormattedMessage id="learning.training_program.title" />
                    </span>
                    <span className='text_title'>
                        {selectedMajor?.label}
                    </span>
                </h2>

                <Divider />
                <div className="flex items-end gap-4 px-4">
                    <div className="w-1/4">
                        <p className="mb-2 font-medium">
                            <FormattedMessage id="learning.training_program.faculty" defaultMessage="Faculty" />
                        </p>
                        <Select
                            loading={facultyStatus === 'loading'}
                            value={selectedFaculty?.value}
                            onChange={handleFacultyChange}
                            style={{ width: '100%' }}
                            options={faculty?.data?.map((item) => ({
                                value: item?.documentId,
                                label: language === 'vi' ? item?.name_vi : item?.name_en
                            }))}
                        />
                    </div>


                    <div className="w-1/4">
                        <p className="mb-2 font-medium">
                            <FormattedMessage id="learning.training_program.major" defaultMessage="Major" />
                        </p>
                        <Select
                            loading={specializedStatus === 'loading'}
                            value={selectedMajor?.value}
                            onChange={(value, option) => setSelectedMajor(option)}
                            style={{ width: '100%' }}
                            options={specialized?.data?.map((item) => ({
                                value: item?.documentId,
                                label: language === 'vi' ? item?.name_vi : item?.name_en
                            }))}
                        />
                    </div>

                    <div className="w-1/4">
                        <p className="mb-2 font-medium">
                            <FormattedMessage id="learning.training_program.batch" defaultMessage="Batch" />
                        </p>
                        <Select
                            loading={batchStatus === 'loading'}
                            value={selectedBatch?.value}
                            onChange={(value, option) => setSelectedBatch(option)}
                            style={{ width: '100%' }}
                            options={batch?.data?.map((item) => ({
                                value: item?.documentId,
                                label: item?.name
                            }))}
                        />
                    </div>

                    <div className="w-2/4 flex items-center justify-end gap-2">
                        <div style={{ width: '250px' }}>
                            <Search
                                placeholder={intl.formatMessage({
                                    id: 'learning.training_program.search_placeholder',
                                    defaultMessage: "Enter subject name"
                                })}
                                allowClear
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                        <Button
                            icon={<BsFilter />}
                            onClick={() => setIsFilterVisible(true)}
                        >
                            <FormattedMessage id="learning.training_program.filter" />
                        </Button>
                        {/* <Button type="primary" icon={<BsPlus />}>
                            <FormattedMessage id="learning.training_program.add_subject" />
                        </Button> */}
                    </div>
                </div>
            </div>

            {/* Filter tags display */}
            {filterTags.length > 0 && (
                <div className="px-4 py-2 filter-tags-container mb-3">
                    <Space size={[0, 8]} wrap>
                        {filterTags.map(tag => (
                            <Tag
                                key={tag.key}
                                closable
                                onClose={() => handleRemoveFilter(tag.filterKey, tag.value)}
                                color="blue"
                            >
                                {tag.label}
                            </Tag>
                        ))}
                        {filterTags.length > 0 && (
                            <Button
                                size="small"
                                type="primary"
                                onClick={handleClearAllFilters}
                                className="clear-all-btn"
                            >
                                <FormattedMessage id="common.clear_all" defaultMessage="Clear All" />
                            </Button>
                        )}
                    </Space>
                </div>
            )}

            <Table
                className='custom_table'
                columns={columns}
                dataSource={filteredData}
                loading={specializedStatus === 'loading' || facultyStatus === 'loading' || subjectStatus === 'loading'}
                pagination={{
                    position: ['bottomRight'],
                    className: 'custom-pagination pe-3',
                    pageSize: pageSize,
                    showSizeChanger: true,
                    total: filteredData?.length,
                    pageSizeOptions: [10, 20, 50, 100]
                }}
                onChange={handleTableChange}
            />

            <FilterDrawer
                visible={isFilterVisible}
                onClose={() => setIsFilterVisible(false)}
                onApply={handleFilter}
                currentFilters={filterValues}
            />
        </Card>
    );
};

export default TrainingProgram;