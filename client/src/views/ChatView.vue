<template>
    <div v-if="verified" id="chatView">
        <HeaderComponent />
        <div id="container">
            <ProfileComponent />
            <div id="chatContainer">
                <ChatsComponent />
            </div>
        </div>
    </div>
    <div v-else>Not Found</div>
</template>

<script setup>
import { computed } from 'vue'
import HeaderComponent from '../components/HeaderComponent.vue';
import ProfileComponent from '../components/ProfileComponent.vue'
import ChatsComponent from '../components/ChatsComponent.vue';

const verified=computed(()=>sessionStorage.getItem('loggedInID')!=null)

</script>

<style scoped>
#container {
    display: flex;
    justify-content: space-between;
}

#chatContainer{
    width: 80%;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #DDF6FF;
    border-top-left-radius: 100px;
    padding: 10px 20px 60px;
    position: relative;
}
</style>