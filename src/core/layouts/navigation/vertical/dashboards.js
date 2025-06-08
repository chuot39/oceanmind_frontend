import { BiHome } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";
import { FormattedMessage } from 'react-intl';

const dashboardNavigation = [
  {
    key: 'dashboards',
    label: <FormattedMessage id="navigation.dashboards" defaultMessage="Dashboards" />,
    icon: <BiHome size={26} />,
    children: [
      {
        key: 'overview',
        label: <FormattedMessage id="navigation.overview" defaultMessage="Overview" />,
        icon: <FaRegCircle size={15} />,
        path: '/dashboard/overview'
      },
      {
        key: 'notification',
        label: <FormattedMessage id="navigation.notification" defaultMessage="Notification" />,
        icon: <FaRegCircle size={15} />,
        path: '/dashboard/notification'
      },
      {
        key: 'event',
        label: <FormattedMessage id="navigation.event" defaultMessage="Event" />,
        icon: <FaRegCircle size={15} />,
        path: '/dashboard/event'
      }
    ]
  },
];

export default dashboardNavigation;