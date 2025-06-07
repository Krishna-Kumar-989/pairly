// // app/chat/sender.tsx
// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { supabase } from '../lib/supabase';

// type User = {
//   id: string;
//   email: string | null;
// };

// type Profile = {
//   user_id: string;
//   full_name: string;
//   profile_pic: string | null;
// };

// interface SenderProps {
//   user: User;
//   profiles: Profile[];
// }

// type Message = {
//   id: string;
//   content: string;
//   sender_id: string;
//   receiver_id: string;
//   created_at: string;
// };

// export default function Sender({ user, profiles }: SenderProps) {
//   // ─── Sidebar & Chat state ─────────────────────────────────────────
//   const [receiverId, setReceiverId] = useState<string>('');
//   const [receiverName, setReceiverName] = useState<string>('');
//   const [receiverPic, setReceiverPic] = useState<string | null>(null);

//   const [message, setMessage] = useState<string>('');
//   const [messages, setMessages] = useState<Message[]>([]);
//   const messageEndRef = useRef<HTMLDivElement | null>(null);

//   const senderId = user.id;

//   // ─── Whenever receiverId changes: lookup full_name + profile_pic, then fetch messages ───
//   useEffect(() => {
//     if (!receiverId) {
//       setReceiverName('');
//       setReceiverPic(null);
//       setMessages([]);
//       return;
//     }

//     // 1) Find this user’s full_name + profile_pic in `profiles`
//     const found = profiles.find((p) => p.user_id === receiverId);
//     setReceiverName(found?.full_name ?? 'Unknown User');
//     setReceiverPic(found?.profile_pic ?? null);

//     // 2) Fetch conversation history (both directions)
//     const fetchMessages = async () => {
//       const { data, error } = await supabase
//         .from('chat_messages')
//         .select('*')
//         .or(
//           `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
//         )
//         .order('created_at', { ascending: true });

//       if (error) {
//         console.error('Error fetching messages:', error);
//       } else {
//         setMessages(data || []);
//       }
//     };
//     fetchMessages();
//   }, [receiverId, senderId, profiles]);

//   // ─── Real‐time subscription: listen for new messages ───────────────────────
//   useEffect(() => {
//     if (!senderId || !receiverId) return;

//     const subscription = supabase
//       .channel('public:chat_messages')
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'chat_messages',
//         },
//         (payload) => {
//           const newMsg = payload.new as Message;
//           const isRelevant =
//             (newMsg.sender_id === senderId && newMsg.receiver_id === receiverId) ||
//             (newMsg.sender_id === receiverId && newMsg.receiver_id === senderId);

//           if (isRelevant) {
//             setMessages((prev) => [...prev, newMsg]);
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [senderId, receiverId]);

//   // ─── Auto‐scroll to bottom on new messages ─────────────────────────────────
//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // ─── Send a new message ─────────────────────────────────────────────────
//   const handleSend = async () => {
//     if (!message.trim() || !senderId || !receiverId) return;

//     const payload = {
//       content: message.trim(),
//       sender_id: senderId,
//       receiver_id: receiverId,
//     };

//     const { data: inserted, error } = await supabase
//       .from('chat_messages')
//       .insert([payload])
//       .select(); // return the inserted row

//     if (error) {
//       console.error('Insert error:', error);
//     } else {
//       setMessage('');
//       // Real‐time listener will append it automatically
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* ─── Sidebar: list of all other users ──────────────────────────────────── */}
//       <aside className="w-64 bg-white border-r overflow-y-auto">
//         <div className="px-4 py-4 border-b">
//           <h2 className="text-lg font-semibold">Contacts</h2>
//         </div>
//         <ul>
//           {profiles.map((p) => (
//             <li
//               key={p.user_id}
//               className={`
//                 flex items-center gap-3 px-4 py-2 cursor-pointer 
//                 hover:bg-gray-100 
//                 ${receiverId === p.user_id ? 'bg-gray-200' : ''}
//               `}
//               onClick={() => setReceiverId(p.user_id)}
//             >
//               {/* Avatar */}
//               {p.profile_pic ? (
//                 <img
//                   src={p.profile_pic}
//                   alt={`${p.full_name}’s avatar`}
//                   className="h-8 w-8 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="h-8 w-8 rounded-full bg-gray-300" />
//               )}
//               {/* Full name */}
//               <span className="text-gray-800">{p.full_name}</span>
//             </li>
//           ))}
//           {profiles.length === 0 && (
//             <li className="px-4 py-2 text-gray-500">
//               No other users found.
//             </li>
//           )}
//         </ul>
//       </aside>

//       {/* ─── Main Chat Area ──────────────────────────────────────────────────── */}
//       <div className="flex-1 flex flex-col">
//         {receiverId ? (
//           <>
//             {/* ─── Header (with avatar) ──────────────────────────────────────── */}
//             <div className="flex items-center border-b px-4 py-3 bg-white">
//               {receiverPic ? (
//                 <img
//                   src={receiverPic}
//                   alt={`${receiverName}’s avatar`}
//                   className="h-10 w-10 rounded-full object-cover mr-3"
//                 />
//               ) : (
//                 <div className="h-10 w-10 rounded-full bg-gray-300 mr-3" />
//               )}
//               <h2 className="text-lg font-semibold text-gray-700">
//                 Chat with {receiverName}
//               </h2>
//             </div>

//             {/* ─── Messages List ──────────────────────────────────────────────── */}
//             <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50">
//               {messages.length === 0 ? (
//                 <div className="text-gray-500 text-center mt-6">
//                   No messages yet.
//                 </div>
//               ) : (
//                 messages.map((msg) => {
//                   const isOwn = msg.sender_id === senderId;
//                   return (
//                     <div
//                       key={msg.id}
//                       className={`flex ${
//                         isOwn ? 'justify-end' : 'justify-start'
//                       }`}
//                     >
//                       <div
//                         className={`relative max-w-[75%] px-4 py-2 text-sm rounded-lg shadow ${
//                           isOwn
//                             ? 'bg-blue-600 text-white rounded-br-none'
//                             : 'bg-white text-gray-900 rounded-bl-none'
//                         }`}
//                       >
//                         <div className="font-medium mb-1">
//                           {isOwn ? 'You' : receiverName}
//                         </div>
//                         <div>{msg.content}</div>
//                         <div className="text-[10px] text-gray-300 mt-1 text-right">
//                           {new Date(msg.created_at).toLocaleTimeString([], {
//                             hour: '2-digit',
//                             minute: '2-digit',
//                           })}
//                         </div>
//                         {/* little “tail” triangle */}
//                         <span
//                           className={`absolute bottom-0 ${
//                             isOwn
//                               ? '-right-1 rotate-45 bg-blue-600'
//                               : '-left-1 rotate-45 bg-white'
//                           } w-2 h-2`}
//                           style={{ transformOrigin: 'center' }}
//                         />
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//               <div ref={messageEndRef} />
//             </div>

//             {/* ─── Input Bar ──────────────────────────────────────────────────── */}
//             <div className="border-t px-4 py-3 flex items-center gap-2 bg-white">
//               <input
//                 type="text"
//                 placeholder="Type your message..."
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' && message.trim()) {
//                     handleSend();
//                   }
//                 }}
//                 className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={!message.trim()}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full disabled:opacity-50"
//               >
//                 Send
//               </button>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500">
//             Select a contact from the sidebar to start chatting.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
/*************************************************************************************************************************************************/
