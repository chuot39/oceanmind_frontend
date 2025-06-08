import React from 'react';
import { Input, Button, Card } from 'antd';
import icon_support from '../../../../../assets/icons/icon_robot.png';

const { TextArea } = Input;

const ContactForm = () => {
    return (
        <div className="flex justify-center">
            <Card className="shadow-md flex flex-col md:flex-row gap-8">
                <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text_first mb-1">First name</label>
                        <Input placeholder="First name" className="w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text_first mb-1">Last name</label>
                        <Input placeholder="Last name" className="w-full" />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text_first mb-1">Email</label>
                    <Input placeholder="Ex: JohnDoe214@gmail.com" className="w-full" />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text_first mb-1">What can we help you with?</label>
                    <TextArea rows={4} placeholder="Type here your message" className="w-full" />
                </div>
                <Button type="primary" className="w-full bg-blue-500 hover:bg-blue-600">
                    join mailing list
                </Button>

            </Card>


            <div className="flex-1 flex items-center justify-center relative">
                <div className='relative'>
                    <div className="absolute top-24 -right-16">
                        <div className="message-bubble message-bubble-left">
                            <p className="text-base text_first font-medium">We are always here to help</p>
                        </div>
                    </div>
                    <div className="absolute left-10 top-[218px]">
                        <div className="message-bubble message-bubble-right">
                            <p className="text-base text_first font-medium">Hello There !</p>
                        </div>
                    </div>
                    <img
                        src={icon_support}
                        alt="Support Team"
                        className="max-w-full h-auto"
                    />
                </div>
            </div>
        </div>



    );
};

export default ContactForm; 