import React from 'react';
import { Card, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
// import { BsSearch } from 'react-icons/bs';

// const { Search } = Input;

const SearchSection = ({ intl }) => {
    return (
        <Card className="text-center mb-8 card_search">
            <h1 className="text-2xl font-semibold my-2"><FormattedMessage id="support.search.title" /></h1>
            <p className="px-24 text-base my-3 text_secondary"><FormattedMessage id="support.search.description" /></p>
            <div className="max-w-xl mx-auto">
                <Input
                    size="large"
                    placeholder={intl.formatMessage({ id: "support.search.placeholder" })}
                    prefix={<SearchOutlined className="text-gray-400" />}
                    className="rounded-md my-8"
                />

                {/* <Search
                    placeholder={intl.formatMessage({ id: 'learning.document.placeholder_search' })}
                    allowClear
                    enterButton={<BsSearch />}
                    size="large"
                    // onSearch={handleSearch}
                    onChange={(e) => setSearchText(e.target.value)}
                /> */}
            </div>
        </Card>
    );
};

export default SearchSection; 