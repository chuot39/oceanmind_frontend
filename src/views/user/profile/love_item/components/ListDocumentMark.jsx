import React, { useState } from 'react';
import { Input, Button, Empty, Row, Col } from 'antd';
import Hamster from '@/components/loader/Hamster/Hamster';
import DocumentCard from '@/views/user/learning/document/components/DocumentCard';
import DocumentListItem from '@/views/user/learning/document/components/DocumentListItem';
import DocumentDetailModal from '@/views/user/learning/document/components/DocumentDetailModal';
import { useDocument, useDocumentBookmarked } from '@/views/user/learning/document/hook';

const { Search } = Input;

const ListDocumentMark = ({ userData }) => {
    const [viewMode, setViewMode] = useState('grid');
    const [searchText, setSearchText] = useState('');
    const [selectedDocument, setSelectedDocument] = useState(null);
    // const { status: statusMarkDocument, data: markDocument } = useDocumentBookmarked(userData?.documentId);
    const { data: documents, status: documentStatus, fetchNextPage, hasNextPage, isFetchingNextPage, refetch: refetchDocuments } = useDocument(userData?.documentId);
    const { data: documentsBookmarked, status: documentBookmarkedStatus, refetch: refetchDocumentsBookmarked } = useDocumentBookmarked(userData?.documentId);

    const allDocuments = documents?.pages?.flatMap(page => page?.data) || [];

    const filteredDocuments = allDocuments?.filter(doc => {
        // Text search filter
        const matchesSearch = doc?.title?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
            doc?.description?.toLowerCase()?.includes(searchText?.toLowerCase());

        // // Date filter
        // const matchesDate = !dateRange || !dateRange[0] || !dateRange[1] ||
        //     (new Date(doc?.createdAt) >= dateRange[0] && new Date(doc?.createdAt) <= dateRange[1]);

        // Bookmarked filter
        const matchesBookmarked = documentsBookmarked?.data?.some(bookmarked => bookmarked?.document_share_id === doc?.documentId);

        return matchesSearch && matchesBookmarked;
    });

    const handleViewDetail = (document) => {
        setSelectedDocument(document);
    };
    const handleCloseModal = () => {
        setSelectedDocument(null);
    };
    return (
        <div>
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
                                    {filteredDocuments?.map(document => (
                                        <DocumentListItem
                                            key={document.documentId}
                                            document={document}
                                            onViewDetail={() => handleViewDetail(document)}
                                        />
                                    ))}
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
            />
        </div>
    );
};

export default ListDocumentMark; 