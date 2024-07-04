import { createSlice } from "@reduxjs/toolkit";

let userDataSlice = createSlice({
    name: "userdata",
    initialState: {
        token: '',
        profileImage: ''
    },
    reducers:{
        addToken: function(state , id){
            state.token = id.payload
        },
        addProfileImage: function(state , img){
            state.profileImage = img.payload;
        }
    }
})

export let {addToken , addProfileImage} = userDataSlice.actions;
export default userDataSlice.reducer;