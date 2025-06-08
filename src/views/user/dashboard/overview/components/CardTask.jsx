// ... existing code ...
import { Card, Col, Row } from 'antd'
import { FormattedMessage } from 'react-intl';
import { BsCardChecklist } from 'react-icons/bs';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { PiWarningCircleBold } from 'react-icons/pi';
import { ImCancelCircle } from 'react-icons/im';
import RadialBarChart from '../../../../../components/chart/RadialBarChart';
import { useUserTaskCount } from '../../../components/hook';
import { getTaskStatus } from '@/helpers/taskHelper';
import { IoMdArrowRoundForward } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';

const CardTask = ({ userData, skin }) => {

  const navigate = useNavigate()
  const { status: taskUserStatus, data: taskUser } = useUserTaskCount(userData?.documentId)


  return (
    <Card className='card-training-process h-full' loading={taskUserStatus === 'loading'}>
      <Row gutter={10} className='text-center flex '>
        <Col span={12} className="flex justify-start font-bold text-2xl py-3 text_first" style={{ paddingLeft: '24px', paddingRight: '24px' }}><FormattedMessage id="dashboard.my_tasks.title" /></Col>
        <Col span={12} className="flex justify-end items-center font-bold text-lg py-3 !px-6 text_action cursor-pointer"
          onClick={() => navigate('/learning/task')}
        >
          More
          <IoMdArrowRoundForward className='ms-1' />
        </Col>
      </Row>

      <Row gutter={16} align="middle ps-6 mt-4 !mr-3">
        <Col span={8} className=''>
          <div className=' items-center my-4 w-fit'>
            <div className={`text-3xl font-semibold w-full ${skin === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {taskUser?.total}
            </div>

            <div className={`font-semibold flex items-center text-lg ${skin === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
              <BsCardChecklist className='me-3 w-9 h-9' />
              <FormattedMessage id="dashboard.my_tasks.total_tasks" />
            </div>
          </div>

          <div className='flex items-center my-4 py-1'>
            <div className={`font-bold text-center rounded-md w-10 h-10 flex items-center justify-center ${skin === 'dark' ? 'bg-green-600 text-white' : 'bg-green-200 text-green-600'}`}>
              <FaRegCircleCheck className='w-7 h-7' />
            </div>
            <div className={`text-base ms-3 leading-3 ${skin === 'dark' ? 'text-white' : 'text-green-600 font-semibold'}`}>
              <FormattedMessage id="dashboard.my_tasks.completed" />
              <div className='text-2xl'> {taskUser?.completed}</div>
            </div>
          </div>

          <div className='flex items-center my-4 py-1'>
            <div className={`font-bold text-center rounded-md w-10 h-10 flex items-center justify-center ${skin === 'dark' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-500'}`}>
              <PiWarningCircleBold className='w-7 h-7' />
            </div>
            <div className={`text-base ms-3 leading-3 ${skin === 'dark' ? 'text-white' : 'text-amber-500 font-semibold'}`}>
              <FormattedMessage id="dashboard.my_tasks.in_progress" />
              <div className='text-2xl'> {taskUser?.incompleted}</div>
            </div>
          </div>

          <div className='flex items-center my-4 py-1'>
            <div className={`font-bold text-center rounded-md w-10 h-10 flex items-center justify-center ${skin === 'dark' ? 'bg-red-600 text-white' : 'bg-red-200 text-red-600'}`}>
              <ImCancelCircle className='w-7 h-7' />
            </div>
            <div className={`text-base ms-3 leading-3 ${skin === 'dark' ? 'text-white' : 'text-red-600 font-semibold'}`}>
              <FormattedMessage id="dashboard.my_tasks.overdue" />
              <div className='text-2xl'> {taskUser?.overdue}</div>
            </div>
          </div>
        </Col>
        <Col span={16}>
          <div className='flex justify-center items-center h-full'>
            <RadialBarChart taskCompleted={taskUser?.completed} taskIncompleted={taskUser?.incompleted} taskOverdue={taskUser?.overdue} />
          </div>
        </Col>
      </Row>

    </Card>
  )
}

export default CardTask