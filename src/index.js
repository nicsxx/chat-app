const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const { generateMessage, generatelocationMessage } = require('./utils/messages')
const { addUser,removeUser, getUser} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection' , (socket) => {
    console.log('new Websocket conneciton!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  
    socket.on('join', (options, callback) => {
        const {error, user} = addUser({ id: socket.id, ...options })

        if(error){
            return callback(error)
        }


        // socket.join(room)
        socket.emit('message', generateMessage('Admin Nico pogi', 'Welcome!'))
        socket.broadcast.emit('message', generateMessage('Admin Nico pogi',`${user.username} has joined!`))    
        callback()
    })


    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.emit('message', generateMessage(user.username, message))
        callback('deivered')
    })

    socket.on('sendLocation', (coords, callback) =>{
        const user = getUser(socket.id)
        io.emit('locationMessage', generatelocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
      
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        
        if(user){ 
            io.emit('message', generateMessage('Admin Nico pogi',`${user.username} has left!`))
        }

    })


})

server.listen(port ,() => {
    console.log(`Server is up on port ${port}!`)
})
