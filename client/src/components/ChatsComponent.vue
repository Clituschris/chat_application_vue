<template>
    <div id="chat">
        <div v-if="!onLoad" id="user">
            <img :src="state.receiverImg" alt="">
            <div>
                <h3>{{ store.getters.getUserName }}</h3>
                <span v-if="isTyping" class="online">Typing...</span>
                <span v-else-if="isOnline" class="online">Online</span>
                <span v-else class="offline">Offline</span>
            </div>
        </div>
        <div id="chatsDiv">
            <h2 v-if="onLoad">Select any Profile to start the converstation!!!</h2>
            <div v-else v-for="chat in state.chats" :key="chat.id" :class="{ 'sent': chat.sent, 'received': !chat.sent }" >
                <img v-if="chat.sent" :src="state.senderImg" alt="">
                <img v-else :src="state.receiverImg" alt="">
                <div>
                    {{ chat.msg }}
                    <span>{{ getChatTime(chat.msgId) }}</span>
                </div>
            </div>
        </div>
    </div>
    <form v-if="!onLoad" id="inputDiv">
        <input type="text" placeholder="Type Something" v-model="state.text">
        <button type="submit" @click="send" :disabled="buttonActive">Send</button>
    </form>
</template>

<script setup>
import { reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { socket } from '../socket'
import { useStore } from 'vuex';

const store = useStore()

const state = reactive({
    chats: [],
    senderImg:'',
    receiverImg:'',
    text: '',
    typingStatus:false,
    onlineStatus:false,
    loggedInID: sessionStorage.getItem('loggedInID')
})

const onLoad = computed(() => store.getters.getUserId === '')
const buttonActive = computed(() => /^\s*$/.test(state.text) )
const isOnline = computed(() => state.onlineStatus)
const isTyping = computed(() => state.typingStatus)

function send() {
    socket.emit('sendMessage', state.loggedInID, store.getters.getUserId, state.text, new Date())
    state.text = ''
}

function scrollDown(){
    setTimeout(()=>{
        let element = document.getElementById('chatsDiv')
        element.scrollTop = element.scrollHeight
    },10)
}

function getChatTime(time){
    time= new Date(time).toLocaleString(undefined,{timeZone:'Asia/Kolkata',hour12:true})
    return `${time.slice(11,16)} ${time.slice(19)}`
}

socket.on('response:getChats', (data,senderImg,receiverImg) => {
    state.chats = data
    state.senderImg=new URL(`../assets/${senderImg}`,import.meta.url)
    state.receiverImg=new URL(`../assets/${receiverImg}`,import.meta.url)
})

socket.on('refreshChat', () => {
    socket.emit('getChats', state.loggedInID, store.getters.getUserId)
})

socket.on('response:getUserStatus',(userId,status)=>{
    if(userId==store.getters.getUserId){
        state.onlineStatus=status
    }
})

socket.on('showTyping',(loggedInID,userId,status)=>{
    if(state.loggedInID===loggedInID && store.getters.getUserId===userId){
        state.typingStatus=status
    }
})

watch(()=>state.text,()=>{
    socket.emit('setTyping',state.loggedInID,store.getters.getUserId,state.text)
})

watch(() => store.getters.getUserId, () => {
    socket.emit('getChats',state.loggedInID, store.getters.getUserId)
    socket.emit('getUserStatus',store.getters.getUserId)
    scrollDown()
})

onMounted(()=>{
    socket.emit('setOnline',state.loggedInID,true)
})

onUnmounted(()=>{
    socket.emit('setOnline',state.loggedInID,false)
})

</script>

<style scoped>
#chatsDiv {
    height: 480px;
    overflow-y: auto;
    scroll-behavior: smooth;
}

#chatsDiv h2 {
    text-align: center;
    margin-top: 30%;
}

#chatsDiv::-webkit-scrollbar {
    display: none;
}

#user{
    padding: 10px 20px;
    display: flex;
    align-items: end;
}

#user img{
    width: 50px;
    border-radius: 50%;
    border: 1px solid black;
}

#user>div{
    margin-left: 10px;
}

.online{
    color: green;
    font-size: 14px;
}

.offline{
    color: red;
    font-size: 14px;
}
.sent {
    display: flex;
    flex-direction: row-reverse;
    justify-content: end;
    margin: 10px 0px;
}

.sent img {
    height: 40px;
    width: 40px;
    border: 1px solid grey;
    border-radius: 50%;
}
.sent div {
    padding: 10px 10px 5px;
    background-color: #74D1F3;
    border-radius: 15px 0px 15px 15px;
    max-width: 500px;
    margin-top: 20px;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
}
.sent div::after {
    content: '';
    position: absolute;
    top: 0px;
    right: -10px;
    border-top: 10px solid #74D1F3;
    border-left: 10px solid #74D1F3;
    border-right: 10px solid transparent;
}
.sent div span {
    font-size: 10px;
    margin-top: 10px;
    align-self: flex-end;
}

.received {
    display: flex;
    justify-content: start;
    margin: 10px 0px;
}

.received img {
    width: 40px;
    height: 40px;
    border: 1px solid grey;
    border-radius: 50%;
}

.received div {
    padding: 10px 10px 5px;
    background-color: #FFBB02;
    border-radius: 0px 15px 15px 15px;
    margin-top: 20px;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
}

.received div::before {
    content: '';
    position: absolute;
    top: 0px;
    left: -10px;
    border-top: 10px solid #FFBB02;
    border-right: 10px solid #FFBB02;
    border-left: 10px solid transparent;
}
.received div span {
    font-size: 10px;
    margin-top: 10px;
    align-self: flex-end;
}

#inputDiv {
    position: absolute;
    bottom: 10px;
    padding: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
}

#inputDiv input {
    padding: 5px;
    font-size: 15px;
    text-align: center;
    margin: 0px 10px;
    border-radius: 10px;
}

#inputDiv input:focus {
    outline: none;
}

#inputDiv button {
    padding: 5px 10px;
    background-color: greenyellow;
    border-radius: 15px;
}
</style>