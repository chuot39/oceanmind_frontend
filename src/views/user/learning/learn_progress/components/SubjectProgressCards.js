import React from 'react';
import { Card } from 'antd';
import { BsPersonRunning, BsTranslate, BsCodeSlash, BsCheckCircle, BsBook, BsBriefcase } from 'react-icons/bs';

const SubjectProgressCards = () => {

    const subjects = [
        {
            title: 'Thể Chất',
            completed: 5,
            total: 5,
            icon: <BsPersonRunning />,
            color: 'cyan'
        },
        {
            title: 'Tiếng Anh',
            completed: 4,
            total: 4,
            icon: <BsTranslate />,
            color: 'red'
        },
        {
            title: 'Chuyên Ngành',
            completed: 25,
            total: 28,
            icon: <BsCodeSlash />,
            color: 'purple'
        },
        {
            title: 'Đại Cương',
            completed: 21,
            total: 21,
            icon: <BsBook />,
            color: 'orange'
        },
        {
            title: 'Tự Chọn',
            completed: 3,
            total: 3,
            icon: <BsCheckCircle />,
            color: 'green'
        },
        {
            title: 'Thực Tập',
            completed: 0,
            total: 1,
            icon: <BsBriefcase />,
            color: 'blue'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {subjects.map((subject, index) => (
                <Card key={index} className="subject-progress-card">
                    <div className="flex items-center gap-4">
                        <div className={`icon-wrapper bg-${subject.color}-100 text-${subject.color}-500`}>
                            {subject.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-medium mb-1">{subject.title}</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-primary">
                                    {subject.completed}/{subject.total}
                                </span>
                                <div className="progress-bar">
                                    <div
                                        className={`progress bg-${subject.color}-500`}
                                        style={{
                                            width: `${(subject.completed / subject.total) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default SubjectProgressCards; 