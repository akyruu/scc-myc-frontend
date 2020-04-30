export const environment = {
  production: false,
  socket: {
    url: 'http://localhost:8080',
    options: {
      autoConnect: false, // True
      reconnectionAttempts: 5, // Infinity
    }
  }
};
