<template>
    <header>
        <div id="brandDiv">
            <img src="../assets/happy_chat.png" alt="logo">
            <h1 id="brand">D<span>oii</span>nN</h1>
        </div>
        <div id="profileDiv">
            <div>
                <div id="profile">
                    <div>
                        <h3>{{ state.loggedInName }}</h3>
                        <h5>{{ state.loggedInID }}</h5>
                    </div>
                    <img :src="state.profileImg" alt="profile">
                </div>
                <button @click="logout">Logout</button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { socket } from '../socket';
import {useRouter} from 'vue-router';

const router=useRouter()
const state = reactive({
    loggedInID: sessionStorage.getItem('loggedInID'),
    loggedInName: '',
    profileImg:''
})

socket.on('response:getLoggedProfile', (res) => {
    state.loggedInName = res.name
    state.profileImg=new URL(`../assets/${res.img}`,import.meta.url)
})

function logout(){
    router.push({path:'/'})
    sessionStorage.removeItem('loggedInID')
}

onMounted(() => {
    socket.emit('getLoggedProfile', state.loggedInID)
})
</script>

<style scoped>
header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 2px solid grey;
}

#brandDiv {
    display: flex;
    align-items: center;
}

#brandDiv img {
    height: 80px;
}

#brandDiv h1 {
    color: #00B1ED;
}

#brandDiv h1 span {
    color: #FFBB02;
}

#profileDiv {
    display: flex;
    align-items: center;
}

#profileDiv>div{
    display: flex;
    flex-direction: column;
    align-items: end;
}

#profileDiv>div>button{
    height: 25px;
    width: 60px;
    font-size: 12px;
    margin: 10px 0px 0px;
    background-color: red;
    border: none;
    color: white;
    padding: 5px;
    border-radius: 10px;
}

#profile {
    display: flex;
    align-items: center;
}

#profile div {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-top: 10px;
}

#profile h3 {
    margin-right: 10px;
}

#profile h5 {
    margin-right: 10px;
    text-align: end;
    color: grey;
}

#profile img {
    height: 50px;
    border: 1px solid black;
    border-radius: 50%;
}
</style>