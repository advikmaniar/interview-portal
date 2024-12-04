const { Server } = require('socket.io');

const initializeSocketServer = (server) => {
    const io = new Server(server, {
      cors: {
        origin: '*',
      },
    });
  
    io.on('connection', (socket) => {
      console.log('User connected: ', socket.id);
  
      socket.on('offer', (offer) => {
        socket.broadcast.emit('offer', offer); 
      });
  
      socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer); 
      });
  
      socket.on('ice-candidate', (candidate) => {
        socket.broadcast.emit('ice-candidate', candidate); 
      });
  
      socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
      });
    });
  
    return io;
  };
  
  module.exports = initializeSocketServer;