'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  email: string | null;
};

type Profile = {
  user_id: string;
  full_name: string;
  profile_pic: string | null;
};

interface SenderProps {
  user: User;
  profiles: Profile[];
}

type Message = {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
};

type Interaction = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'accepted' | 'pending' | 'rejected';
};

export default function Sender({ user, profiles }: SenderProps) {
  const [receiverId, setReceiverId] = useState<string>('');
  const [receiverName, setReceiverName] = useState<string>('');
  const [receiverPic, setReceiverPic] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [acceptedProfiles, setAcceptedProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const senderId = user.id;

  useEffect(() => {
    const fetchAcceptedProfiles = async () => {
      const { data: interactions, error } = await supabase
        .from('interactions')
        .select('*')
        .or(
          `and(sender_id.eq.${senderId},status.eq.accepted),and(receiver_id.eq.${senderId},status.eq.accepted)`
        );

      if (error) {
        console.error('Error fetching interactions:', error);
        return;
      }

      if (!interactions) return;

      const otherUserIds = (interactions as Interaction[]).map((i) =>
        i.sender_id === senderId ? i.receiver_id : i.sender_id
      );

      const filtered = profiles.filter((p) => otherUserIds.includes(p.user_id));
      setAcceptedProfiles(filtered);
    };

    fetchAcceptedProfiles();
  }, [senderId, profiles]);

  useEffect(() => {
    if (!receiverId) {
      setReceiverName('');
      setReceiverPic(null);
      setMessages([]);
      return;
    }

    const found = profiles.find((p) => p.user_id === receiverId);
    setReceiverName(found?.full_name ?? 'Unknown User');
    setReceiverPic(found?.profile_pic ?? null);

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(
          `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
        )
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages((data as Message[]) ?? []);
      }
    };

    fetchMessages();
  }, [receiverId, senderId, profiles]);



  

  useEffect(() => {
    if (!senderId || !receiverId) return;

    const subscription = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const newMsg = payload.new as Message;
          const isRelevant =
            (newMsg.sender_id === senderId && newMsg.receiver_id === receiverId) ||
            (newMsg.sender_id === receiverId && newMsg.receiver_id === senderId);

          if (isRelevant) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [senderId, receiverId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !senderId || !receiverId) return;

    const payload = {
      content: message.trim(),
      sender_id: senderId,
      receiver_id: receiverId,
    };

    const { error } = await supabase.from('chat_messages').insert([payload]);

    if (error) {
      console.error('Insert error:', error);
    } else {
      setMessage('');
    }
  };

  const handleContactSelect = (userId: string) => {
    setReceiverId(userId);
    setShowSidebar(false); // Close sidebar on mobile after selection
  };

  const filteredProfiles = acceptedProfiles.filter((p) =>
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 pt-14 relative">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50 
        w-80 sm:w-64 lg:w-64 
        bg-white shadow-md lg:rounded-lg overflow-y-auto border border-gray-200
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        mt-14 lg:mt-0
      `}>
        <div className="px-4 sm:px-5 py-4 sm:py-5 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-semibold text-black">Contacts</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Search profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 text-black text-sm placeholder-gray-400
                 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
          />
        </div>
        <ul className="pb-4">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((p) => (
              <li
                key={p.user_id}
                className={`flex items-center gap-3 px-4 sm:px-5 py-3 cursor-pointer transition-colors
            ${
              receiverId === p.user_id
                ? 'bg-pink-100 shadow-sm'
                : 'hover:bg-pink-50 active:bg-pink-100'
            }`}
                onClick={() => handleContactSelect(p.user_id)}
              >
                {p.profile_pic ? (
                  <img
                    src={p.profile_pic}
                    alt={`${p.full_name}'s avatar`}
                    className="h-10 w-10 rounded-full object-cover shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-300 shadow-inner flex-shrink-0" />
                )}
                <span className="text-black font-medium truncate">{p.full_name}</span>
              </li>
            ))
          ) : (
            <li className="px-4 sm:px-5 py-3 text-gray-500 italic">No matches found.</li>
          )}
        </ul>
      </aside>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {receiverId ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b px-3 sm:px-4 py-2 sm:py-3 bg-white">
              <div className="flex items-center min-w-0 flex-1">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="lg:hidden p-2 -ml-2 mr-2 rounded-md hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                {receiverPic ? (
                  <img
                    src={receiverPic}
                    alt={`${receiverName}'s avatar`}
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover mr-2 sm:mr-3 flex-shrink-0"
                  />
                ) : (
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300 mr-2 sm:mr-3 flex-shrink-0" />
                )}
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 truncate">{receiverName}</h2>
              </div>
              <button
                onClick={() => router.push(`/viewothersprofile/id?user=${receiverId}`)}
                className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm border border-blue-600 hover:bg-blue-50 px-2 sm:px-3 py-1 rounded-full transition flex-shrink-0"
              >
                <span className="hidden sm:inline">View Profile</span>
                <span className="sm:hidden">Profile</span>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3 sm:space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-gray-500 text-center mt-6 text-sm sm:text-base">No messages yet.</div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender_id === senderId;
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`relative max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 text-sm rounded-lg shadow ${
                          isOwn
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <div className="font-medium mb-1 text-xs sm:text-sm">{isOwn ? 'You' : receiverName}</div>
                        <div className="break-words">{msg.content}</div>
                        <div className={`text-[10px] mt-1 text-right ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <span
                          className={`absolute bottom-0 ${
                            isOwn ? '-right-1 rotate-45 bg-blue-600' : '-left-1 rotate-45 bg-white'
                          } w-2 h-2`}
                          style={{ transformOrigin: 'center' }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 bg-white">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && message.trim()) {
                    handleSend();
                  }
                }}
                className="flex-1 border rounded-full px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring focus:ring-blue-300 text-black min-w-0"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-5 py-2 rounded-full disabled:opacity-50 text-sm sm:text-base flex-shrink-0 transition-colors"
              >
                <span className="hidden sm:inline">Send</span>
                <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 px-4">
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Contacts
            </button>
            <div className="text-center text-sm sm:text-base">
              Select a contact to start chatting.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}