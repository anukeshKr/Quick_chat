import toast from "react-hot-toast";
export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
}

// 1. The core customization options
export const toastConfig = {
    position: "bottom-left",
    toastOptions: {
        style: {
            background: "#f0f2f2",
            color: "#1c1917",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "500",
            border: "1px solid #2e2a24",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
        },
        success: {
            duration: 3000,
            iconTheme: { primary: "#22c55e", secondary: "#fff" },
        },
        error: {
            duration: 4000,
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
        },
    },
};

// 2. Custom helper utility you can import anywhere
export const showToast = {
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg || "An unexpected error occurred"),
    loading: (msg) => toast.loading(msg),
    dismiss: (id) => toast.dismiss(id), // Call with or without a specific toast ID
};
