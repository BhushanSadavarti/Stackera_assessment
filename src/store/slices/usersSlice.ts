import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NewUser } from '../../types/user';

interface UsersState {
  newUsers: NewUser[];
}

const initialState: UsersState = {
  newUsers: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<Omit<NewUser, 'id'>>) => {
      const newUser: NewUser = {
        ...action.payload,
        id: Date.now(), // Simple ID generation
      };
      state.newUsers.push(newUser);
    },
  },
});

export const { addUser } = usersSlice.actions;
export default usersSlice.reducer;