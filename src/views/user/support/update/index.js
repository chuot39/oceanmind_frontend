import React from 'react';
import { BiCalendarStar } from 'react-icons/bi';
import { FaLock } from 'react-icons/fa';
import { BsTools, BsShare } from 'react-icons/bs';
import { MdWarning } from 'react-icons/md';
import { FiPhoneCall } from 'react-icons/fi';
import UpdateHeader from './components/UpdateHeader';
import UpdateCard from './components/UpdateCard';
import UpdateFooter from './components/UpdateFooter';
import '../../../../core/scss/styles/pages/support/update.scss';

const Update = () => {
    const updates = [
        {
            icon: <BiCalendarStar className="text-blue-500" />,
            title: "📅 Cập nhật tính năng mới: Lên lịch làm việc thông minh!",
            description: "Chúng tôi rất vui thông báo rằng giờ đây bạn có thể tạo lịch làm việc cá nhân, theo dõi tiến độ công việc và nhận nhắc nhở qua email! Hãy thử ngay tính năng này để quản lý công việc hiệu quả hơn."
        },
        {
            icon: <FaLock className="text-green-500" />,
            title: "🔐 Nâng cấp bảo mật hệ thống",
            description: "Chúng tôi đã nâng cấp hệ thống bảo mật để đảm bảo sự an toàn tuyệt đối cho tài khoản của bạn. Để bảo vệ thông tin cá nhân, vui lòng thay đổi mật khẩu của bạn ngay hôm nay. Đừng lo, quá trình thay đổi mật khẩu rất đơn giản!"
        },
        {
            icon: <BsTools className="text-gray-600" />,
            title: "🛠️ Thông báo bảo trì hệ thống",
            description: "Vào lúc 10:00 - 12:00 ngày XX/XX/XXXX, chúng tôi sẽ tiến hành bảo trì hệ thống để cải thiện hiệu suất trang web. Hãy nhớ lưu công việc của bạn và đăng xuất trước thời gian bảo trì nhé! Cảm ơn bạn đã thông cảm."
        },
        {
            icon: <BsShare className="text-purple-500" />,
            title: "📚 Cập nhật mới: Chia sẻ tài liệu dễ dàng hơn!",
            description: "Chúng tôi đã cải thiện tính năng chia sẻ tài liệu để giúp bạn dễ dàng tải lên và chia sẻ tài liệu nhóm với tốc độ nhanh hơn. Đừng quên chia sẻ những tài liệu hữu ích với các bạn trong lớp!"
        },
        {
            icon: <MdWarning className="text-yellow-500" />,
            title: "⚠️ Lưu ý quan trọng!",
            description: "Vào lúc 10:00 - 12:00 ngày XX/XX/XXXX, chúng tôi sẽ tiến hành bảo trì hệ thống để cải thiện hiệu suất trang web. Hãy nhớ lưu công việc của bạn và đăng xuất trước thời gian bảo trì nhé! Cảm ơn bạn đã thông cảm."
        },
        {
            icon: <FiPhoneCall className="text-red-500" />,
            title: "📞 Cần trợ giúp?",
            description: "Nếu bạn gặp bất kỳ khó khăn nào trong quá trình sử dụng, đừng ngần ngại liên hệ với bộ phận hỗ trợ của chúng tôi qua mục 'Trợ giúp' trên trang web hoặc gửi email tới support@oceanmind.edu.vn. Chúng tôi luôn sẵn sàng giúp đỡ bạn!"
        }
    ];

    return (
        <div className="update-container space-y-6 mb-8">
            <UpdateHeader />

            <div className="update-grid">
                {updates.map((update, index) => (
                    <UpdateCard
                        key={index}
                        icon={update.icon}
                        title={update.title}
                        description={update.description}
                    />
                ))}
            </div>

            <UpdateFooter />
        </div>
    );
};

export default Update;