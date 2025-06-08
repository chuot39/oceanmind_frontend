import React, { useState } from 'react';
import SearchSection from './components/SearchSection';
import Sidebar from './components/Sidebar';
import ContentSection from './components/ContentSection';
import DiscussionCards from './components/DiscussionCards';
import ContactForm from './components/ContactForm';
import "../../../../core/scss/styles/pages/support/index.scss";
import { useIntl } from 'react-intl';
import GuideSearchSection from './components/GuideSearchSection';
import { Alert } from 'antd';
import Marquee from 'react-fast-marquee';

const Guide = () => {

    const intl = useIntl();
    const [activeSection, setActiveSection] = useState({
        id: 'discussion',
        title: 'Thảo luận',
        description: 'Các câu hỏi về thảo luận'
    });

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="space-y-8 mb-10">
            <Alert
                banner
                type="info"
                showIcon
                message={
                    <Marquee speed={60} pauseOnHover gradient={false}>
                        This feature is under development, please wait for the next update! We will notify you when it is ready.🥰🥰🥰
                    </Marquee>
                }
                className="mb-6 rounded-lg text-lg"
            />
            <SearchSection intl={intl} />
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-64 flex-shrink-0">
                    <Sidebar
                        activeSection={activeSection}
                        onSectionChange={handleSectionChange}
                    />
                </div>
                <div className="flex-1 space-y-8">
                    <ContentSection activeSection={activeSection} />
                </div>
            </div>


            <div className="!mt-16">
                <GuideSearchSection intl={intl} />
                <DiscussionCards />
            </div>

            {/* <div> */}
            <ContactForm />
            {/* </div> */}


        </div>
    );
};

export default Guide;