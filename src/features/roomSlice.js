import { createSlice } from '@reduxjs/toolkit';

const roomSlice = createSlice({
    name: 'room',
    initialState: {
        room: {
            currentRoom: null,
            error: false,
        },
    },
    reducers: {
        getAllRoomsSuccess: (state, action) => {
            state.room.currentRoom = action.payload;
            state.room.error = false;
        },
        addRoomSuccess: (state, action) => {
            state.room.currentRoom = action.payload;
            state.room.error = false;
        },
        updateRoomSuccess: (state, action) => {
            state.room.currentRoom = action.payload;
            state.room.error = false;
        },
        deleteRoomSuccess: (state, action) => {
            state.room.currentRoom = action.payload;
            state.room.error = false;
        },
    },
});

export const { getAllRoomsSuccess, addRoomSuccess, updateRoomSuccess, deleteRoomSuccess } = roomSlice.actions;

export default roomSlice.reducer;
