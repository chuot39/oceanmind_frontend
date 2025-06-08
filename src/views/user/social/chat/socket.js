import { SOCKET_URL } from "@/constants"
import { io } from "socket.io-client"
import { toast } from 'react-toastify';
import { NOTIFICATION_EVENT } from '@/views/user/stores/actions/friendActions';

// Khởi tạo socket và biến lưu trữ
let socket;
const notificationCallbacks = [];
const typingTimeout = {};

/**
 * Khởi tạo kết nối socket và thiết lập các listeners
 * @returns {Socket} Instance socket đã được cấu hình
 */
const initSocket = () => {
    // Đóng kết nối cũ nếu có
    if (socket && socket.connected) {
        socket.disconnect();
    }

    // Tạo kết nối mới
    socket = io(SOCKET_URL, {
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 10000,
        transports: ['polling', 'websocket'],
        autoConnect: true,
        reconnection: true
    });

    // Xử lý các sự kiện cơ bản
    setupBasicEvents();

    // Xử lý các sự kiện thông báo
    setupNotificationEvents();

    return socket;
};

/**
 * Thiết lập các sự kiện cơ bản cho socket
 */
const setupBasicEvents = () => {
    // Sự kiện kết nối
    socket.on('connect', () => {
        console.log('🔌 Socket connected with ID:', socket.id);
        rejoinRooms();
    });

    // Sự kiện lỗi kết nối
    socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
        setTimeout(() => {
            if (!socket.connected) socket.connect();
        }, 5000);
    });

    // Sự kiện ngắt kết nối
    socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect' || reason === 'transport close') {
            setTimeout(() => socket.connect(), 1000);
        }
    });

    // Theo dõi xác nhận tham gia room
    socket.on('roomJoined', (data) => {
        console.log('Room joined:', data);
    });
};

/**
 * Tham gia lại các room sau khi kết nối lại
 */
const rejoinRooms = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData?.documentId) {
        joinNotificationRoom(userData.documentId);
    }
};

/**
 * Thiết lập các sự kiện thông báo cho socket
 */
const setupNotificationEvents = () => {
    // Lắng nghe sự kiện thông báo
    socket.on('notification', (payload) => handleNotification(payload));

    // Lắng nghe sự kiện thông báo trực tiếp (dự phòng)
    socket.on('directNotification', (payload) => handleNotification(payload));
};

/**
 * Xử lý dữ liệu thông báo nhận được từ server
 * @param {Object} payload Dữ liệu thông báo
 */
const handleNotification = (payload) => {
    try {
        if (!payload) return;
        console.log('🔔 Notification received:', payload);

        // Trích xuất thông tin notification và recipientId
        const { notification, recipientId } = extractNotificationData(payload);
        if (!notification) return;

        // Kiểm tra và xử lý thông báo cho người dùng hiện tại
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const currentUserId = userData?.documentId || '';

        if (shouldProcessNotification(currentUserId, recipientId)) {
            // Phát sự kiện để thông báo cho các components
            dispatchNotificationEvents({
                notification,
                recipientId: recipientId || currentUserId,
                timestamp: new Date().toISOString()
            });

            // Hiển thị toast nếu là thông báo kết bạn
            displayToastIfNeeded(notification);

            // Gọi các callbacks đã đăng ký
            notifyCallbacks(payload);
        }
    } catch (error) {
        console.error('Error processing notification:', error);
    }
};

/**
 * Trích xuất dữ liệu thông báo từ payload
 * @param {Object} payload Dữ liệu thông báo
 * @returns {Object} Dữ liệu đã xử lý
 */
const extractNotificationData = (payload) => {
    let notification, recipientId;

    if (payload.notification) {
        notification = payload.notification;
        recipientId = payload.recipientId;
    } else if (payload.id || payload.documentId || payload.title) {
        notification = payload;
    } else {
        console.error('Invalid notification structure:', payload);
        return {};
    }

    return { notification, recipientId };
};

/**
 * Kiểm tra xem có nên xử lý thông báo cho người dùng hiện tại không
 * @param {string} currentUserId ID người dùng hiện tại
 * @param {string} recipientId ID người nhận thông báo
 * @returns {boolean} Kết quả kiểm tra
 */
const shouldProcessNotification = (currentUserId, recipientId) => {
    return !recipientId || String(currentUserId).trim() === String(recipientId).trim();
};

/**
 * Hiển thị toast thông báo nếu là thông báo kết bạn
 * @param {Object} notification Thông báo cần hiển thị
 */
const displayToastIfNeeded = (notification) => {
    // Kiểm tra loại thông báo (kết bạn)
    const isFriendRequest =
        notification.title?.includes("Friend Request") ||
        notification.content?.includes("friend request") ||
        notification.status === 'pending' ||
        notification.status === 'accepted' ||
        notification.noticeType?.name_en === "Friend Request";

    if (isFriendRequest) {
        const title = notification.title || 'Thông báo mới';
        const content = notification.content || 'Bạn có thông báo mới';
        const notificationId = notification.id || notification.documentId;

        // Hiển thị toast với ID cố định để tránh hiển thị trùng lặp
        toast.success(`${title}: ${content}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            toastId: `notification-${notificationId}`,
            style: { zIndex: 9999 }
        });
    }
};

/**
 * Gọi các callbacks đã đăng ký để xử lý thông báo
 * @param {Object} payload Dữ liệu thông báo
 */
const notifyCallbacks = (payload) => {
    notificationCallbacks.forEach(callback => {
        try {
            callback(payload);
        } catch (error) {
            console.error('Notification callback error:', error);
        }
    });
};

/**
 * Phát sự kiện thông báo cho các components
 * @param {Object} eventData Dữ liệu sự kiện
 */
const dispatchNotificationEvents = (eventData) => {
    try {
        // Tạo chi tiết sự kiện
        const eventDetail = { detail: eventData };

        // Phát sự kiện NOTIFICATION_EVENT
        window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT, eventDetail));
    } catch (err) {
        console.error('Event dispatch error:', err);
    }
};

/**
 * Đảm bảo socket đã kết nối
 * @returns {boolean} Trạng thái kết nối sau khi kiểm tra
 */
const ensureSocketConnected = () => {
    if (!socket || !socket.connected) {
        socket = initSocket();
        return false;
    }
    return true;
};

/**
 * Kiểm tra trạng thái kết nối socket
 * @returns {boolean} trạng thái kết nối
 */
const isSocketConnected = () => {
    return socket && socket.connected;
};

/**
 * Gửi trạng thái typing đến server
 * @param {string} conversationId ID của cuộc trò chuyện
 * @param {string} userId ID của người dùng
 * @param {boolean} isTyping Trạng thái typing
 */
const sendTypingStatus = (conversationId, userId, isTyping) => {
    if (!conversationId || !userId) return;

    if (!ensureSocketConnected()) {
        setTimeout(() => sendTypingStatus(conversationId, userId, isTyping), 1000);
        return;
    }

    socket.emit("typing", { conversationId, userId, isTyping });
};

/**
 * Bắt đầu trạng thái typing
 * @param {string} conversationId ID của cuộc trò chuyện
 * @param {string} userId ID của người dùng
 */
const startTyping = (conversationId, userId) => {
    if (!conversationId || !userId) return;

    // Gửi sự kiện đang typing
    sendTypingStatus(conversationId, userId, true);

    // Clear timeout hiện tại nếu có
    if (typingTimeout[conversationId]) {
        clearTimeout(typingTimeout[conversationId]);
    }

    // Tự động ngừng typing sau 3 giây
    typingTimeout[conversationId] = setTimeout(() => {
        sendTypingStatus(conversationId, userId, false);
        typingTimeout[conversationId] = null;
    }, 3000);
};

/**
 * Dừng trạng thái typing
 * @param {string} conversationId ID của cuộc trò chuyện
 * @param {string} userId ID của người dùng
 */
const stopTyping = (conversationId, userId) => {
    if (!conversationId || !userId) return;

    if (typingTimeout[conversationId]) {
        clearTimeout(typingTimeout[conversationId]);
        typingTimeout[conversationId] = null;
    }

    sendTypingStatus(conversationId, userId, false);
};

/**
 * Gửi thông báo qua socket
 * @param {string} recipientId ID người nhận thông báo
 * @param {object} notification Đối tượng thông báo
 */
const sendNotification = (recipientId, notification) => {
    if (!recipientId || !notification) {
        console.error('Invalid parameters for sendNotification');
        return;
    }

    if (!ensureSocketConnected()) {
        setTimeout(() => sendNotification(recipientId, notification), 1000);
        return;
    }

    // Chuẩn hóa thông tin thông báo
    const notificationObj = {
        ...notification,
        noticeType: notification.noticeType || { name_en: "Friend Request" },
        title: notification.title?.trim() || "Friend Request",
        content: notification.content?.trim() || "You have a new friend request"
    };

    // Gửi thông báo
    emitNotification(recipientId, notificationObj);

    // Phát sự kiện window
    dispatchNotificationEvents({
        notification: notificationObj,
        recipientId,
        timestamp: new Date().toISOString()
    });
};

/**
 * Thực hiện emit sự kiện notification qua socket
 * @param {string} recipientId ID người nhận thông báo
 * @param {object} notification Đối tượng thông báo
 */
const emitNotification = (recipientId, notification) => {
    // Chuẩn hóa ID
    const notificationId = notification.id || notification.documentId || Date.now().toString();

    const data = {
        recipientId,
        notification: {
            ...notification,
            id: notificationId,
            documentId: notificationId
        }
    };

    socket.emit("notification", data);
};

/**
 * Đăng ký lắng nghe thông báo
 * @param {function} callback Hàm xử lý khi nhận được thông báo
 * @returns {function} Hàm để hủy đăng ký
 */
const addNotificationListener = (callback) => {
    if (typeof callback !== 'function') {
        console.error('addNotificationListener requires a function callback');
        return;
    }

    notificationCallbacks.push(callback);
    return () => removeNotificationListener(callback);
};

/**
 * Hủy đăng ký lắng nghe thông báo
 * @param {function} callback Hàm callback đã đăng ký trước đó
 */
const removeNotificationListener = (callback) => {
    const index = notificationCallbacks.indexOf(callback);
    if (index !== -1) {
        notificationCallbacks.splice(index, 1);
    }
};

/**
 * Tham gia vào room để nhận thông báo
 * @param {string} userId ID của người dùng
 */
const joinNotificationRoom = (userId) => {
    if (!userId) return;

    if (!ensureSocketConnected()) {
        setTimeout(() => joinNotificationRoom(userId), 1000);
        return;
    }

    // Format chuẩn cho room name
    const roomName = `user:${userId}`;

    // Tham gia phòng
    socket.emit('joinRoom', { userId, roomName });
};

// Khởi tạo socket
socket = initSocket();

// Export các hàm cần thiết
export {
    startTyping,
    stopTyping,
    isSocketConnected,
    sendNotification,
    addNotificationListener,
    removeNotificationListener,
    joinNotificationRoom,
    socket,
    dispatchNotificationEvents
};

// Export default cho socket để tương thích với code hiện tại
export default socket;
