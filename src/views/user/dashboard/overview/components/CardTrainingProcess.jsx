// ... existing code ...
import { Card, Col, Row } from 'antd'
import { MdFilterCenterFocus } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { BsCardChecklist } from 'react-icons/bs';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { PiWarningCircleBold } from 'react-icons/pi';
import { ImCancelCircle } from 'react-icons/im';
import SimplePieChart from '@components/chart/SimplePieChart';
import { useTrainingProcess } from '../hook';
import { IoMdArrowRoundForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const CardTrainingProcess = ({ userData, skin }) => {

  const navigate = useNavigate()
  const { data: trainingProcess, status: trainingProcessStatus } = useTrainingProcess(userData?.documentId)

  const totalCredits = trainingProcess?.data?.reduce((total, item) => {
    return total + (item?.subject?.credits || 0);
  }, 0);

  const gradeA = trainingProcess?.data?.filter(item => item?.score >= 8.5).length;
  const gradeB = trainingProcess?.data?.filter(item => item?.score >= 7 && item?.score < 8.5).length;
  const gradeC = trainingProcess?.data?.filter(item => item?.score >= 5.5 && item?.score < 7).length;
  const gradeD = trainingProcess?.data?.filter(item => item?.score >= 4 && item?.score < 5.5).length;
  const gradeF = trainingProcess?.data?.filter(item => item?.score < 4).length;

  console.log('trainingProcess', trainingProcess)

  return (
    <Card className='card-training-process' loading={trainingProcessStatus === 'loading'}>
      <Row gutter={10} className='text-center flex '>
        <Col span={12} className="flex justify-start font-bold text-xl pt-3 !px-6 text_first"><FormattedMessage id="dashboard.training_progress" /></Col>
        <Col span={12} className="flex justify-end items-center font-bold text-lg py-3 !px-6 text_action cursor-pointer"
          onClick={() => navigate('/learning/process')}
        >
          More
          <IoMdArrowRoundForward className='ms-1' />
        </Col>
      </Row>

      <Row gutter={16} align="middle ps-6 ">
        <Col span={8} className=''>
          <div className=' items-center my-4 w-fit'>
            <div className={`text-3xl font-semibold w-full ${skin === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {totalCredits}
            </div>

            <div className={`font-semibold flex items-center text-lg ${skin === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
              <BsCardChecklist className='me-3 w-9 h-9' />
              <FormattedMessage id="dashboard.training_process.total_credits" />
            </div>
          </div>

          <div className='flex items-center my-4 py-1'>
            <div className={`font-bold text-center rounded-md w-10 h-10 flex items-center justify-center ${skin === 'dark' ? 'bg-green-600 text-white' : 'bg-green-200 text-green-600'}`}>
              <FaRegCircleCheck className='w-7 h-7' />
            </div>
            <div className={`text-base ms-3 leading-3 ${skin === 'dark' ? 'text-white' : 'text-green-600 font-semibold'}`}>
              <FormattedMessage id="dashboard.training_process.grade_a" />
              <div className='text-2xl'> {gradeA}</div>
            </div>
          </div>


          <div className='flex items-center my-4 py-1'>
            <div className={`font-bold text-center rounded-md w-10 h-10 flex items-center justify-center ${skin === 'dark' ? 'bg-cyan-400 text-white' : 'bg-cyan-200 text-cyan-600'}`}>
              <FaRegCircleCheck className='w-7 h-7' />
            </div>
            <div className={`text-base ms-3 leading-3 ${skin === 'dark' ? 'text-white' : 'text-cyan-600 font-semibold'}`}>
              <FormattedMessage id="dashboard.training_process.grade_b" />
              <div className='text-2xl'> {gradeB}</div>
            </div>
          </div>

          <div className='flex items-center my-4 py-1'>
            <div className={`font-bold text-center rounded-md w-10 h-10 flex items-center justify-center ${skin === 'dark' ? 'bg-indigo-300 text-white' : 'bg-indigo-200 text-indigo-500'}`}>
              <MdFilterCenterFocus className='w-7 h-7' />
            </div>
            <div className={`text-base ms-3 leading-3 ${skin === 'dark' ? 'text-white' : 'text-indigo-400 font-semibold'}`}>
              <FormattedMessage id="dashboard.training_process.grade_c" />
              <div className='text-2xl'> {gradeC}</div>
            </div>
          </div>

          <div className='flex items-center my-4 py-1'>
            <div className={`font-bold text-center rounded-md w-10 h-10 flex items-center justify-center ${skin === 'dark' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-500'}`}>
              <PiWarningCircleBold className='w-7 h-7' />
            </div>
            <div className={`text-base ms-3 leading-3 ${skin === 'dark' ? 'text-white' : 'text-amber-500 font-semibold'}`}>
              <FormattedMessage id="dashboard.training_process.grade_d" />
              <div className='text-2xl'> {gradeD}</div>
            </div>
          </div>

          <div className='flex items-center my-4 py-1'>
            <div className={`font-bold text-center rounded-md w-10 h-10 flex items-center justify-center ${skin === 'dark' ? 'bg-red-600 text-white' : 'bg-red-200 text-red-600'}`}>
              <ImCancelCircle className='w-7 h-7' />
            </div>
            <div className={`text-base ms-3 leading-3 ${skin === 'dark' ? 'text-white' : 'text-red-600 font-semibold'}`}>
              <FormattedMessage id="dashboard.training_process.grade_f" />
              <div className='text-2xl'> {gradeF}</div>
            </div>
          </div>
        </Col>
        <Col span={16}>
          <div className='flex justify-center items-center h-full'>
            <SimplePieChart gradeA={gradeA} gradeB={gradeB} gradeC={gradeC} gradeD={gradeD} gradeF={gradeF} />
          </div>
        </Col>
      </Row>

    </Card>
  )
}

export default CardTrainingProcess