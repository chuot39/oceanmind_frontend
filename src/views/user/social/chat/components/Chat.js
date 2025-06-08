import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Input, Avatar, Button, Dropdown, Image, Spin } from 'antd'
import { SendOutlined, SmileOutlined, PaperClipOutlined, PhoneOutlined, VideoCameraOutlined, DeleteOutlined, PushpinOutlined, StopOutlined, DownOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { handleNoticeAction } from '../../../../../utils/Utils'
import { useGetChatMessages, useGetChatByAlias } from '../hook'
import { formatDate, formatDateTime, formatTime } from '../../../../../utils/format/datetime'
import moment from 'moment'
import TextArea from 'antd/es/input/TextArea'
import { getFirstLetter, getGradientColor } from '../../../../../utils/format/formartText'
import { useParams } from 'react-router-dom'
import FriendProfileSidebar from './FriendProfileSidebar'
import Loading from '@/components/loader/Loading'
import EmojiPicker from 'emoji-picker-react'
import { BsEmojiWinkFill } from 'react-icons/bs'
import BtnSend from '@/components/button/action/BtnSend'
import { FaRegTrashAlt } from 'react-icons/fa'
import { useSendTextMessage, useUpdateMessageStatus } from '../mutationHooks'
import { useQueryClient } from 'react-query'
import socket, { startTyping, stopTyping } from '../socket'
import './Chat.css'

const Chat = ({ userData, onShowProfile, skin }) => {
    const { alias } = useParams()
    const queryClient = useQueryClient();
    const chatBodyRef = useRef(null)
    const textAreaRef = useRef(null);
    const messagesEndRef = useRef(null)
    const typingTimeoutRef = useRef(null);
    const lastTypingRef = useRef(0);

    const { data: chat, isLoading: isLoadingChat } = useGetChatByAlias(alias)
    const { data: messages, isLoading, isFetching, hasNextPage, fetchNextPage } = useGetChatMessages(chat?.documentId)

    const { mutate: sendMessage, isLoading: isSending } = useSendTextMessage();
    const { mutate: updateMessageStatus, isLoading: isLoadingUpdateMessageStatus } = useUpdateMessageStatus();

    const [message, setMessage] = useState('')
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
    const [showScrollButton, setShowScrollButton] = useState(false)
    const [showFriendProfile, setShowFriendProfile] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [attachedFiles, setAttachedFiles] = useState([])
    const [typingUsers, setTypingUsers] = useState({}) // { userId: boolean }
    const emojiPickerRef = useRef(null)

    const InfoGroup = useMemo(() => {
        if (!chat || isLoadingChat) return null

        return chat?.name?.length > 0 ? {
            avatar: chat?.name,
            documentId: chat?.documentId,
            fullname: chat?.name,
            status: chat?.name,
            participants: chat?.participants
        } : null
    }, [chat, isLoadingChat])

    const InfoFriend = useMemo(() => {
        if (!chat || isLoadingChat) return null

        return chat?.chatPartner?.documentId === userData?.documentId ? chat?.creator : chat?.chatPartner
    }, [chat, isLoadingChat])

    const menuItems = [
        {
            key: 'pin',
            label: 'Pin to top',
            icon: <PushpinOutlined />
        },
        {
            key: 'delete',
            label: 'Delete chat',
            icon: <DeleteOutlined />
        },
        {
            key: 'block',
            label: 'Block',
            icon: <StopOutlined />
        }
    ]

    const chatMessages = useMemo(() => {
        if (!messages?.pages) return [];
        // Get all messages and sort by creation time
        const allMessages = messages?.pages?.flatMap(page =>
            (page || []).map(msg => ({
                id: msg?.documentId,
                sender: {
                    ...msg?.sender,
                    avatar_url_id: msg?.sender?.avatar_url_id
                },
                content: msg?.content,
                time: formatDate(msg?.createdAt) === formatDate(moment()) ? formatTime(msg?.createdAt) : formatDateTime(msg?.createdAt),
                createdAt: new Date(msg?.createdAt).getTime(),
                type: msg?.sender?.username === userData?.username ? 'sent' : 'received',
                media: msg?.media?.file_path,
                is_content: msg?.content !== null && msg?.content !== '',
                is_group: msg?.conversation?.is_group_chat
            }))
        );

        // Sort messages by creation time (oldest first)
        return allMessages.sort((a, b) => a.createdAt - b.createdAt);
    }, [messages?.pages, userData?.username]);

    const handleScroll = useCallback((e) => {
        const element = e.target;
        const scrollHeight = element.scrollHeight;
        const scrollTop = element.scrollTop;
        const clientHeight = element.clientHeight;

        // Hiển thị nút khi cuộn lên trên 500px
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 500);

        // Kiểm tra nếu đang ở gần top để load thêm tin nhắn
        if (scrollTop < 100 && hasNextPage && !isFetching) {
            setShouldScrollToBottom(false);
            fetchNextPage();
        }
    }, [hasNextPage, isFetching, fetchNextPage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const renderMessage = (msg) => {
        const isSent = msg.type === 'sent'
        const isContent = msg.is_content

        return (
            <div
                key={msg.id}
                className={classNames('chat-message', {
                    'sent': isSent,
                    'received': !isSent,
                })}
            >
                <>
                    {isContent ? (
                        <>
                            {!isSent && msg?.is_group && (
                                <Avatar
                                    src={msg?.sender?.avatar_url_id?.file_path}
                                    size={32}
                                    className="message-avatar"
                                    onClick={onShowProfile}
                                />
                            )}

                            <div className="message-content text-justify">
                                <p>{msg.content}</p>
                                <span className="message-time">{msg.time}</span>
                            </div>
                        </>
                    ) : (
                        <div className="chat-message flex flex-col items-end">
                            <Image className='rounded-lg' src={msg.media} alt="media" />
                            <span className="message-time">{msg.time}</span>
                        </div>
                    )}
                </>
            </div>
        )
    }

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length > 0) {
            // Create preview URLs for the images
            const newAttachedFiles = imageFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file),
                name: file.name,
                size: file.size
            }));

            setAttachedFiles(prev => [...prev, ...newAttachedFiles]);
        }

        // Reset the input value to allow selecting the same file again
        e.target.value = '';
    };

    const removeAttachedFile = (index) => {
        setAttachedFiles(prev => {
            const newFiles = [...prev];
            // Revoke the object URL to avoid memory leaks
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const handleSend = () => {
        if (message.trim() || attachedFiles.length > 0) {
            // Extract just the File objects from attachedFiles
            const files = attachedFiles.map(item => item.file);

            // Send the message using the mutation hook
            sendMessage({
                message: message.trim(),
                files,
                conversationId: chat?.documentId,
                senderId: userData?.documentId,
                receiverUserId: InfoFriend?.documentId
            }, {
                onSuccess: (res) => {
                    // Clear the input and attached files after successful send
                    setMessage('');
                    setAttachedFiles([]);

                    console.log('response send message', res);

                    // Xử lý dữ liệu tin nhắn để gửi qua socket
                    const messagesToSend = [];

                    // Thêm tin nhắn văn bản
                    if (res.responseText && res.responseText.data) {
                        messagesToSend.push(res.responseText.data);
                    }

                    // Thêm tin nhắn hình ảnh
                    if (res.responseImage && res.responseImage.length > 0) {
                        res.responseImage.forEach(img => {
                            if (img && img.data) {
                                messagesToSend.push(img.data);
                            }
                        });
                    }

                    // Gửi tất cả tin nhắn qua socket
                    try {
                        if (!socket.connected) {
                            console.warn('Socket not connected, attempting to connect before sending');
                            socket.connect();
                        }

                        // Gửi tất cả tin nhắn qua socket
                        messagesToSend.forEach(messageToSend => {
                            if (!messageToSend.conversationId) {
                                messageToSend.conversationId = chat.documentId;
                            }

                            console.log('Sending message to socket:', messageToSend);
                            socket.emit('sendMessage', messageToSend);
                        });

                        console.log(`${messagesToSend.length} messages emitted to socket server`);

                        // Ngừng typing status khi gửi tin nhắn
                        stopTyping(chat.documentId, userData?.documentId);
                    } catch (error) {
                        console.error('Error emitting messages to socket:', error);
                    }
                },
                onError: (error) => {
                    console.error('Error sending message:', error);
                }
            });
        }
    };

    const toggleFriendProfile = () => {
        setShowFriendProfile(!showFriendProfile)
        // setShowUserProfile(false)
    }

    const onEmojiClick = (emojiObject) => {
        const textArea = textAreaRef.current?.resizableTextArea?.textArea;
        const currentContent = message || '';
        const currentPosition = textArea ? textArea.selectionStart : currentContent.length;

        const beforeCursor = currentContent.slice(0, currentPosition);
        const afterCursor = currentContent.slice(currentPosition);
        const newContent = beforeCursor + emojiObject.emoji + afterCursor;

        // Update both the form field and our controlled state
        setMessage(newContent);

        // Update cursor position after a small delay
        setTimeout(() => {
            if (textArea) {
                const newPosition = currentPosition + emojiObject.emoji.length;
                textArea.focus();
                textArea.setSelectionRange(newPosition, newPosition);
            }
        }, 50);
    };

    const handleChangeMessage = (e) => {
        const newMessage = e.target.value;
        setMessage(newMessage);

        // Gửi sự kiện typing nếu đang trong một cuộc hội thoại
        if (chat?.documentId && userData?.documentId) {
            // Chỉ gửi sự kiện typing mỗi 1 giây để tránh spam
            const now = Date.now();
            if (now - lastTypingRef.current > 1000) {
                startTyping(chat.documentId, userData.documentId);
                lastTypingRef.current = now;
            }
        }
    };

    const renderTypingIndicator = () => {
        const typingPartner = InfoFriend;
        const isPartnerTyping = typingUsers[typingPartner?.documentId];

        if (isPartnerTyping) {
            return (
                <div className="typing-indicator">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="typing-text">{typingPartner?.fullname} đang nhập...</span>
                </div>
            );
        }

        return null;
    };

    useEffect(() => {
        setShouldScrollToBottom(true)
        scrollToBottom()
        setShowScrollButton(false)
        setTimeout(() => {
            scrollToBottom()
        }, 500)
    }, [chat?.documentId])

    useEffect(() => {
        const container = chatBodyRef.current
        if (container) {
            container.addEventListener('scroll', handleScroll)
            return () => container.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    useEffect(() => {
        if (shouldScrollToBottom) {
            scrollToBottom()
        }
    }, [shouldScrollToBottom])

    // Add effect to scroll to bottom when messages are first loaded
    useEffect(() => {
        if (!isLoading && messages?.pages?.length === 1) { // Only scroll on initial load
            const container = chatBodyRef.current;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }, [isLoading, messages?.pages]);

    // Add this new useEffect to handle clicking outside the emoji picker
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (chat?.unreadMessages?.length > 0) {
            // Only update messages that haven't been processed yet
            // Use a ref to track which messages have been processed
            const unreadMessages = chat?.unreadMessages;

            // Process messages in a batch instead of one by one
            const messageStatusUpdates = unreadMessages.map(message => ({
                messageId: message?.message_statuses?.[0]?.documentId,
                status: true
            }));

            // Update all messages at once
            if (messageStatusUpdates.length > 0) {
                // Use Promise.all to update all messages in parallel
                Promise.all(
                    messageStatusUpdates.map(update =>
                        updateMessageStatus(update, {
                            // Don't trigger multiple query invalidations for each message
                            onSuccess: () => { }
                        })
                    )
                ).then(() => {
                    // Invalidate queries only once after all updates are done
                    queryClient.invalidateQueries(['chat-friends']);
                    queryClient.invalidateQueries(['chat-by-alias']);
                });
            }
        }
    }, [chat?.documentId, chat?.unreadMessages]);

    // Join room khi mở đoạn chat
    useEffect(() => {
        if (chat?.documentId) {
            socket.emit('joinRoom', chat?.documentId)
        }
    }, [chat?.documentId])

    // Nhận tin nhắn realtime và cập nhật typing status
    useEffect(() => {
        if (!chat?.documentId) return;

        // Thiết lập một buffer để gom nhóm các tin nhắn được nhận gần nhau
        const messageBuffer = [];
        let bufferTimeout = null;

        // Hàm xử lý tin nhắn trong buffer
        const processMessageBuffer = () => {
            if (messageBuffer.length === 0) return;

            console.log(`Processing ${messageBuffer.length} buffered messages`);

            // Cập nhật cache một lần cho tất cả tin nhắn
            queryClient.setQueryData(['chat-messages', chat?.documentId], (oldData) => {
                if (!oldData) return oldData;

                // Tạo bản copy của oldData
                const newData = JSON.parse(JSON.stringify(oldData));

                // Thêm tất cả tin nhắn mới vào trang cuối cùng
                if (newData.pages && newData.pages.length > 0) {
                    const lastPage = newData.pages[newData.pages.length - 1];

                    messageBuffer.forEach(newMessage => {
                        // Kiểm tra xem tin nhắn đã tồn tại chưa để tránh trùng lặp
                        const messageExists = lastPage.some(msg =>
                            msg.documentId === newMessage.documentId ||
                            (msg.content === newMessage.content &&
                                msg.sender?.documentId === newMessage.sender?.documentId &&
                                msg.media?.file_path === newMessage.media?.file_path &&
                                Math.abs(new Date(msg.createdAt) - new Date(newMessage.createdAt)) < 5000)
                        );

                        if (!messageExists) {
                            lastPage.push(newMessage);

                            // Nếu người dùng hiện tại không phải người gửi, cập nhật trạng thái đã đọc
                            if (newMessage.sender?.documentId !== userData?.documentId &&
                                newMessage.message_statuses &&
                                newMessage.message_statuses.length > 0) {
                                updateMessageStatus({
                                    messageId: newMessage.message_statuses[0].documentId,
                                    status: true
                                });
                            }
                        }
                    });
                }

                return newData;
            });

            // Cuộn xuống dưới khi nhận tin nhắn mới
            setShouldScrollToBottom(true);

            // Xóa buffer sau khi xử lý
            messageBuffer.length = 0;
        };

        socket.on('receiveMessage', (newMessage) => {
            console.log('📥 Message received in realtime:', newMessage);

            // Thêm tin nhắn vào buffer
            messageBuffer.push(newMessage);

            // Xóa timeout cũ nếu có
            if (bufferTimeout) {
                clearTimeout(bufferTimeout);
            }

            // Thiết lập timeout mới để gom nhóm các tin nhắn đến gần nhau
            bufferTimeout = setTimeout(() => {
                processMessageBuffer();
                bufferTimeout = null;
            }, 300); // Đợi 300ms để gom nhóm các tin nhắn
        });

        // Lắng nghe sự kiện typing
        socket.on('typing', (data) => {
            console.log('Typing event received:', data);
            if (data.conversationId === chat?.documentId && data.userId !== userData?.documentId) {
                setTypingUsers(prev => ({
                    ...prev,
                    [data.userId]: data.isTyping
                }));
            }
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('typing');
            // Xử lý buffer nếu còn tin nhắn khi unmount
            if (bufferTimeout) {
                clearTimeout(bufferTimeout);
                processMessageBuffer();
            }
        };
    }, [chat?.documentId, userData?.documentId]);

    return (
        <>
            <div className="chat-content h-full flex flex-col">
                <div className="chat-header">
                    <div className="chat-header-user" onClick={toggleFriendProfile}>
                        {isLoadingChat ? (<Loading />) :
                            (
                                InfoGroup?.documentId ? (
                                    <Avatar
                                        style={{
                                            background: getGradientColor(getFirstLetter(InfoGroup?.fullname)),
                                            verticalAlign: 'middle',
                                            color: '#fff'
                                        }}
                                        size="large"
                                        loading={isLoadingChat}
                                    >
                                        {getFirstLetter(InfoGroup?.fullname)}
                                    </Avatar>
                                ) : (
                                    <Avatar src={InfoFriend?.avatar?.file_path} size={40} loading={isLoadingChat || true} />
                                )
                            )
                        }

                        {/* <Avatar src={chat?.chatPartner.avatar} size={40} /> */}
                        <div className="chat-header-info">
                            <h4 className='text-lg text_first'>{InfoGroup?.documentId ? InfoGroup?.fullname : InfoFriend?.fullname}</h4>
                            <p className='text-sm text_secondary'>{InfoGroup?.documentId ? InfoGroup?.participants?.length + ' members' : InfoFriend?.isOnline}</p>
                        </div>
                    </div>
                    <div className="chat-header-actions">
                        <Button type="text" icon={<PhoneOutlined />} onClick={() => handleNoticeAction({ message: 'Calling to...', action: InfoFriend?.fullname, skin })} />
                        <Button type="text" icon={<VideoCameraOutlined />} onClick={() => handleNoticeAction({ message: 'Calling Video to...', action: InfoFriend?.fullname, skin })} />
                        <Dropdown
                            menu={{ items: menuItems }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button className='text-2xl ' type="text">⋮</Button>
                        </Dropdown>
                    </div>
                </div>

                <div className="chat-body relative" ref={chatBodyRef}>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <div className="messages-container">
                            {isFetching && (
                                <div className="flex justify-center p-2">
                                    <Spin size="small" />
                                </div>
                            )}
                            {chatMessages?.map(renderMessage)}
                            {renderTypingIndicator()}
                            <div ref={messagesEndRef} />
                        </div>
                    )}

                    {/* Scroll to bottom button */}
                    {showScrollButton && (
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<DownOutlined />}
                            className="scroll-to-bottom-btn"
                            onClick={() => {
                                setShouldScrollToBottom(true)
                                scrollToBottom()
                            }}
                        />
                    )}
                </div>

                <div className="chat-footer">
                    <div className="chat-input-container">
                        {attachedFiles.length > 0 && (
                            <div className="attached-files-preview">
                                {attachedFiles.map((file, index) => (
                                    <div key={index} className="attached-file">
                                        <img src={file.preview} alt={file.name} className="file-preview" />
                                        <Button
                                            type="text"
                                            className="remove-file-btn"
                                            icon={<FaRegTrashAlt />}
                                            onClick={() => removeAttachedFile(index)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="input-row">
                            {showEmojiPicker && (
                                <div className="emoji-picker-container w-fit" ref={emojiPickerRef}>
                                    <div className="shadow-lg rounded-lg" onClick={(e) => e.stopPropagation()}>
                                        <EmojiPicker
                                            onEmojiClick={onEmojiClick}
                                            width={320}
                                            height={400}
                                            searchDisabled={false}
                                            skinTonesDisabled={true}
                                            lazyLoadEmojis={true}
                                            previewConfig={{
                                                showPreview: false
                                            }}
                                            theme={skin === 'dark' ? 'dark' : 'light'}
                                        />
                                    </div>
                                </div>
                            )}
                            <TextArea
                                ref={textAreaRef}
                                className="chat-textarea"
                                placeholder="Type your message here..."
                                value={message}
                                onChange={handleChangeMessage}
                                onPressEnter={(e) => {
                                    if (!e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                onBlur={() => {
                                    if (chat?.documentId && userData?.documentId) {
                                        stopTyping(chat.documentId, userData.documentId);
                                    }
                                }}
                                autoSize={{
                                    minRows: 1,
                                    maxRows: 4,
                                }}
                            />
                            <div className="chat-actions">
                                <Button
                                    type="text"
                                    className="emoji-button"
                                    icon={<BsEmojiWinkFill className="!text-yellow-300 text-xl" />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowEmojiPicker(!showEmojiPicker);
                                    }}
                                />
                                <Button
                                    type="text"
                                    className="attachment-btn"
                                    icon={<PaperClipOutlined className='!text-xl' />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        document.getElementById('file-upload').click();
                                    }}
                                />
                                <input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                />
                                <Button
                                    className='btn-send'
                                    type="primary"
                                    icon={<BtnSend />}
                                    onClick={handleSend}
                                    disabled={!message.trim() && attachedFiles.length === 0}
                                    loading={isSending}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FriendProfileSidebar
                visible={showFriendProfile}
                onClose={toggleFriendProfile}
                userData={userData}
                skin={skin}
                friendData={InfoFriend}
            />
        </>
    )
}

export default Chat 