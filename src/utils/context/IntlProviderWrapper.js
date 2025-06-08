import React from "react";
import { IntlProvider } from "react-intl";
import LanguageUtils from "../LanguageUtils";
import useSkin from "../hooks/useSkin";


const messages = LanguageUtils.getFlattenedMessages();

const IntlProviderWrapper = (props) => {
    const { language } = useSkin()
    return (
        <IntlProvider
            locale={language}
            messages={messages[language]}
            defaultLocale="vi">
            {props.children}
        </IntlProvider>
    );
}

export default IntlProviderWrapper
