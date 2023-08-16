import { createRouter, createWebHistory } from "vue-router"
import LoginView from '../views/LoginView.vue'
import ChatView from '../views/ChatView.vue'

const routes=[
    {
        path:'/',
        name:'home',
        component:LoginView
    },
    {
        path:'/chat',
        name:'chat',
        component:ChatView,
        props:true
    }
]

const router=createRouter({
    history:createWebHistory(),
    routes
})

export default router