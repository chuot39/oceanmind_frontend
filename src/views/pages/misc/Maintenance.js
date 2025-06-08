import React from 'react';
import { Button, Form, Input } from 'antd';
import { toast } from 'react-toastify';
import { BsTools, BsBellFill } from 'react-icons/bs';
import { FiMail } from 'react-icons/fi';
import useSkin from '../../../utils/hooks/useSkin';
import '../../../core/scss/styles/pages/page-misc.scss';
import maintenanceDarkImage from '../../../assets/images/pages/under-maintenance-dark.svg';
import maintenanceLightImage from '../../../assets/images/pages/under-maintenance.svg';

const Maintenance = () => {
  const { skin } = useSkin();
  const source = skin === 'dark' ? maintenanceDarkImage : maintenanceLightImage;

  const onFinish = (values) => {
    toast.info(
      <div className="flex items-center gap-2">
        <BsBellFill className="text-xl text-blue-500" />
        <div>
          <h4 className="font-medium text-base mb-1">Maintenance Notification</h4>
          <div className="flex items-center gap-2 text-sm">
            <FiMail />
            <span>{values.email}</span>
          </div>
          <p className="text-sm mt-1">We'll notify you when we're back online!</p>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: skin === 'dark' ? 'colored-toast dark' : 'colored-toast',
        style: {
          background: skin === 'dark' ? '#283046' : '#fff',
          color: skin === 'dark' ? '#fff' : '#283046'
        }
      }
    );
  };

  return (
    <div className="misc-wrapper">
      <a className="brand-logo flex items-center" href="/">
        <svg viewBox="0 0 139 95" version="1.1" height="28" className="text-primary">
          <defs>
            <linearGradient x1="100%" y1="10.5120544%" x2="50%" y2="89.4879456%" id="linearGradient-1">
              <stop stopColor="#000000" offset="0%"></stop>
              <stop stopColor="#FFFFFF" offset="100%"></stop>
            </linearGradient>
            <linearGradient x1="64.0437835%" y1="46.3276743%" x2="37.373316%" y2="100%" id="linearGradient-2">
              <stop stopColor="#EEEEEE" stopOpacity="0" offset="0%"></stop>
              <stop stopColor="#FFFFFF" offset="100%"></stop>
            </linearGradient>
          </defs>
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-400.000000, -178.000000)">
              <g transform="translate(400.000000, 178.000000)">
                <path
                  d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
                  className="text-primary"
                  style={{ fill: 'currentColor' }}
                ></path>
                <path
                  d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
                  fill="url(#linearGradient-1)"
                  opacity="0.2"
                ></path>
                <polygon
                  fill="#000000"
                  opacity="0.049999997"
                  points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
                ></polygon>
                <polygon
                  fill="#000000"
                  opacity="0.099999994"
                  points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
                ></polygon>
                <polygon
                  fill="url(#linearGradient-2)"
                  opacity="0.099999994"
                  points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
                ></polygon>
              </g>
            </g>
          </g>
        </svg>
        <h2 className="brand-text text-primary ml-1">Vuexy</h2>
      </a>

      <div className="misc-inner p-8">
        <div className="w-full text-center">
          <div className="flex items-center justify-center mb-4">
            <BsTools className="text-3xl text-primary mr-2" />
            <h2 className="text-2xl font-bold">Under Maintenance</h2>
          </div>

          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Sorry for the inconvenience but we're performing some maintenance at the moment
          </p>

          <Form
            onFinish={onFinish}
            className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-lg mx-auto mb-8"
          >
            <Form.Item
              name="email"
              className="w-full md:w-2/3 mb-0"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                placeholder="john@example.com"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="w-full md:w-auto mb-0">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="rounded-lg"
              >
                Notify Me
              </Button>
            </Form.Item>
          </Form>

          <img
            className="max-w-2xl mx-auto w-full"
            src={source}
            alt="Under maintenance page"
          />
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
