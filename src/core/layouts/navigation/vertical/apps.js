import { CgProfile } from "react-icons/cg";
import { FaRegCircle } from "react-icons/fa";
import { LuBookOpenText } from "react-icons/lu";
import { MdOutlineSettings, MdOutlineSupportAgent } from "react-icons/md";
import { TbNetwork } from "react-icons/tb";
import { FormattedMessage } from 'react-intl';

const appNavigation = [
    {
        key: 'social',
        label: <FormattedMessage id="navigation.social" defaultMessage="Social" />,
        icon: <TbNetwork size={26} />,
        children: [
            {
                key: 'discus',
                label: <FormattedMessage id="navigation.discus" defaultMessage="Discus" />,
                icon: <FaRegCircle size={15} />,
                path: '/social/discus',
            },
            {
                key: 'group',
                label: <FormattedMessage id="navigation.group" defaultMessage="Group" />,
                icon: <FaRegCircle size={15} />,
                path: '/social/group',
            },

            {
                key: 'chat',
                label: <FormattedMessage id="navigation.chat" defaultMessage="Chat" />,
                icon: <FaRegCircle size={15} />,
                path: '/social/chat',
            },
            {
                key: 'friend',
                label: <FormattedMessage id="navigation.friend" defaultMessage="Friend" />,
                icon: <FaRegCircle size={15} />,
                path: '/social/friend',
            }
        ],
    },
    {
        key: 'learning',
        label: <FormattedMessage id="navigation.learning" defaultMessage="Learning" />,
        icon: <LuBookOpenText size={26} />,
        children: [
            {
                key: 'exercise',
                label: <FormattedMessage id="navigation.exercise" defaultMessage="Learning and Exercise" />,
                icon: <FaRegCircle size={15} />,
                path: '/learning/exercise',
            },
            {
                key: 'task',
                label: <FormattedMessage id="navigation.task" defaultMessage="Task" />,
                icon: <FaRegCircle size={15} />,
                path: '/learning/task',
            },
            {
                key: 'calendar',
                label: <FormattedMessage id="navigation.calendar" defaultMessage="Calendar" />,
                icon: <FaRegCircle size={15} />,
                path: '/learning/calendar',
            },
            {
                key: 'process',
                label: <FormattedMessage id="navigation.process" defaultMessage="Learning Process" />,
                icon: <FaRegCircle size={15} />,
                path: '/learning/process',
            },
            {
                key: 'training_program',
                label: <FormattedMessage id="navigation.training_program" defaultMessage="Training Program" />,
                icon: <FaRegCircle size={15} />,
                path: '/learning/training_program',
            },
            {
                key: 'document',
                label: <FormattedMessage id="navigation.document" defaultMessage="Document" />,
                icon: <FaRegCircle size={15} />,
                path: '/learning/document',
            }
        ],
    },
    {
        key: 'profile',
        label: <FormattedMessage id="navigation.profile" defaultMessage="Profile" />,
        icon: <CgProfile size={26} />,
        children: [
            {
                key: 'information',
                label: <FormattedMessage id="navigation.information" defaultMessage="Information" />,
                icon: <FaRegCircle size={15} />,
                path: '/profile/information',
            },
            {
                key: 'manage_account',
                label: <FormattedMessage id="navigation.manage_account" defaultMessage="Manage Account" />,
                icon: <FaRegCircle size={15} />,
                path: '/profile/manage_account',
            },
            {
                key: 'love_item',
                label: <FormattedMessage id="navigation.love_item" defaultMessage="Love Item" />,
                icon: <FaRegCircle size={15} />,
                path: '/profile/love_item',
            },
            // {
            //     key: 'post',
            //     label: <FormattedMessage id="navigation.post" defaultMessage="Post" />,
            //     icon: <FaRegCircle size={15} />,
            //     path: '/profile/post',
            // },
            {
                key: 'study_history',
                label: <FormattedMessage id="navigation.study_history" defaultMessage="Study History" />,
                icon: <FaRegCircle size={15} />,
                path: '/profile/study_history',
            },
            {
                key: 'portfolio',
                label: <FormattedMessage id="navigation.portfolio" defaultMessage="Portfolio" />,
                icon: <FaRegCircle size={15} />,
                path: '/profile/portfolio',
            }
        ],
    },
    {
        key: 'setting',
        label: <FormattedMessage id="navigation.setting" defaultMessage="Setting" />,
        icon: <MdOutlineSettings size={26} />,
        children: [
            // {
            //     key: 'account',
            //     label: <FormattedMessage id="navigation.account" defaultMessage="Account" />,
            //     icon: <FaRegCircle size={15} />,
            //     path: '/setting/account',
            // },
            {
                key: 'setting_notice',
                label: <FormattedMessage id="navigation.setting_notice" defaultMessage="Notification" />,
                icon: <FaRegCircle size={15} />,
                path: '/setting/notification',
            },
            {
                key: 'security',
                label: <FormattedMessage id="navigation.security" defaultMessage="Security" />,
                icon: <FaRegCircle size={15} />,
                path: '/setting/security',
            },
            {
                key: 'customize_theme',
                label: <FormattedMessage id="navigation.customize_theme" defaultMessage="Customize Theme" />,
                icon: <FaRegCircle size={15} />,
                path: '/setting/customize_theme',
            }
        ],
    },
    {
        key: 'support',
        label: <FormattedMessage id="navigation.support" defaultMessage="Support" />,
        icon: <MdOutlineSupportAgent size={26} />,
        children: [
            {
                key: 'guide',
                label: <FormattedMessage id="navigation.support_guide" defaultMessage="Support & Guide" />,
                icon: <FaRegCircle size={15} />,
                path: '/support/guide',
            },
            {
                key: 'feedback',
                label: <FormattedMessage id="navigation.feedback" defaultMessage="Feedback" />,
                icon: <FaRegCircle size={15} />,
                path: '/support/feedback',
            },
            {
                key: 'policy',
                label: <FormattedMessage id="navigation.policy" defaultMessage="Policy" />,
                icon: <FaRegCircle size={15} />,
                path: '/support/policy',
            },
            {
                key: 'update',
                label: <FormattedMessage id="navigation.update" defaultMessage="Update" />,
                icon: <FaRegCircle size={15} />,
                path: '/support/update',
            }
        ],
    },
];

export default appNavigation;