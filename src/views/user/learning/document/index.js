import React, { useState } from 'react';
import { Card, Input, Row, Col, Empty, Image, List } from 'antd';
import { BsSearch } from 'react-icons/bs';
import DocumentCard from './components/DocumentCard';
import DocumentListItem from './components/DocumentListItem';
import DocumentFilter from './components/DocumentFilter';
import DocumentDetailModal from './components/DocumentDetailModal';
import '../../../../core/scss/styles/pages/learning/index.scss';
import { useUserData } from '../../../../utils/hooks/useAuth';
import { useDocument, useDocumentBookmarked } from './hook';
import Hamster from '../../../../components/loader/Hamster/Hamster';
import light from '../../../../assets/images/pages/light.png'
import pen from '../../../../assets/images/pages/pen.png'
import { FormattedMessage, useIntl } from 'react-intl';

const { Search } = Input;

const DocumentPage = () => {
    const intl = useIntl();
    const { userData } = useUserData();
    const { data: documents, status: documentStatus, fetchNextPage, hasNextPage, isFetchingNextPage, refetch: refetchDocuments } = useDocument(userData?.documentId);
    const { data: documentsBookmarked, status: documentBookmarkedStatus, refetch: refetchDocumentsBookmarked } = useDocumentBookmarked(userData?.documentId);


    const [viewMode, setViewMode] = useState('grid');
    const [searchText, setSearchText] = useState('');
    const [selectedDocument, setSelectedDocument] = useState(null);

    // Updated filter states
    const [selectedType, setSelectedType] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);


    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleViewDetail = (document) => {
        setSelectedDocument(document);
    };

    const handleCloseModal = () => {
        setSelectedDocument(null);
    };

    const handleClearFilters = () => {
        setSelectedType('all');
        setSelectedUsers([]);
        setDateRange(null);
        setShowBookmarkedOnly(false);
    };

    const handleTypeChange = (values) => {
        setSelectedType(values?.length > 0 ? values : 'all');
    };

    const handleUserChange = (values) => {
        setSelectedUsers(values);
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const handleBookmarkedChange = (checked) => {
        setShowBookmarkedOnly(checked);
    };

    const allDocuments = documents?.pages?.flatMap(page => page?.data) || [];
    // Enhanced filter logic for documents
    const filteredDocuments = allDocuments?.filter(doc => {
        // Text search filter
        const matchesSearch = doc?.title?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
            doc?.description?.toLowerCase()?.includes(searchText?.toLowerCase());

        // Document type filter - supports multiple selection
        const matchesType = selectedType === 'all' ||
            selectedType.length === 0 ||
            (Array.isArray(selectedType) && selectedType.some(type =>
                doc?.tags?.some(tag =>
                    tag?.documentId === type?.documentId)
            ));

        // User filter
        const matchesUser = selectedUsers.length === 0 ||
            selectedUsers.some(selectedUser =>
                selectedUser.documentId === doc?.creator?.documentId ||
                selectedUser.username === doc?.creator?.username
            );

        // Date filter
        const matchesDate = !dateRange || !dateRange[0] || !dateRange[1] ||
            (new Date(doc?.createdAt) >= dateRange[0] && new Date(doc?.createdAt) <= dateRange[1]);

        // Bookmarked filter
        const matchesBookmarked = !showBookmarkedOnly || documentsBookmarked?.data?.some(bookmarked => bookmarked?.document_share_id === doc?.documentId);

        return matchesSearch && matchesType && matchesUser && matchesDate && matchesBookmarked;
    });

    return (
        <div className="p-6 document-page">
            <Card className="mb-6 search-card">
                <div className='flex gap-2 items-center'>
                    <img
                        src={light}
                        alt="pen"
                        className='h-36 p-4 w-36'
                    />
                    <h2 className="text-2xl text-center font-bold mb-4 pe-24 ps-6"><FormattedMessage id="learning.document.title_search" /></h2>
                </div>
                <p className="text-center text-xl mb-4 px-32">
                    <FormattedMessage id="learning.document.description_search" />
                </p>
                <div className='flex justify-center items-center search_container'>

                    <Search
                        placeholder={intl.formatMessage({ id: 'learning.document.placeholder_search' })}
                        allowClear
                        enterButton={<BsSearch />}
                        size="large"
                        onSearch={handleSearch}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Image src={pen} preview={false} alt="light" className='image_pen' />
                </div>
            </Card>

            <DocumentFilter
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                selectedType={selectedType}
                selectedUsers={selectedUsers}
                dateRange={dateRange}
                showBookmarkedOnly={showBookmarkedOnly}
                onTypeChange={handleTypeChange}
                onUserChange={handleUserChange}
                onDateRangeChange={handleDateRangeChange}
                onBookmarkedChange={handleBookmarkedChange}
                onClearFilters={handleClearFilters}
                onCloseDetailModel={handleCloseModal}
            />

            <>
                {documentStatus === 'loading' ?
                    <div className='flex h-[30vh] justify-center items-center'>
                        <Hamster />
                    </div>
                    :
                    <>
                        {filteredDocuments?.length > 0 ? (
                            viewMode === 'grid' ? (
                                <Row gutter={[24, 24]}>
                                    {filteredDocuments?.map(document => (
                                        <Col xs={24} sm={24} md={12} lg={8} key={document.documentId}>
                                            <DocumentCard
                                                document={document}
                                                onViewDetail={() => handleViewDetail(document)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <List
                                        className=''
                                        dataSource={filteredDocuments}
                                        renderItem={document => (
                                            <DocumentListItem
                                                key={document.documentId}
                                                document={document}
                                                onViewDetail={() => handleViewDetail(document)}
                                            />
                                        )}
                                    />
                                </div>
                            )
                        ) : (
                            <Empty
                                description="Không tìm thấy tài liệu nào"
                                className="my-8"
                            />
                        )}
                    </>
                }
            </>

            <DocumentDetailModal
                visible={!!selectedDocument}
                document={selectedDocument}
                onClose={handleCloseModal}
                refetchDocuments={refetchDocuments}
            />
        </div>
    );
};

export default DocumentPage;