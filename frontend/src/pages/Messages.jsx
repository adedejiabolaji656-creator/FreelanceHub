import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { connectSocket, disconnectSocket, onNewMessage, offNewMessage } from '../services/socket'

export default function Messages() {
  const { userId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const messagesEndRef = useRef(null)
  const userIdRef = useRef(userId)

  useEffect(() => { userIdRef.current = userId }, [userId])

  useEffect(() => {
    if (!user) return
    connectSocket()
    fetchConversations()
    const handler = (msg) => {
      const currentId = userIdRef.current
      const otherId = msg.sender?._id === user._id ? msg.recipient : msg.sender?._id
      if (currentId && otherId === currentId) {
        setMessages(prev => prev.some(m => m._id === msg._id) ? prev : [...prev, msg])
      }
      fetchConversations()
    }
    onNewMessage(handler)
    return () => {
      offNewMessage()
      disconnectSocket()
    }
  }, [user?._id])

  useEffect(() => {
    if (userId) {
      fetchMessages(userId)
    }
  }, [userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages')
      setConversations(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchMessages = async (id) => {
    try {
      const res = await api.get(`/messages/${id}`)
      setMessages(res.data)
      const conv = conversations.find(c => c.user._id === id)
      if (conv) {
        setSelectedUser(conv.user)
      } else if (res.data.length) {
        const last = res.data[res.data.length - 1]
        setSelectedUser(last.sender._id === user._id ? last.recipient : last.sender)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !userId) return
    try {
      const res = await api.post('/messages', { recipient: userId, content: newMessage })
      setMessages(prev => [...prev, res.data])
      setNewMessage('')
      fetchConversations()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="card h-[calc(100vh-8rem)] flex overflow-hidden p-0">
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg dark:text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm dark:text-gray-400">No conversations yet</div>
          ) : (
            conversations.map(conv => (
              <button key={conv.user._id}
                onClick={() => navigate(`/messages/${conv.user._id}`)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-700/50 ${userId === conv.user._id ? 'bg-primary-50 border-l-4 border-l-primary-600 dark:bg-primary-900/30' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold dark:bg-primary-900/40 dark:text-primary-300">
                    {conv.user.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate dark:text-gray-200">{conv.user.name}</p>
                      {conv.unread > 0 && <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{conv.unread}</span>}
                    </div>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">{conv.lastMessage.content}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {userId && selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center gap-3 dark:border-gray-700">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm dark:bg-primary-900/40 dark:text-primary-300">
                {selectedUser.name[0]}
              </div>
              <span className="font-semibold dark:text-gray-200">{selectedUser.name}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${msg.sender._id === user._id ? 'bg-primary-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-gray-100'}`}>
                    <p>{msg.content}</p>
                    <span className={`text-xs mt-1 block ${msg.sender._id === user._id ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 flex gap-2 dark:border-gray-700">
              <input type="text" className="input flex-1" placeholder="Type a message..."
                value={newMessage} onChange={e => setNewMessage(e.target.value)} />
              <button type="submit" className="btn-primary">Send</button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  )
}