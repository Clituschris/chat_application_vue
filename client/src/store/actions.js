export const actions={
    changeUserId(context,id){
        context.commit('CHANGE_USERID',id)
    },
    changeUserName(context,name){
        context.commit('CHANGE_USERNAME',name)
    }
}