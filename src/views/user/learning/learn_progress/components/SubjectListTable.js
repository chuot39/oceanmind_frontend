import React, { useEffect, useState } from 'react';
import { Table, Card, Input, Button, Space, Tag, Dropdown, Form, Select, message, Drawer, Modal } from 'antd';
import { BsFilter, BsDownload, BsPlus, BsThreeDotsVertical, BsPencil, BsTrash } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import useSkin from '../../../../../utils/hooks/useSkin';
import SubjectSelect from '@/components/elements/SubjectSelect';
import { useCreateSubjectLearn, useUpdateSubjectLearn, useDeleteSubjectLearn } from '../useMutationHooks';
import { useUserData } from '@/utils/hooks/useAuth';
import * as XLSX from 'xlsx';

const { Search } = Input;
const { Option } = Select;

const SubjectListTable = ({ subjects = [], subjectStatus, subjectLearn, subjectLearnStatus, refetchSubjectLearn }) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const { userData } = useUserData();
    const { skin, language } = useSkin();

    const [sortedInfo, setSortedInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [subjectData, setSubjectData] = useState([]);
    const [editingSubject, setEditingSubject] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [deletingSubject, setDeletingSubject] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
    });

    const { mutate: createSubjectLearned, isLoading: isLoadingCreate } = useCreateSubjectLearn();
    const { mutate: updateSubjectLearned, isLoading: isLoadingUpdate } = useUpdateSubjectLearn();
    const { mutate: deleteSubjectLearned, isLoading: isLoadingDelete } = useDeleteSubjectLearn();

    const handleSearch = (value) => {
        setSearchText(value);
        // Reset pagination when searching
        setPagination({
            ...pagination,
            current: 1
        });
    };

    // Handle table change (sorting, pagination)
    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination);
        setSortedInfo(sorter);
    };

    const handleExport = () => {
        // Chuẩn bị dữ liệu
        const headers = ['Mã môn', 'Tên môn học', 'Số tín chỉ', 'Học kỳ', 'Trạng thái', 'Điểm', 'Loại'];
        const data = subjectData.map(subject => [
            subject.code,
            subject.name,
            subject.credits,
            `Học kỳ ${subject.semester}`,
            subject.status === 'completed' ? 'Đã hoàn thành' :
                subject.status === 'in-progress' ? 'Đang học' : 'Chưa học',
            subject.grade || '',
            language === 'vi' ? subject.category?.name_vi : subject.category?.name_en
        ]);

        // Tạo workbook mới
        const wb = XLSX.utils.book_new();

        // Thêm dữ liệu vào worksheet
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

        // Thêm worksheet vào workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Danh sách môn học');

        // Xuất file Excel
        XLSX.writeFile(wb, 'danh_sach_mon_hoc.xlsx');

        message.success(intl.formatMessage({ id: 'learning.learning_progress.export_success' }));
    };

    const handleAddEdit = (values) => {
        console.log('values', values)
        const data = {
            score: values?.score,
            semester: values?.semester,
            subject_id: values?.subject_id?.documentId,
            student_id: userData?.documentId
        }
        if (editingSubject) {
            updateSubjectLearned({ scoreId: editingSubject?.documentIdScore, data: data },
                {
                    onSuccess: () => {
                        setIsModalVisible(false);
                        form.resetFields();
                        refetchSubjectLearn();
                    },
                }
            );
        } else {
            createSubjectLearned({ data: data },
                {
                    onSuccess: () => {
                        setIsModalVisible(false);
                        form.resetFields();
                        refetchSubjectLearn();
                    },
                    onError: (error) => {

                    }
                }
            );
        }
    };

    const showDeleteConfirm = (subject) => {
        setDeletingSubject(subject);
        setDeleteModalVisible(true);
    };

    const handleDelete = () => {
        if (!deletingSubject) return;

        deleteSubjectLearned(
            { scoreId: deletingSubject.documentId },
            {
                onSuccess: () => {
                    setDeleteModalVisible(false);
                    setDeletingSubject(null);
                },
                onError: (error) => {
                }
            }
        );
    };

    const showAddEditModal = (subject = null) => {
        console.log('subject edit', subject)
        setEditingSubject(subject);
        if (subject) {
            // Find the complete subject data from subjectLearn
            const subjectData = subjectLearn?.find(item => item?.subject?.documentId === subject.id);
            console.log('subjectData', subjectData)
            // Tạo đối tượng subject_id đầy đủ thông tin
            const fullSubjectObject = {
                documentId: subject.id,
                name: subject.name,
                // Copy các thuộc tính cần thiết khác từ subjectData?.subject_id nếu có
                // ...subjectData?.subject_id
            };

            // console.log('fullSubjectObject', fullSubjectObject)


            form.setFieldsValue({
                subject_id: subjectData?.subject?.subject, // Pass full subject object với đầy đủ thông tin
                semester: subject.semester,
                score: subject.grade !== '--' ? subject.grade : undefined
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    // Get filtered and sorted data
    const getProcessedData = () => {
        let result = [...subjectData];
        // Apply search filter
        if (searchText) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                item.code.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Apply sorting
        if (sortedInfo.columnKey) {
            result = [...result].sort((a, b) => {
                const valueA = a[sortedInfo.columnKey];
                const valueB = b[sortedInfo.columnKey];

                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return sortedInfo.order === 'ascend'
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }

                return sortedInfo.order === 'ascend'
                    ? valueA - valueB
                    : valueB - valueA;
            });
        }

        return result;
    };

    const columns = [
        {
            title: <FormattedMessage id="learning.learning_progress.subject_code" />,
            dataIndex: 'code',
            key: 'code',
            width: 120,
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'code' && sortedInfo.order,
        },
        {
            title: <FormattedMessage id="learning.learning_progress.subject_name" />,
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        },
        {
            title: <FormattedMessage id="learning.learning_progress.subject_credit" />,
            dataIndex: 'credits',
            key: 'credits',
            width: 100,
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'credits' && sortedInfo.order,
        },
        {
            title: <FormattedMessage id="learning.learning_progress.subject_semester" />,
            dataIndex: 'semester',
            key: 'semester',
            width: 120,
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'semester' && sortedInfo.order,
        },
        {
            title: <FormattedMessage id="learning.learning_progress.subject_status" />,
            dataIndex: 'status',
            key: 'status',
            width: 120,
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
            render: (status) => {
                let color;
                let text;
                switch (status) {
                    case 'completed':
                        color = 'success';
                        text = intl.formatMessage({ id: 'learning.learning_progress.status.completed' });
                        break;
                    case 'in_progress':
                        color = 'processing';
                        text = intl.formatMessage({ id: 'learning.learning_progress.status.in_progress' });
                        break;
                    case 'not_started':
                        color = 'default';
                        text = intl.formatMessage({ id: 'learning.learning_progress.status.not_started' });
                        break;
                    case 'failed':
                        color = 'error';
                        text = intl.formatMessage({ id: 'learning.learning_progress.status.failed' });
                        break;
                    default:
                        color = 'default';
                        text = status;
                }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: <FormattedMessage id="learning.learning_progress.subject_grade" />,
            dataIndex: 'grade',
            key: 'grade',
            width: 100,
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'grade' && sortedInfo.order,
        },
        {
            title: <FormattedMessage id="learning.learning_progress.subject_category" />,
            dataIndex: 'category',
            key: 'category',
            width: 150,
            // sorter: (a, b) => {
            //     const nameA = a.category?.name_en || '';
            //     const nameB = b.category?.name_en || '';
            //     return nameA.localeCompare(nameB);
            // },
            // sortOrder: sortedInfo.columnKey === 'category' && sortedInfo.order,
            render: (category) => {
                let color;
                let text;
                switch (category?.name_en) {
                    case 'Physical':
                        color = 'green';
                        text = language === 'vi' ? category?.name_vi : category?.name_en;
                        break;
                    case 'Internship':
                        color = 'purple';
                        text = language === 'vi' ? category?.name_vi : category?.name_en;
                        break;
                    case 'Specialized':
                        color = 'cyan';
                        text = language === 'vi' ? category?.name_vi : category?.name_en;
                        break;
                    case 'English':
                        color = 'blue';
                        text = language === 'vi' ? category?.name_vi : category?.name_en;
                        break;
                    case 'General':
                        color = 'magenta';
                        text = language === 'vi' ? category?.name_vi : category?.name_en;
                        break;
                    case 'Elective':
                        color = 'volcano';
                        text = language === 'vi' ? category?.name_vi : category?.name_en;
                        break;
                    default:
                        color = 'gold';
                        text = language === 'vi' ? category?.name_vi : category?.name_en;
                }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: <FormattedMessage id="learning.learning_progress.actions" />,
            key: 'actions',
            width: 80,
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'edit',
                                label: <FormattedMessage id="learning.learning_progress.edit" />,
                                icon: <BsPencil />,
                                onClick: () => showAddEditModal(record)
                            },
                            {
                                key: 'delete',
                                label: <FormattedMessage id="learning.learning_progress.delete" />,
                                icon: <BsTrash />,
                                danger: true,
                                onClick: () => showDeleteConfirm(record)
                            }
                        ]
                    }}
                    trigger={['click']}
                >
                    <Button type="text" icon={<BsThreeDotsVertical />} />
                </Dropdown>
            )
        }
    ];

    useEffect(() => {
        // Create a map to avoid duplicates based on subject_id.documentId
        const uniqueSubjects = {};

        // First, process all subjects from subjectLearn
        subjectLearn?.forEach(item => {
            const id = item?.subject?.documentId;
            if (id && !uniqueSubjects[id]) {
                uniqueSubjects[id] = {
                    id: id,
                    documentId: item?.subject?.subject?.documentId,
                    documentIdScore: item?.documentId,
                    code: item?.subject?.subject?.subject_code,
                    name: item?.subject?.subject?.name,
                    credits: item?.subject?.subject?.credits,
                    semester: item?.semester,
                    status: item?.score ? 'completed' : 'in_progress',
                    grade: item?.score || '--',
                    category: item?.subject?.category_subject
                };
            }
        });

        // Convert the map to array
        setSubjectData(Object.values(uniqueSubjects));
    }, [subjectLearn]);

    return (
        <Card title={intl.formatMessage({ id: 'learning.learning_progress.subject_list' })} className="subject-list-table">
            <div className="mb-4 flex justify-between items-center">
                <Space>
                    <Search
                        placeholder={intl.formatMessage({ id: 'learning.learning_progress.search_placeholder' })}
                        allowClear
                        onSearch={handleSearch}
                        style={{ width: 250 }}
                        onChange={(e) => setSearchText(e.target.value)}
                    // prefix={<BsSearch />}
                    />
                    {/* <Button icon={<BsFilter />}>
                        <FormattedMessage id="learning.learning_progress.filter" />
                    </Button> */}
                </Space>
                <Space>
                    <Button
                        icon={<BsDownload />}
                        onClick={handleExport}
                    >
                        <FormattedMessage id="learning.learning_progress.export" />
                    </Button>
                    <Button
                        type="primary"
                        icon={<BsPlus />}
                        onClick={() => showAddEditModal()}
                    >
                        <FormattedMessage id="learning.learning_progress.add_point_subject" />
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={getProcessedData()}
                rowKey="id"
                pagination={{
                    ...pagination,
                    className: 'custom-pagination',
                    showTotal: (total) => intl.formatMessage({ id: 'learning.learning_progress.total_subjects' }, { total }),
                    pageSizeOptions: ['5', '10', '20', '50']
                }}
                onChange={handleTableChange}
            />

            {/* Modal xác nhận xóa */}
            <Modal
                title={intl.formatMessage({ id: 'learning.learning_progress.delete_confirmation_title' })}
                open={deleteModalVisible}
                onOk={handleDelete}
                confirmLoading={isLoadingDelete}
                onCancel={() => {
                    setDeleteModalVisible(false);
                    setDeletingSubject(null);
                }}
                okText={intl.formatMessage({ id: 'learning.learning_progress.confirm' })}
                cancelText={intl.formatMessage({ id: 'learning.learning_progress.cancel' })}
                okButtonProps={{ danger: true }}
            >
                <p>
                    {intl.formatMessage(
                        { id: 'learning.learning_progress.delete_confirmation_message' },
                        { subject: deletingSubject?.name }
                    )}
                </p>
            </Modal>

            <Drawer
                title={
                    editingSubject
                        ? intl.formatMessage({ id: 'learning.learning_progress.edit_subject' })
                        : intl.formatMessage({ id: 'learning.learning_progress.add_subject' })
                }
                placement="right"
                width={600}
                open={isModalVisible}
                onClose={() => {
                    setIsModalVisible(false);
                    setEditingSubject(null);
                    form.resetFields();
                }}
                extra={
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setIsModalVisible(false);
                                setEditingSubject(null);
                                form.resetFields();
                            }}>
                                <FormattedMessage id="learning.learning_progress.cancel" />
                            </Button>
                            <Button type="primary" loading={isLoadingCreate || isLoadingUpdate} onClick={form.submit}>
                                {editingSubject
                                    ? <FormattedMessage id="learning.learning_progress.update" />
                                    : <FormattedMessage id="learning.learning_progress.add" />
                                }
                            </Button>
                        </Space>
                    </div>
                }
            >
                <Form form={form} layout="vertical" onFinish={handleAddEdit} >
                    <Form.Item
                        name="subject_id"
                        label={<FormattedMessage id="learning.learning_progress.select_subject" />}
                        className="flex-1 mb-4"
                        rules={[{ required: true, message: intl.formatMessage({ id: 'learning.learning_progress.name_required' }) }]}
                    >
                        {/* <SubjectSelect
                            placeholder={intl.formatMessage({ id: 'learning.learning_progress.select_subject' })}
                            excludeSubjects={editingSubject ? subjectData.filter(s => s.id !== editingSubject.id).map(s => s.id) : subjectData.map(subject => subject.id)}
                            onChange={(value) => {
                                form.setFieldsValue({ subject_id: value });
                            }}
                        /> */}

                        <SubjectSelect
                            value={form.getFieldValue('subject_id') || editingSubject?.subject_id}
                            onChange={(value) => form.setFieldsValue({ subject_id: value })}
                            placeholder={intl.formatMessage({ id: 'learning.learning_progress.select_subject' })}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <div className="flex gap-4">
                        <Form.Item
                            name="semester"
                            className="flex-1 mb-4"
                            label={<FormattedMessage id="learning.learning_progress.subject_semester" />}
                            rules={[{ required: true, message: intl.formatMessage({ id: 'learning.learning_progress.semester_required' }) }]}
                        >
                            <Select>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                    <Option key={num} value={num}>{num}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="score"
                            className="flex-1 mb-4"
                            rules={[
                                // { required: true, message: intl.formatMessage({ id: 'learning.learning_progress.grade_required' }) },
                                {
                                    validator: async (_, value) => {
                                        const numValue = parseFloat(value);
                                        console.log('numValue', numValue)
                                        console.log('value', value)
                                        if (isNaN(numValue) && value !== undefined) {
                                            throw new Error(intl.formatMessage({ id: 'learning.learning_progress.grade_invalid' }));
                                        }
                                        if (numValue < 0) {
                                            throw new Error(intl.formatMessage({ id: 'learning.learning_progress.grade_min' }));
                                        }
                                        if (numValue > 10) {
                                            throw new Error(intl.formatMessage({ id: 'learning.learning_progress.grade_max' }));
                                        }
                                    }
                                }
                            ]}
                            label={<FormattedMessage id="learning.learning_progress.subject_grade" />}
                        >
                            <Input type="number" />
                        </Form.Item>

                    </div>

                </Form>
            </Drawer>
        </Card>
    );
};

export default SubjectListTable; 