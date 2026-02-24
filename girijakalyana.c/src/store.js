// src/store.js
import {create} from 'zustand';

const useStore = create((set) => ({
  profileImage:'',
  firstName:'',
  setprofileImage:(data)=>set((state)=>({profileImage:data})),
  setFirstName:(data)=>set((state)=>({firstName:data})),
}));

export default useStore;
