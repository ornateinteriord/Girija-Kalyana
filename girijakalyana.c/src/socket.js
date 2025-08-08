import { io } from "socket.io-client";

const socket = io("https://girijakalyana-backend-prod.vercel.app"); // replace with your backend URL if deployed
export default socket;