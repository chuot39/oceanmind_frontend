import React, { useState } from 'react';
import { Card, Button, Steps, Modal, Input, QRCode, Alert } from 'antd';
import { FormattedMessage } from 'react-intl';
import { LockOutlined, QrcodeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Marquee from 'react-fast-marquee';

const TwoFactorAuth = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [verificationCode, setVerificationCode] = useState('');

    const showModal = () => {
        setIsModalVisible(true);
        setCurrentStep(0);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setVerificationCode('');
    };

    const handleNext = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsModalVisible(false);
            // Handle 2FA activation here
        }
    };

    const steps = [
        {
            title: <FormattedMessage id="setting.security.2fa.scan_qr" />,
            icon: <QrcodeOutlined />,
            content: (
                <div className="text-center">
                    <QRCode value="https://example.com" className="mx-auto mb-4" />
                    <p className="text-gray-500">
                        <FormattedMessage id="setting.security.2fa.scan_instructions" />
                    </p>
                </div>
            ),
        },
        {
            title: <FormattedMessage id="setting.security.2fa.enter_code" />,
            icon: <LockOutlined />,
            content: (
                <div>
                    <Input
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        className="mb-4"
                    />
                    <p className="text-gray-500">
                        <FormattedMessage id="setting.security.2fa.code_instructions" />
                    </p>
                </div>
            ),
        },
        {
            title: <FormattedMessage id="setting.security.2fa.complete" />,
            icon: <CheckCircleOutlined />,
            content: (
                <div className="text-center">
                    <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                        <FormattedMessage id="setting.security.2fa.success_title" />
                    </h3>
                    <p className="text-gray-500">
                        <FormattedMessage id="setting.security.2fa.success_message" />
                    </p>
                </div>
            ),
        },
    ];

    return (
        <>
            <Card className="security-card mb-6 !mt-16"
                title={
                    <Alert
                        banner
                        type="info"
                        showIcon
                        message={
                            <Marquee speed={60} pauseOnHover gradient={false}>
                                This feature is under development, please wait for the next update! We will notify you when it is ready.🥰🥰🥰
                            </Marquee>
                        }
                        className=" rounded-lg"
                    />
                }
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-2xl">
                            <LockOutlined className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                <FormattedMessage id="setting.security.2fa.title" />
                            </h3>
                            <p className="text-gray-500">
                                <FormattedMessage id="setting.security.2fa.description" />
                            </p>
                        </div>
                    </div>
                    <Button type="primary" onClick={showModal}>
                        <FormattedMessage id="setting.security.2fa.enable" />
                    </Button>
                </div>
            </Card>

            <Modal
                title={<FormattedMessage id="setting.security.2fa.setup_title" />}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        <FormattedMessage id="common.cancel" />
                    </Button>,
                    <Button key="next" type="primary" onClick={handleNext}>
                        {currentStep === 2 ? (
                            <FormattedMessage id="common.finish" />
                        ) : (
                            <FormattedMessage id="common.next" />
                        )}
                    </Button>,
                ]}
                width={600}
            >
                <Steps current={currentStep} items={steps} className="mb-8" />
                <div className="p-4 bg-gray-50 rounded-lg">
                    {steps[currentStep].content}
                </div>
            </Modal>
        </>
    );
};

export default TwoFactorAuth; 