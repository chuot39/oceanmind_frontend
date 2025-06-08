// ... existing code ...
import { useState, useMemo, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card } from 'antd';
import { useIntl } from 'react-intl';
import { useUserPost } from '../hook';

const PostOfMonth = ({ userData, skin }) => {
  const colors = ['#21D3EE', '#A5B4FC'];
  const intl = useIntl();
  const { data: userPost } = useUserPost(userData?.documentId);

  // Get current month's days
  const getDaysInCurrentMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  // Initialize state with zeros for current month
  const [series, setSeries] = useState([{
    data: Array(getDaysInCurrentMonth()).fill(0)
  }]);

  useEffect(() => {
    if (userPost?.data) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const daysInMonth = getDaysInCurrentMonth();

      // Create array for all days in current month
      const dates = Array.from({ length: daysInMonth }, (_, i) => {
        return new Date(currentYear, currentMonth, i + 1);
      });

      // Format dates for display
      const formattedDates = dates.map(date => {
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
      });

      // Count posts for each day in current month
      const postCounts = dates.map(date => {
        return userPost.data.filter(post => {
          const postDate = new Date(post.createdAt);
          return postDate.getDate() === date.getDate() &&
            postDate.getMonth() === date.getMonth() &&
            postDate.getFullYear() === date.getFullYear();
        }).length;
      });

      // Update series with actual data
      setSeries([{
        data: postCounts
      }]);

      // Update options with actual dates
      setOptions(prev => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: formattedDates.map(date => [date])
        }
      }));
    }
  }, [userPost?.data]);

  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: 'bar',
      foreColor: skin === 'dark' ? '#fff' : '#000',
      events: {
        click: function (chart, w, e) {
        }
      },
    },
    title: {
      text: intl.formatMessage({ id: 'dashboard.posts_this_month' }),
      align: 'left',
      style: {
        fontSize: '10px',
        fontWeight: 500,
        padding: '10px',
        color: skin === 'dark' ? '#fff' : '#000'
      },
      fontWeight: 'bold',
      margin: 10,
      offsetX: 10,
      offsetY: 15,
    },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: Array(getDaysInCurrentMonth()).fill(['--/--']),
      labels: {
        style: {
          colors: skin === 'dark' ? '#fff' : '#000',
          fontSize: '12px'
        }
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: skin === 'dark' ? '#fff' : '#000',
          fontSize: '12px'
        }
      }
    }
  });

  // Update options when skin changes
  useEffect(() => {
    setOptions(prev => ({
      ...prev,
      chart: {
        ...prev.chart,
        foreColor: skin === 'dark' ? '#fff' : '#000'
      },
      title: {
        ...prev.title,
        style: {
          ...prev.title.style,
          color: skin === 'dark' ? '#fff' : '#000'
        }
      },
      xaxis: {
        ...prev.xaxis,
        labels: {
          style: {
            colors: skin === 'dark' ? '#fff' : '#000',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        ...prev.yaxis,
        labels: {
          style: {
            colors: skin === 'dark' ? '#fff' : '#000',
            fontSize: '12px'
          }
        }
      }
    }));
  }, [skin]);

  return (
    <Card className='card-post-of-month'>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </Card>
  );
}

export default PostOfMonth
// ... existing code ...