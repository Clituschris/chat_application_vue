<template>
    <div id="profilesDiv">
        <div id="inputDiv">
            <input type="text" placeholder="Filter" v-model="state.search" />
        </div>
        <div class="profile" v-for="profile in state.showData" @click="changeUser(profile.userId,profile.name)">
            <span>
                <img :src="getProfileImg(profile.img)" />
                <div>
                    <h3>{{ profile.name }}</h3>
                </div>
            </span>
        </div>
    </div>
</template>

<script setup>
import { socket } from '../socket'
import { useStore } from 'vuex';
import { onMounted, reactive, watch } from 'vue'

const store = useStore()

const state = reactive({
    profilesData: [],
    showData:[],
    search: '',
    loggedInId: sessionStorage.getItem('loggedInID')
})

function getProfileImg(img){
    return new URL(`../assets/${img}`,import.meta.url)
}

function changeUser(id,name){
    store.dispatch('changeUserId',id)
    store.dispatch('changeUserName',name)
}

socket.on('response:getProfiles', (data) => {
    state.profilesData = data
    state.showData=state.profilesData
})

socket.on('refreshChat',()=>{
    socket.emit('getProfiles',state.loggedInId)
})

watch(()=>state.search,()=>{
    state.showData=state.profilesData.filter(item=>item.name.toLowerCase().startsWith(state.search.toLowerCase()))
})

onMounted(() => {
    socket.emit('getProfiles', state.loggedInId)
})

</script>

<style scoped>
#profilesDiv {
    padding: 20px;
    flex-basis: 200px;
    height: 540px;
    overflow-y: auto;
    margin-right: 30px;
}

#profilesDiv::-webkit-scrollbar {
    display: none;
}

#profilesDiv h2 {
    margin: 20px 0px;
}

#inputDiv input {
    padding: 10px;
    border-radius: 10px;
    width: 150px;
}

.profile {
    height: 100px;
    box-shadow: 0px 0px 10px #dddddd;
    display: flex;
    align-items: center;
    margin: 10px 0px;
    padding: 10px;
    border-radius: 10px;
}

.profile span {
    display: flex;
    align-items: center;
}

.profile img {
    width: 50px;
    border-radius: 50%;
}

.profile h3 {
    margin: 0px 10px;
}
</style>