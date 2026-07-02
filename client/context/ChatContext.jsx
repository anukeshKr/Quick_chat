import { Children, createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});


    const { axios, socket } = useAuth();

    // function to get all users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to get messages for selected users
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to send Message
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUsers._id}`, messageData);
            if (data.success) {
                setMessages((prev) => [...prev, data.newMessage])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to subscribe to message for selected users
    const subscribeToMessges = async () => {
        if (!socket) return;
        socket.on("newMessage", (newMessage) => {
            if (selectedUsers && newMessage.senderId === selectedUsers._id) {
                newMessage.seen = true;
                setMessages((prev) => [...prev, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`)
            } else {
                setUnseenMessages((prev) => ({
                    ...prev, [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // function to unSubscribe from messages 
    const unSubscribeFromMessages = async () => {
        if (socket) socket.off("newMessage");
    }

    useEffect(() => {
        subscribeToMessges();
        return () => unSubscribeFromMessages();
    }, [socket, selectedUsers])

    const value = {
        messages,
        setMessages,
        users,
        getUsers,
        selectedUsers,
        setSelectedUsers,
        getMessages,
        sendMessage,
        unseenMessages,
        setUnseenMessages
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}