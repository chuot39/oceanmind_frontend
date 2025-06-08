import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Button, Avatar, Upload, message, Divider, Radio, Alert } from 'antd'
import '../../../core/scss/styles/pages/registerUser.scss'
import useSkin from '../../../utils/hooks/useSkin'
import { FaFacebookF } from 'react-icons/fa'
import { Slide, toast } from 'react-toastify'
import logo from '@assets/images/logo/logo-main.jpg';
import { SiGmail } from 'react-icons/si'
import axios from 'axios';
import { API_BASE_URL } from '@/constants';
import Loading from '../../../components/loader/Loading'
import { BiCoffee, BiUserPlus } from 'react-icons/bi'
import { CameraOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import loginDarkImage from '@assets/images/pages/login-v2-dark.svg';
import loginLightImage from '@assets/images/pages/login-v2.svg';
import { handleNoticeAction, notifyError, notifySuccess } from '@/utils/Utils';

// Import default avatars
import user1 from '@assets/images/user/user-1.jpg';
import user2 from '@assets/images/user/user-2.jpg';
import user3 from '@assets/images/user/user-3.jpg';
import user4 from '@assets/images/user/user-4.jpg';
import user5 from '@assets/images/user/user-5.jpg';
import user6 from '@assets/images/user/user-6.jpg';
import Marquee from 'react-fast-marquee'
import { FormattedMessage, useIntl } from 'react-intl'
import ImgCrop from 'antd-img-crop'
import { useRegister } from './mutationHooks'

const { Dragger } = Upload;

const ToastContent = ({ name }) => {
    return (
        <div className='flex'>
            <div className='me-2'>
                <Avatar className='bg-green-500' icon={<BiCoffee size={21} />} />
            </div>
            <div className='flex flex-col'>
                <div className='flex justify-between'>
                    <h6 className='text-lg'>{name}</h6>
                </div>
                <span className=''>Account created successfully! Please login to continue.</span>
            </div>
        </div>
    )
}

const Register = () => {
    const { skin } = useSkin()
    const intl = useIntl()
    const navigate = useNavigate()
    const location = useLocation()
    const { mutate: register, isLoading: isRegisterLoading } = useRegister();

    const source = skin === 'dark' ? loginDarkImage : loginLightImage;
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [avatarType, setAvatarType] = useState('custom');
    const [selectedAvatar, setSelectedAvatar] = useState(user1);
    const [uploading, setUploading] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const isFromLogin = location.state?.from === 'login';
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const defaultAvatars = [
        { src: user1, id: 1 },
        { src: user2, id: 2 },
        { src: user3, id: 3 },
        { src: user4, id: 4 },
        { src: user5, id: 5 },
        { src: user6, id: 6 },
    ];

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    // Dummy request để không thực sự upload file khi chọn
    const dummyRequest = ({ onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };


    const handleAvatarUpload = ({ file }) => {
        // Kiểm tra định dạng file
        // if (!isValidFileType(file)) {
        //     message.error(`File ${file.name} không được hỗ trợ. Chỉ chấp nhận file PNG, JPG.`);
        //     return;
        // }

        // Lưu file hiện tại
        setCurrentFile(file);

        // Xử lý trạng thái uploading
        if (file.status === 'uploading') {
            setUploading(true);
            return;
        }

        if (file.status === 'done' || file.status === 'error') {
            setUploading(false);
        }

        // Tạo URL preview cho file
        if (file.originFileObj) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file.originFileObj);
        }
    };


    const onFinish = async (values) => {
        setIsLoading(true);

        console.log('currentFile', currentFile)
        try {
            const userData = {
                fullname: values.fullname,
                username: values.username,
                email: values.email,
                password: values.password,
                // avatar_url_id: currentFile?.originFileObj,
            }
            const response = register(userData, {
                onSuccess: () => {
                    console.log('response', response)
                    setTimeout(() => {
                        setIsLoading(false);
                        toast.success(
                            <ToastContent name={values.username} />,
                            { icon: false, transition: Slide, hideProgressBar: true, autoClose: 3000 }
                        );
                        navigate('/login');
                    }, 1500);
                },
                onError: (error) => {
                    setIsLoading(false);
                    notifyError('Registration failed: ' + (error.response?.data?.message || 'Unknown error'));
                }
            });
        } catch (error) {
            setIsLoading(false);
            notifyError('Registration failed: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // Animation variants for page transition
    const pageVariants = {
        initial: {
            opacity: 0,
            x: isFromLogin ? 100 : -100
        },
        in: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        out: {
            opacity: 0,
            x: 100,
            transition: {
                duration: 0.5,
                ease: "easeIn"
            }
        }
    };

    return (
        <div className='auth-wrapper h-full'>
            <div className='grid grid-cols-12 gap-4 h-dvh'>
                {!isMobile && (
                    <div className='col-span-7 md:col-span-7 sm:col-span-12 flex flex-wrap h-full p-5 _background_first'>
                        <div className='w-full h-fit flex justify-start items-center pe-36'>
                            <Link className='h-fit items-center flex' to='/' onClick={e => e.preventDefault()}>
                                <img className='object-fill h-14 w-1h-14 rounded-2xl bg-red-400' src={logo} alt='Login Logo' />
                                <h2 className='text-sky-500 w-72 font-bold text-2xl ms-1'>Ocean Mind</h2>
                            </Link>
                        </div>
                        <div className='w-full flex items-center justify-center p-8 md:p-16 lg:p-32'>
                            <img className='w-full h-auto' src={source} alt='Login Cover' />
                        </div>
                    </div>
                )}
                <motion.div
                    className={`${isMobile ? 'col-span-12' : 'col-span-5 md:col-span-5 sm:col-span-12'} flex items-center px-8 md:px-16 p-lg-5 register-input login-input`}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                >
                    <div className='px-xl-2 py-5 mx-auto w-full'>
                        {isMobile && (
                            <div className='w-full flex justify-center mb-6'>
                                <Link className='h-fit items-center flex' to='/' onClick={e => e.preventDefault()}>
                                    <img className='object-fill h-14 w-1h-14 rounded-2xl bg-red-400' src={logo} alt='Login Logo' />
                                    <h2 className='text-sky-500 w-72 font-bold text-2xl ms-1'>Ocean Mind</h2>
                                </Link>
                            </div>
                        )}

                        <h1 className='font-medium mb-1 text-2xl md:text-3xl text_first'>Adventure Starts Here 🚀</h1>
                        <p className="mb-4 text_first">Join Ocean Mind and start your journey today!</p>

                        <Form
                            form={form}
                            name="register"
                            style={{
                                maxWidth: '100%',
                            }}
                            layout="vertical"
                            autoComplete="off"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            scrollToFirstError
                        >

                            {/* Fullname and Username */}
                            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                                <Form.Item
                                    hasFeedback
                                    name="fullname"
                                    validateTrigger="onBlur"
                                    label={<FormattedMessage id="profile.manage_account.fullname" />}
                                    rules={[
                                        { required: true, message: intl.formatMessage({ id: 'profile.manage_account.fullname_required' }) },
                                        { max: 30, message: intl.formatMessage({ id: 'profile.manage_account.fullname_max' }, { max: 30 }) },
                                        { min: 4, message: intl.formatMessage({ id: 'profile.manage_account.fullname_min' }, { min: 4 }) },
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({ id: 'setting.account.fullname_placeholder' })} />
                                </Form.Item>

                                <Form.Item
                                    hasFeedback
                                    validateTrigger="onBlur"
                                    name="username"
                                    label={<FormattedMessage id="setting.account.username" />}
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({ id: 'setting.account.username_required' })
                                        }
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({ id: 'setting.account.username_placeholder' })} />
                                </Form.Item>
                            </div>

                            {/* Email */}
                            <Form.Item
                                hasFeedback
                                validateTrigger="onBlur"
                                name="email"
                                label={<FormattedMessage id="setting.account.email" />}
                                rules={[
                                    {
                                        required: true,
                                        type: 'email',
                                        message: intl.formatMessage({ id: 'setting.account.email_required' })
                                    }
                                ]}
                            >
                                <Input placeholder={intl.formatMessage({ id: 'setting.account.email_placeholder' })} />
                            </Form.Item>

                            {/* Password */}
                            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                                <Form.Item
                                    hasFeedback
                                    label={<span className="text_first"><FormattedMessage id="profile.manage_account.password" /></span>}
                                    name="password"
                                    validateDebounce={1000}
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({ id: 'profile.manage_account.password_required' }),
                                        },
                                        {
                                            min: 5,
                                            message: intl.formatMessage({ id: 'profile.manage_account.password_min' }, { min: 5 }),
                                        },
                                        {
                                            max: 15,
                                            message: intl.formatMessage({ id: 'profile.manage_account.password_max' }, { max: 15 }),
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder="Enter your password" />
                                </Form.Item>

                                <Form.Item
                                    hasFeedback
                                    label={<span className="text_first"><FormattedMessage id="profile.manage_account.confirm_password" /></span>}
                                    name="confirm"
                                    dependencies={['password']}
                                    validateDebounce={1000}
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({ id: 'profile.manage_account.confirm_password_required' }),
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error(intl.formatMessage({ id: 'profile.manage_account.confirm_password_not_match' })));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Confirm your password" />
                                </Form.Item>
                            </div>

                            <Form.Item className='w-full'>
                                {
                                    isRegisterLoading ?
                                        <Button
                                            className='w-full mt-2 bg-gradient-to-r from-purple-500 to-indigo-400 text-white'
                                            type='primary'
                                            htmlType='submit'
                                            disabled
                                        >
                                            <Loading />  Creating Account...
                                        </Button>
                                        :
                                        <Button
                                            className='w-full mt-2 bg-gradient-to-r from-purple-500 to-indigo-400 text-white'
                                            type='primary'
                                            htmlType='submit'
                                            icon={<BiUserPlus size={18} />}
                                        >
                                            Sign Up
                                        </Button>
                                }
                            </Form.Item>
                        </Form>

                        <div>
                            <p className='text-center mt-2'>
                                <span className='me-25 text_first'>Already have an account?</span>
                                <Link
                                    to='/login'
                                    state={{ from: 'register' }}
                                >
                                    <span className='text-base hover:text-purple-400 !text-purple-500'> Sign in instead</span>
                                </Link>
                            </p>
                            <div className='text-center'>
                                <Divider plain className="my-4">
                                    <span className="text_first">or sign up with</span>
                                </Divider>
                            </div>
                            <div className='flex justify-center gap-3'>
                                <Button
                                    type='primary'
                                    className='bg-blue-600 text-white'
                                    icon={<FaFacebookF size={15} />}
                                    onClick={() => {
                                        handleNoticeAction({
                                            message: 'This feature is under development 🚀',
                                            action: 'Please try again later.',
                                            skin: skin
                                        });
                                    }}
                                />
                                <Button
                                    type='primary'
                                    className='bg-red-400 text-white'
                                    icon={<SiGmail size={15} />}
                                    danger
                                    onClick={() => {
                                        handleNoticeAction({
                                            message: 'This feature is under development 🚀',
                                            action: 'Please try again later.',
                                            skin: skin
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Register