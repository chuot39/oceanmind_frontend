import { useState, useMemo, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useIntl } from "react-intl";
import useSkin from "../../utils/hooks/useSkin";

const SimplePieChart = ({ gradeA, gradeB, gradeC, gradeD, gradeF }) => {
    const intl = useIntl();
    const { skin } = useSkin()
    const [series, setSeries] = useState([0, 0, 0, 0, 0]);

    useEffect(() => {
        setSeries([gradeA || 0, gradeB || 0, gradeC || 0, gradeD || 0, gradeF || 0]);
    }, [gradeA, gradeB, gradeC, gradeD, gradeF]);

    const options = useMemo(() => ({
        chart: {
            width: 380,
            type: 'pie',
            foreColor: skin === 'dark' ? '#fff' : '#000',
        },
        colors: ['#18A34A', '#21D3EE', '#A5B4FC', '#D87708', '#DD2626'],
        labels: [
            intl.formatMessage({ id: 'dashboard.training_process.grade_a' }),
            intl.formatMessage({ id: 'dashboard.training_process.grade_b' }),
            intl.formatMessage({ id: 'dashboard.training_process.grade_c' }),
            intl.formatMessage({ id: 'dashboard.training_process.grade_d' }),
            intl.formatMessage({ id: 'dashboard.training_process.grade_f' })
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
        <div id="chart" className="pe-5">
            <ReactApexChart
                options={options}
                series={series}
                type="pie"
                width={400}
            />
        </div>
    );
}

export default SimplePieChart;