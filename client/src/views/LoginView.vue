
<template>
    <div id="container">
        <div id="formDiv">
            <div id="brandDiv">
                <img src="../assets/happy_chat.png" alt="logo">
                <h1 id="brand">D<span>oii</span>nN</h1>
            </div>
            <div v-if="isLogin" id="inputContainer">
                <h1>Login</h1>
                <form @submit.prevent="">
                    <span>
                        <input type="text" placeholder="Enter Your UserId" required v-model="userId">
                        <div class="line"></div>
                    </span>
                    <span>
                        <input type="password" placeholder="Enter Your Password" required v-model="password">
                        <div class="line"></div>
                    </span>
                    <input id="submitBtn" :class="{ 'inActive': isEmpty }" type="submit" value="Login" @click="login">
                </form>
                <span>
                    <button @click="isLogin=false" >Register</button>
                    <button href=''>Forget Password</button>
                </span>
            </div>
            <div v-else id="inputContainer">
                <h1>Register</h1>
                <form @submit.prevent="">
                    <span>
                        <input type="text" placeholder="Enter Your UserId" required v-model="userId">
                        <div class="line"></div>
                    </span>
                    <span>
                        <input type="text" placeholder="Enter Your Name" required v-model="name">
                        <div class="line"></div>
                    </span>
                    <span>
                        <input type="password" placeholder="Enter Your Password" required v-model="password">
                        <div class="line"></div>
                    </span>
                    <input id="submitBtn" :class="{ 'inActive': isEmpty }" type="submit" value="Register" @click="register">
                </form>
                <span>
                    <button @click="isLogin=true">Login</button>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { socket } from '../socket'
import { onUpdated, ref } from 'vue'

const store = useStore()
const router = useRouter()
const userId = ref('')
const name = ref('')
const password = ref('')
const isEmpty = ref(true)
const isLogin=ref(true)

onUpdated(() => {
    if (userId.value !== '' && password.value !== '') {
        isEmpty.value = false
    } else {
        isEmpty.value = true
    }
})

function login(e) {
    e.preventDefault()
    socket.emit('login', userId.value, password.value)
}

function register(e){
    e.preventDefault()
    socket.emit('register',userId.value,name.value,password.value)
}

socket.on('response:register',res=>{
    if(res==='User Already Exists!!!'){
        alert(res)
    }else{
        userId.value=''
        name.value=''
        password.value=''
        isLogin.value=true
    }
})

socket.on('response:login', res => {
    if (res === 'UserId not found') {
        alert(res)
    } else if (res === 'Incorrect Password') {
        alert(res)
    } else {
        router.push({ path: '/chat' })
        sessionStorage.setItem("loggedInID", res)
        store.dispatch('changeUserId', '')
        store.dispatch('changeUserName', '')
    }
})
</script>

<style scoped>
#container {
    height: 100vh;
    background: linear-gradient(90deg, #00B1ED, #FFBB02);
    display: flex;
    justify-content: center;
    align-items: center;
}

#formDiv {
    background-color: black;
    width: 300px;
    color: white;
    padding: 0px 10px 40px;
}

#inputContainer{
    display: flex;
    flex-direction: column;
    align-items: center;
}

#brandDiv {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
}

#brandDiv img {
    height: 100px;
}

#brandDiv h1 {
    color: #00B1ED;
}

#brandDiv h1 span {
    color: #FFBB02;
}

#formDiv h1 {
    font-family: Arial, Helvetica, sans-serif;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

input {
    height: 40px;
    width: 200px;
    text-align: center;
    margin: 20px 0px 0px;
    background: transparent;
    border: none;
    border-bottom: 1px solid grey;
    color: white;
}

.line {
    height: 2px;
    background-color: #1fddff;
    border-radius: 100px;
    margin-bottom: 20px;
    transform: scaleX(0);
    transition-duration: 0.3s;
}

input:focus {
    outline: none;
}

input:focus~.line,
input:valid~.line {
    transform: scaleX(1);
}

#submitBtn {
    width: 100px;
    border-radius: 10px;
    background: transparent;
    border: 1px solid grey;
    color: white;
    cursor: pointer;
    margin: 20px;
}

.inActive {
    pointer-events: none;
    opacity: 0.5;
}

button {
    text-decoration: none;
    color: grey;
    background: transparent;
    border: none;
    margin: 0px 30px;
}
</style>