import React, { useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const { logout, onlineUser } = useAuth();
    const { getUsers, users, selectedUsers, setSelectedUsers, unseenMessages, setUnseenMessages } = useChat();

    const [input, setInput] = useState(false);

    const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(() => {
        getUsers();
    }, [onlineUser])
    return (
        <div className={`bg-[#818582]/10 h-full p-5 rounded-r-xl flex flex-col text-white 
        ${selectedUsers ? "max-md:hidden" : ""}`}>
            <div className='pb-5 shrink-0'>
                <div className='flex items-center justify-between'>
                    <img src={assets.logo} alt="logo" className='max-w-40' />
                    <div className='relative py-2 group'>
                        <img src={assets.menu_icon} alt="menu" className='max-h-5 cursor-pointer' />
                        <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
                            <p onClick={() => navigate("/profile")} className='cursor-pointer text-sm'>Edit Profile</p>
                            <hr className='my-5 border-t border-gray-500' />
                            <p className='cursor-pointer text-sm' onClick={() => logout()}>Logout</p>
                        </div>
                    </div>
                </div>

                <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
                    <img src={assets.search_icon} alt="search" className='w-3' />
                    <input type="text" onChange={(e) => setInput(e.target.value)} className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
                        placeholder='Search User'
                    />
                </div>
            </div>

            <div className='flex flex-col overflow-y-scroll flex-1 min-h-0'>
                {filteredUsers.map((user, index) => (
                    <div onClick={() => { setSelectedUsers(user); setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 })) }}
                        key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm 
                    ${selectedUsers?._id === user._id && "bg-[#282142]/50"}`}>
                        <img src={user?.profilePic || assets.avatar_icon} alt="profile" className='w-8.75 aspect-ratio-[1/1] rounded-full' />
                        <div className='flex flex-col leading-5'>
                            <p className=''>{user.fullName}</p>
                            {
                                onlineUser.includes(user._id) ?
                                    <span className='text-green-400 text-xs'>Online</span> :
                                    <span className='text-neutral-400 text-xs'>Offline</span>
                            }
                        </div>
                        {unseenMessages[user._id] > 0 &&
                            <p className='ml-auto text-xs h-5 w-5 shrink-0 flex justify-center items-center rounded-full bg-violet-500/50'>
                                {unseenMessages[user._id]}
                            </p>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Sidebar