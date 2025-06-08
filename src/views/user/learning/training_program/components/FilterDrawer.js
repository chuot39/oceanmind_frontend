import React, { useEffect } from 'react';
import { Drawer, Form, Select, Button } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import useSkin from '../../../../../utils/hooks/useSkin';
import { useCategorySubject } from '../hook';

const FilterDrawer = ({ visible, onClose, onApply, currentFilters = {} }) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const { language } = useSkin();
    const { data: categorySubject, isLoading: categorySubjectLoading } = useCategorySubject();

    // Update form when currentFilters change or drawer becomes visible
    useEffect(() => {
        if (visible) {
            form.setFieldsValue(currentFilters);
        }
    }, [visible, currentFilters, form]);

    const handleReset = () => {
        form.resetFields();
        onApply({}); // Apply empty filter when reset
    };

    const handleApply = () => {
        onApply(form.getFieldsValue());
        onClose(); // Close drawer after applying filters
    };

    // Options for filters
    const semesterOptions = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
        { value: 6, label: '6' },
        { value: 7, label: '7' },
        { value: 8, label: '8' },
    ];

    const typeOptions = categorySubject?.data?.map(item => ({
        value: item?.documentId,
        label: language === 'vi' ? item?.name_vi : item?.name_en
    }));

    // const typeOptions = [
    //     {
    //         value: 'TC-1',
    //         label: intl.formatMessage({ id: 'learning.training_program.subject_elective_required' })
    //     },
    //     {
    //         value: 'TC-2',
    //         label: intl.formatMessage({ id: 'learning.training_program.subject_elective_optional' })
    //     },
    //     {
    //         value: 'TC-3',
    //         label: intl.formatMessage({ id: 'learning.training_program.subject_elective' })
    //     },
    //     {
    //         value: 'Bắt Buộc',
    //         label: intl.formatMessage({ id: 'learning.training_program.subject_required' })
    //     },
    //     {
    //         value: 'Chứng chỉ',
    //         label: intl.formatMessage({ id: 'learning.training_program.certificate' })
    //     }
    // ];

    const creditOptions = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' }
    ];

    return (
        <Drawer
            title={<FormattedMessage id="learning.training_program.filter" />}
            placement="right"
            onClose={onClose}
            open={visible}
            width={400}
            className="filter_drawer"
            extra={
                <div className="flex justify-end gap-2">
                    <Button onClick={handleReset} type="default">
                        <FormattedMessage id="common.clear_filters" />
                    </Button>
                    <Button onClick={handleApply} type="primary">
                        <FormattedMessage id="common.apply" />
                    </Button>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={currentFilters}
            >
                <Form.Item
                    name="semester"
                    label={<FormattedMessage id="learning.training_program.semester" />}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder={intl.formatMessage({
                            id: 'learning.training_program.select_semester',
                            defaultMessage: "Select semester"
                        })}
                        options={semesterOptions}
                    />
                </Form.Item>

                <Form.Item
                    name="type"
                    label={<FormattedMessage id="learning.training_program.type" />}
                >
                    <Select
                        loading={categorySubjectLoading}
                        mode="multiple"
                        allowClear
                        placeholder={intl.formatMessage({
                            id: 'learning.training_program.select_type',
                            defaultMessage: "Select type"
                        })}
                        options={typeOptions}
                    />
                </Form.Item>

                <Form.Item
                    name="credits"
                    label={<FormattedMessage id="learning.training_program.subject_credit" />}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder={intl.formatMessage({
                            id: 'learning.training_program.select_credits',
                            defaultMessage: "Select credits"
                        })}
                        options={creditOptions}
                    />
                </Form.Item>

                <Form.Item
                    name="required"
                    label={<FormattedMessage id="learning.training_program.subject_required" />}
                >
                    <Select
                        allowClear
                        placeholder={intl.formatMessage({
                            id: 'learning.training_program.select_required',
                            defaultMessage: "Select required status"
                        })}
                        options={[
                            {
                                value: true,
                                label: intl.formatMessage({
                                    id: 'learning.training_program.required_yes',
                                    defaultMessage: "Required"
                                })
                            },
                            {
                                value: false,
                                label: intl.formatMessage({
                                    id: 'learning.training_program.required_no',
                                    defaultMessage: "Not Required"
                                })
                            }
                        ]}
                    />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default FilterDrawer; 