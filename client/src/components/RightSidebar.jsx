import React, { useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

const RightSidebar = () => {
    const { messages, selectedUsers } = useChat();
    const { logout, onlineUser } = useAuth();
    const [msgImages, setMsgImages] = useState([]);

    // get all images from the messages and set it to the state
    useEffect(() => {
        setMsgImages(
            messages.filter(msg => msg.image).map((msg) => msg.image)
        )
    }, [messages])

    return selectedUsers && (
        <div className={`bg-[#141221]/60 backdrop-blur-md text-white w-full h-full flex flex-col justify-between border-l border-gray-800/40 ${selectedUsers ? "max-md:hidden" : ""}`}>
            {/* Scrollable Container for Profile Data */}
            <div className='overflow-y-auto flex-1 p-6 space-y-6 custom-scrollbar min-h-0'>
                {/* Profile Header (Avatar, Name, Bio) */}
                <div className='flex flex-col items-center text-center pt-6'>
                    <div className="relative group mb-4">
                        <img
                            src={selectedUsers?.profilePic || assets.avatar_icon}
                            alt="profile"
                            className='w-24 h-24 rounded-full object-cover ring-4 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all duration-300 shadow-xl'
                        />
                        {onlineUser.includes(selectedUsers._id) && <span className='absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-[#141221] animate-pulse'></span>}
                    </div>

                    <h1 className='text-lg font-semibold tracking-wide flex items-center justify-center gap-2 w-full px-4'>
                        <span className="truncate max-w-50">{selectedUsers?.fullName}</span>
                    </h1>

                    <p className='text-xs text-gray-400 mt-2 px-6 max-w-sm leading-relaxed font-light italic'>
                        {selectedUsers?.bio || "No bio available yet."}
                    </p>
                </div>

                <hr className='border-gray-800/60' />

                {/* Media Gallery Section */}
                <div className='space-y-3'>
                    <div className="flex items-center justify-between px-1">
                        <p className='text-xs font-medium tracking-wider text-gray-400 uppercase'>Shared Media</p>
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-mono">{msgImages.length} files</span>
                    </div>

                    {/* Gallery Grid */}
                    <div className='grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1 rounded-lg bg-black/10 border border-gray-800/30 custom-scrollbar'>
                        {msgImages.map((url, idx) => (
                            <div
                                key={idx}
                                onClick={() => window.open(url)}
                                className='cursor-pointer rounded-lg overflow-hidden aspect-square relative group bg-gray-900 border border-gray-800/40'
                            >
                                <img
                                    src={url}
                                    alt="shared grid item"
                                    className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:opacity-90'
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Section - Fixed Logout Button Container */}
            <div className="p-6 bg-linear-to-t from-[#141221] via-[#141221] to-transparent pt-10 shrink-0">
                <button onClick={() => logout()} className='w-full bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-medium py-3 px-6 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 cursor-pointer tracking-wider uppercase'>
                    Logout
                </button>
            </div>
        </div>

    )
}

export default RightSidebar