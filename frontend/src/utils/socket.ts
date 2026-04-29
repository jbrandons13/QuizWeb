import io from 'socket.io-client';
import { API_URL } from '../config/config';

const socket = io(API_URL, {
    // transports: ['websocket'], // Specify the transport mechanism (websocket)
    autoConnect: true, // Automatically connect on instantiation
    reconnection: true, // Allow socket to attempt reconnection
    reconnectionAttempts: Infinity,
    extraHeaders:{
        "ngrok-skip-browser-warning": "69420"
    } // Number of reconnection attempts
    // Other options you might want to include based on your requirements
  });

//   socket.on('connect', () => {
//     console.log('Socket connected');
//   });
  
//   socket.on('disconnect', (reason) => {
//     console.log(`Socket disconnected: ${reason}`);
//   });
  
//   socket.on('error', (error) => {
//     console.error('Socket error:', error);
//     // Handle the error gracefully without displaying it to the user
//     // For example, retrying the connection or showing a user-friendly message
//   });
  setTimeout(() => {
    console.log("SOCKET: ",socket.connected);
  }, 2000);

export default socket;