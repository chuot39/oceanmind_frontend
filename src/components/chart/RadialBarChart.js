import { useState, useMemo, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useIntl } from "react-intl";
import useSkin from "../../utils/hooks/useSkin";

const RadialBarChart = ({ taskCompleted, taskIncompleted, taskOverdue }) => {
    const intl = useIntl();
    const { skin } = useSkin()
    const [series, setSeries] = useState([0, 0, 0]); // Initialize with default values

    useEffect(() => {
        setSeries([
            taskCompleted || 0,
            taskIncompleted || 0,
            taskOverdue || 0
        ]);
    }, [taskCompleted, taskIncompleted, taskOverdue]);

    const options = useMemo(() => ({
        chart: {
            width: 400,
            type: 'pie',
            foreColor: skin === 'dark' ? '#fff' : '#000',
            background: skin === 'dark' ? '#283046' : '#fff',
        },
        colors: ['#18A34A', '#D87708', '#DD2626'],
        labels: [
            intl.formatMessage({ id: 'dashboard.my_tasks.completed' }),
            intl.formatMessage({ id: 'dashboard.my_tasks.in_progress' }),
            intl.formatMessage({ id: 'dashboard.my_tasks.overdue' }),
        ],
        legend: {
            fontSize: '14px',
            labels: {
                colors: skin === 'dark' ? '#fff' : '#000',
            },
            markers: {
                strokeColor: skin === 'dark' ? '#283046' : '#fff',
            },

        },
        plotOptions: {
            radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 270,
                hollow: {
                    margin: 5,
                    size: '30%',
                    background: 'transparent',
                    image: undefined,
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        show: false,
                    }
                },
                barLabels: {
                    enabled: true,
                    useSeriesColors: true,
                    offsetX: -8,
                    fontSize: '16px',
                    formatter: function (seriesName, opts) {
                        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
                    },
                },
            }
        },
        tooltip: {
            theme: skin === 'dark' ? 'dark' : 'light'
        },
        stroke: {
            colors: [skin === 'dark' ? '#283046' : '#fff']
        },
        responsive: [{
            breakpoint: 580,
            options: {
                chart: {
                    width: 250
                },
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    fontSize: '14px',
                    markers: {
                        width: 12,
                        height: 12,
                        strokeWidth: 0,
                        radius: 12
                    }
                }
            }
        }]
    }), [intl, skin]);

    return (
        <div id="chart">
            <ReactApexChart
                options={options}
                series={series}
                type="radialBar"
                width={400}
            />
        </div>
    );
}

export default RadialBarChart;