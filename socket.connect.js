import { io } from "socket.io-client";

const socket = io.connect(process.env.NEXT_PUBLIC_USER_DATA_SERVER);
export default socket;
