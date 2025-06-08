import React from 'react';
import { Button, Card, Form, Image, Input } from 'antd';
import icon_robot from '../../../../../assets/icons/icon_robot.png';
import { FormattedMessage } from 'react-intl';

const ContactInfo = () => {
    return (
        <div className=" rounded-lg mb-8 contact_info_container">
            <Card className="mb-8 gap-6 card_contact_info">
                <div className="w-32 h-32">
                    <Image src={icon_robot} preview={false} alt="Robot Avatar" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                    <p className=" text-lg text-justify leading-relaxed">
                        <FormattedMessage id="support.feedback.contact_message" />
                    </p>
                </div>
                {/* </Card>
            <Card className=""> */}
                <Form className="w-full">
                    <div className="grid grid-cols-2 gap-6">
                        <Form.Item name="name">
                            <label className="block text_first font-medium mb-2"><FormattedMessage id="support.feedback.name" /></label>
                            <Input
                                placeholder="Ocean Pham"
                                className="w-full border rounded-md"
                            />
                        </Form.Item>
                        <Form.Item name="contact_number">
                            <label className="block text_first font-medium mb-2"><FormattedMessage id="support.feedback.contact_number" /></label>
                            <Input
                                placeholder="+91 00000 00000"
                                className="w-full border rounded-md"
                            />
                        </Form.Item>
                    </div>
                    <Form.Item name="email">
                        <label className="block text_first font-medium mb-2"><FormattedMessage id="support.feedback.email" /></label>
                        <Input
                            placeholder="xyz123@gmail.com"
                            className="w-full border rounded-md"
                        />
                    </Form.Item>
                    <Form.Item name="submit">
                        <Button className='float-right' type="primary" htmlType="submit">
                            <FormattedMessage id="common.submit" />
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

        </div>
    );
};

export default ContactInfo; 