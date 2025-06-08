import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Button, Avatar, message, Divider } from 'antd'
import '../../../core/scss/styles/pages/loginUser.scss'
import useSkin from '../../../utils/hooks/useSkin'
import { FaFacebookF } from 'react-icons/fa'
import { Slide, toast } from 'react-toastify'
import logo from '@assets/images/logo/logo-main.jpg';
import { SiGmail } from 'react-icons/si'
// import { useLogin } from '@utils/hooks/useAuth'
import Loading from '../../../components/loader/Loading'
import { BiCoffee } from 'react-icons/bi'
import loginDarkImage from '@assets/images/pages/login-v2-dark.svg';
import loginLightImage from '@assets/images/pages/login-v2.svg';
import { handleNoticeAction, notifyError } from '@/utils/Utils'
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLogin } from './mutationHooks'
import { FormattedMessage } from 'react-intl'

const ToastContent = ({ t, name, role }) => {
    return (
        <div className='flex'>
            <div className='me-2'>
                <Avatar className='bg-green-500' icon={<BiCoffee size={21} />} />
            </div>
            <div className='flex flex-col'>
                <div className='flex justify-between'>
                    <h6 className='text-lg'>{name}</h6>
                </div>
                <span className=''><FormattedMessage id="dashboard.welcome_message" /></span>
            </div>
        </div>
    )
}

const Login = () => {
    const { skin } = useSkin()
    const navigate = useNavigate()
    const location = useLocation()
    const source = skin === 'dark' ? loginDarkImage : loginLightImage;
    const [form] = Form.useForm();
    const { mutate: login, isLoading } = useLogin();
    const isFromRegister = location.state?.from === 'register';
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onFinish = ({ username, password }) => {
        login({ username, password }, {
            onSuccess: (data) => {
                // message.success('Login successful');
                toast.success(
                    <ToastContent name={data?.user?.fullname} />,
                    { icon: false, transition: Slide, hideProgressBar: true, autoClose: 3000 }
                )
                navigate('/dashboard/overview')
            },
            onError: (error) => {
                notifyError(error.response?.data?.message || 'Login failed')
            }
        });
    };

    const onFinishFailed = () => {
        // toast.error('Submit failed!');
    };

    // Animation variants for page transition
    const pageVariants = {
        initial: {
            opacity: 0,
            x: isFromRegister ? -100 : 100
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
                        <div className='w-full h-fit flex items-center justify-start pe-36'>
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
                    className={`${isMobile ? 'col-span-12' : 'col-span-5 md:col-span-5 sm:col-span-12'} flex items-center px-8 md:px-16 p-lg-5 login-input`}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                >
                    <div className='px-xl-2 mx-auto w-full'>
                        {isMobile && (
                            <div className='w-full flex justify-center mb-6'>
                                <Link className='h-fit items-center flex' to='/' onClick={e => e.preventDefault()}>
                                    <img className='object-fill h-14 w-1h-14 rounded-2xl bg-red-400' src={logo} alt='Login Logo' />
                                    <h2 className='text-sky-500 w-72 font-bold text-2xl ms-1'>Ocean Mind</h2>
                                </Link>
                            </div>
                        )}
                        <h1 className='font-medium mb-1 text-2xl md:text-3xl text_first'>Welcome to OceanMind! 👋</h1>
                        <p className="mb-4 text_first">Please sign-in to your account and start the adventure</p>
                        <Form
                            form={form}
                            name="trigger"
                            style={{
                                maxWidth: '100%',
                            }}
                            layout="vertical"
                            autoComplete="on"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                hasFeedback
                                label={
                                    <span className="text_first">Username</span>
                                }
                                name="username"
                                validateTrigger="onBlur"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your username!'
                                    },
                                    {
                                        min: 4,
                                        message: 'Username must be at least 4 characters long!',
                                    },
                                ]}
                            >
                                <Input placeholder="Enter your username here" />
                            </Form.Item>

                            <Form.Item
                                hasFeedback
                                className='config_label'
                                label={
                                    <div className='flex justify-between w-full'>
                                        <span className="text_first">Password</span>
                                        <Link to="/forgot-password" className='text-sm text-blue-500'>Forgot Password ?</Link>
                                    </div>
                                }
                                name="password"
                                validateDebounce={1000}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your password!',
                                    },
                                    {
                                        min: 5,
                                        message: 'Password must be at least 5 characters long!',
                                    },
                                    {
                                        max: 15,
                                        message: 'Password cannot exceed 15 characters!',
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Enter your password" />
                            </Form.Item>

                            <Form.Item className='w-full'>
                                {
                                    isLoading ?
                                        <Button
                                            className='w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-300 text-white'
                                            type='primary'
                                            htmlType='submit'
                                            disabled
                                        >
                                            <Loading />  Login
                                        </Button>
                                        :
                                        <Button
                                            className='w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-300 text-white'
                                            type='primary'
                                            htmlType='submit'
                                        >
                                            Login
                                        </Button>
                                }
                            </Form.Item>
                        </Form>

                        <div>
                            <p className='text-center mt-2'>
                                <span className='me-25 text_first'>New on our platform?</span>
                                <Link
                                    to='/register'
                                    state={{ from: 'login' }}
                                >
                                    <span className='text-base hover:text-blue-400 !text-blue-500'>Create an account</span>
                                </Link>
                            </p>
                            <div className='text-center'>
                                <Divider plain className="my-4">
                                    <span className="text_first">or</span>
                                </Divider>
                            </div>
                            <div className='flex justify-center gap-3'>
                                <Button
                                    type='primary'
                                    className='bg-blue-600 text-white'
                                    icon={<FaFacebookF s ize={15} />}
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

export default Login
