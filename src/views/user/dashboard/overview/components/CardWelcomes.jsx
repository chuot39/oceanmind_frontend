// ... existing code ...
import { Avatar, Button, Card, Col, Row } from 'antd'
import welcome_left from '@assets/icons/welcome_left.png'
import welcome_right from '@assets/icons/welcome_right.png'
import { MdChatBubbleOutline, MdNotificationsNone } from 'react-icons/md';
import { FaTasks } from 'react-icons/fa';
import { RiUserAddLine } from 'react-icons/ri';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { formatDate } from 'date-fns';


const CardWelcomes = ({ userData, language }) => {

  return (
    <Card className='card-congratulations'>

      <Row gutter={10} className='text-center flex'>
        <Col span={10}><img className='congratulations-img-left' src={welcome_left} alt='decor-left' /> </Col>
        <Col span={4} className='mt-6'><Avatar src={userData?.avatar?.file_path} className='shadow' size={60} /> </Col>
        <Col span={10} className='flex justify-end'><img className='w-40 h-20' src={welcome_right} alt='decor-right' /> </Col>
      </Row>

      <Row className='text-center justify-center'>
        <div className={`text-welcome text-3xl font-bold ${language === 'vi' ? 'w-72' : 'w-52'}`}><FormattedMessage id="dashboard.welcome" /> {userData?.fullname}!</div>
      </Row>

      <Row className='mx-5 mt-4 rounded-lg' style={{ background: 'linear-gradient(90deg, rgba(90.51, 225.81, 249.69, 0.71) 0%, rgba(218.17, 170, 255, 0.45) 100%)' }}>
        <Col span={12} className='ps-3'>
          <div className=" leading-7 test_first">
            <p><FormattedMessage id="dashboard.personal_info.name" />: {userData?.fullname}</p>
            <p className='line-clamp-1'><FormattedMessage id="dashboard.personal_info.gender" />: {language === 'vi' ? userData?.gender?.name_vi : userData?.gender?.name_en}</p>
            <p className='line-clamp-1'><FormattedMessage id="dashboard.personal_info.dob" />: {userData?.date_of_birth && formatDate(userData?.date_of_birth, 'dd/MM/yyyy')}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className=" leading-7 test_first">
            <p className='line-clamp-1'><FormattedMessage id="dashboard.personal_info.department" />: {language === 'vi' ? userData?.regularClass?.specialized?.faculty?.name_vi : userData?.regularClass?.specialized?.faculty?.name_en}</p>
            <p className='line-clamp-1'><FormattedMessage id="dashboard.personal_info.major" />: {language === 'vi' ? userData?.regularClass?.specialized?.name_vi : userData?.regularClass?.specialized?.name_en}</p>
            <p><FormattedMessage id="dashboard.personal_info.class" />: {userData?.regularClass?.name}</p>
          </div>
        </Col>
      </Row>

      <Row gutter={10} className='actions_welcome py-2'>
        <Col span={6} className='flex justify-center'>
          <NavLink to="/dashboard/notification">
            <Button color="default" variant="outlined" className='icon_actions bg-blue-300' icon={<MdNotificationsNone size={25} />} size={'large'} />
          </NavLink>
        </Col>
        <Col span={6} className='flex justify-center'>
          <NavLink to="/social/chat">
            <Button color="default" variant="outlined" className='icon_actions' icon={<MdChatBubbleOutline size={25} />} size={'large'} />
          </NavLink>
        </Col>
        <Col span={6} className='flex justify-center'>
          <NavLink to="/learning/task">
            <Button color="default" variant="outlined" className='icon_actions' icon={<FaTasks size={25} />} size={'large'} />
          </NavLink>
        </Col>
        <Col span={6} className='flex justify-center'>
          <NavLink to="/social/friend">
            <Button color="default" variant="outlined" className='icon_actions' icon={<RiUserAddLine size={25} />} size={'large'} />
          </NavLink>
        </Col>
      </Row>

    </Card>
  )
}

export default CardWelcomes