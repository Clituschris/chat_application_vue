const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origin: '*' } })
const fs = require('fs')

server.listen(3000, () => {
    console.log("Server running...")
})

io.on('connection', (socket) => {
    console.log("User Connected " + socket.id)

    socket.on('login', (userId, password) => {
        const file = fs.readFileSync('./db.json')
        const parsedFile = JSON.parse(file)
        if (parsedFile[userId]) {
            if (parsedFile[userId].password === password) {
                socket.emit('response:login', userId)
            } else {
                socket.emit('response:login', 'Incorrect Password')
            }
        } else {
            socket.emit('response:login', 'UserId not found')
        }
    })

    socket.on('register',(userId,name,password)=>{
        const file = fs.readFileSync('./db.json')
        const parsedFile = JSON.parse(file)
        const index=parsedFile.users.findIndex(item=>item.userId===userId)
        if(index>-1){
            socket.emit('response:register','User Already Exists!!!')
        }else{
            parsedFile.users.push({userId,name,online:false})
            parsedFile[userId]={name,password,img:'user.png',conversations:[]}
            fs.writeFileSync('db.json',JSON.stringify(parsedFile))
            socket.emit('response:register','User Register Successfully!!!')
        }
    })

    socket.on('setOnline',(loggedInId,status)=>{
        const file = fs.readFileSync('./db.json')
        const parsedFile = JSON.parse(file)
        parsedFile.users=parsedFile.users.map(item=>(item.userId===loggedInId)?{userId:item.userId,name:item.name,online:status}:item)
        fs.writeFileSync('db.json',JSON.stringify(parsedFile))
        const user=parsedFile.users.filter(item=>item.userId==loggedInId)
        socket.broadcast.emit('response:getUserStatus',loggedInId,user[0].online)
    })

    socket.on('getLoggedProfile',(loggedInID)=>{
        const file = fs.readFileSync('./db.json')
        const parsedFile = JSON.parse(file)
        const data={name:parsedFile[loggedInID].name,img:parsedFile[loggedInID].img}
        socket.emit('response:getLoggedProfile',data)
    })

    socket.on('getProfiles', (loggedInId) => {
        const file = fs.readFileSync('./db.json')
        const parsedFile = JSON.parse(file)
        const data = parsedFile[loggedInId].conversations.map(item => ({ userId: item.userId, name: item.name , img:item.img }))
        socket.emit('response:getProfiles', data)
    })

    socket.on('getChats', (loggedInId, userId) => {
        const file = fs.readFileSync('./db.json')
        const parsedFile = JSON.parse(file)
        const data = parsedFile[loggedInId].conversations.filter(item => item.userId === userId)
        const senderImg=parsedFile[loggedInId].img
        const receiverImg=parsedFile[userId].img
        socket.emit('response:getChats', data[0].chats,senderImg,receiverImg)
    })

    socket.on('getUserStatus',(userId)=>{
        const file = fs.readFileSync('./db.json')
        const parsedFile = JSON.parse(file)
        const user=parsedFile.users.filter(item=>item.userId==userId)
        socket.emit('response:getUserStatus',userId,user[0].online)
    })

    socket.on('sendMessage', (loggedInId,userId, msg, msgId) => {
        const file = fs.readFileSync('./db.json')
        const parsedFile = JSON.parse(file)
        const index1 = parsedFile[userId].conversations.findIndex(item => item.userId === loggedInId)
        const index2 = parsedFile[loggedInId].conversations.findIndex(item => item.userId === userId)
        parsedFile[userId].conversations[index1].chats.push({ msgId, msg, sent: false })
        parsedFile[loggedInId].conversations[index2].chats.push({ msgId, msg, sent: true })

        //move chat to first in receiver

        if(index1>0){
            const tmp=parsedFile[userId].conversations[index1]
            parsedFile[userId].conversations.splice(index1,1)
            parsedFile[userId].conversations.unshift(tmp)
        }

        //move chat to first in sender

        if(index2>0){
            const tmp=parsedFile[loggedInId].conversations[index2]
            parsedFile[loggedInId].conversations.splice(index2,1)
            parsedFile[loggedInId].conversations.unshift(tmp)
        }

        fs.writeFileSync('db.json', JSON.stringify(parsedFile))
        socket.emit('refreshChat')
        socket.broadcast.emit('refreshChat')
    })

    socket.on('setTyping',(loggedInId,userId,text)=>{
        if(text!==''){
            socket.broadcast.emit('showTyping',userId,loggedInId,true)
        }else{
            socket.broadcast.emit('showTyping',userId,loggedInId,false)
        }
    })
})