import { BiCategoryAlt, BiHome } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";
import { LuBookOpenText } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { MdDashboardCustomize, MdReportGmailerrorred, MdSupportAgent } from "react-icons/md";
import { FormattedMessage } from 'react-intl';
import { GrSystem } from "react-icons/gr";

const adminDashboardNavigation = [
    {
        key: 'admin-dashboards',
        label: <FormattedMessage id="navigation.admin.dashboard" defaultMessage="Dashboard" />,
        icon: <BiHome size={26} />,
        children: [
            {
                key: 'admin-overview',
                label: <FormattedMessage id="navigation.admin.overview" defaultMessage="Overview" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/dashboard/overview'
            },
            {
                key: 'admin-notification',
                label: <FormattedMessage id="navigation.admin.notification" defaultMessage="Notification" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/dashboard/notification'
            },
            {
                key: 'admin-event',
                label: <FormattedMessage id="navigation.admin.event" defaultMessage="Event" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/dashboard/event'
            }
        ]
    },

    {
        key: 'admin-reports',
        label: <FormattedMessage id="navigation.admin.report" defaultMessage="Report" />,
        icon: <MdReportGmailerrorred size={26} />,
        children: [
            {
                key: 'admin-post',
                label: <FormattedMessage id="navigation.admin.post" defaultMessage="Post" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/report/post'
            },
            {
                key: 'admin-group',
                label: <FormattedMessage id="navigation.admin.group" defaultMessage="Group" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/report/group'
            },
            {
                key: 'admin-user',
                label: <FormattedMessage id="navigation.admin.user" defaultMessage="User" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/report/user'
            }
            // {
            //     key: 'admin-comment',
            //     label: <FormattedMessage id="navigation.admin.comment" defaultMessage="Comment" />,
            //     icon: <FaRegCircle size={15} />,
            //     path: '/admin/report/comment'
            // }
        ]
    },

    {
        key: 'admin-learnings',
        label: <FormattedMessage id="navigation.admin.learning" defaultMessage="Learning Management" />,
        icon: <LuBookOpenText size={26} />,
        children: [
            {
                key: 'admin-learning-overview',
                label: <FormattedMessage id="navigation.admin.overview" defaultMessage="Overview" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/learning/overview'
            },
            {
                key: 'admin-learning-faculty',
                label: <FormattedMessage id="navigation.admin.faculty" defaultMessage="Faculty" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/learning/faculty'
            },
            {
                key: 'admin-learning-specialization',
                label: <FormattedMessage id="navigation.admin.specialization" defaultMessage="Specialization" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/learning/specialization'
            },
            {
                key: 'admin-learning-batch',
                label: <FormattedMessage id="navigation.admin.batch" defaultMessage="Batch" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/learning/batch'
            },
            {
                key: 'admin-learning-class',
                label: <FormattedMessage id="navigation.admin.class" defaultMessage="Class" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/learning/class'
            },
            {
                key: 'admin-learning-subject',
                label: <FormattedMessage id="navigation.admin.subject" defaultMessage="Subject" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/learning/subject'
            },
            {
                key: 'admin-learning-study',
                label: <FormattedMessage id="navigation.admin.study" defaultMessage="Study" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/learning/study'
            }
        ]
    },

    {
        key: 'admin-profile',
        label: <FormattedMessage id="navigation.admin.profile" defaultMessage="User Management" />,
        icon: <CgProfile size={26} />,
        children: [
            {
                key: 'admin-user',
                label: <FormattedMessage id="navigation.admin.user" defaultMessage="User" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/user'
            },
            {
                key: 'admin-career',
                label: <FormattedMessage id="navigation.admin.career" defaultMessage="Career" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/career'
            }
        ]
    },

    // {
    //     key: 'admin-project',
    //     label: <FormattedMessage id="navigation.admin.project" defaultMessage="Project Management" />,
    //     icon: <MdDashboardCustomize size={26} />,
    //     path: '/admin/project'
    // },

    {
        key: 'admin-category-management',
        label: <FormattedMessage id="navigation.admin.category" defaultMessage="Category Management" />,
        icon: <BiCategoryAlt size={26} />,
        children: [
            {
                key: 'admin-setting-subject-category',
                label: <FormattedMessage id="navigation.admin.subject_category" defaultMessage="Subject Category" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/category/subject-category'
            },
            {
                key: 'admin-setting-task-category',
                label: <FormattedMessage id="navigation.admin.task_category" defaultMessage="Task Category" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/category/task-category'
            },
            {
                key: 'admin-setting-notice-type',
                label: <FormattedMessage id="navigation.admin.notice_type" defaultMessage="Notice Type" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/category/notice-type'
            },
            {
                key: 'admin-setting-category-support',
                label: <FormattedMessage id="navigation.admin.category_support" defaultMessage="Category Support" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/category/category-support'
            },
            {
                key: 'admin-setting-tag',
                label: <FormattedMessage id="navigation.admin.tag" defaultMessage="Tag" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/category/tag'
            }
        ]
    },

    // Support
    {
        key: 'admin-support',
        label: <FormattedMessage id="navigation.admin.support" defaultMessage="Support" />,
        icon: <MdSupportAgent size={26} />,
        children: [
            {
                key: 'admin-support-faq',
                label: <FormattedMessage id="navigation.admin.support_faq" defaultMessage="FAQ" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/support/faq'
            },
            {
                key: 'admin-support-guide',
                label: <FormattedMessage id="navigation.admin.support_guide" defaultMessage="Guide" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/support/guide'
            }
        ]
    },

    // System
    {
        key: 'admin-system',
        label: <FormattedMessage id="navigation.admin.system" defaultMessage="System" />,
        icon: <GrSystem size={26} />,
        children: [
            {
                key: 'admin-system-policy',
                label: <FormattedMessage id="navigation.admin.policy" defaultMessage="Policy" />,
                icon: <FaRegCircle size={15} />,
                path: '/admin/system/policy'
            }
        ]
    }
];

export default adminDashboardNavigation; 