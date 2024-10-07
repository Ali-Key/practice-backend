import server from './server/server.js';

const PORT = 5000;

server.listen(PORT, ()=>{
    console.log(`Server is running on port..🚀 ${PORT} `);
})

