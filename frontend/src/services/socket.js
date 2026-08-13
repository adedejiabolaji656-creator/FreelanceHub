import { io } from 'socket.io-client'

let socket = null

export const connectSocket = () => {
  const token = localStorage.getItem('token')
  if (!token) return null
  socket = io('/', { auth: { token } })
  return socket
}

export const disconnectSocket = () => {
  if (socket) socket.disconnect()
}

export const getSocket = () => socket

export const sendMessage = (recipient, content) => {
  if (socket) socket.emit('sendMessage', { recipient, content })
}

export const onNewMessage = (callback) => {
  if (socket) socket.on('newMessage', callback)
}

export const offNewMessage = () => {
  if (socket) socket.off('newMessage')
}