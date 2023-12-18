import fastify from 'fastify'

import * as sqlite from "./sqlite"
import { grantToken } from "./ethers"

const server = fastify()

server.get('/', (request, response) => {
    response.send('');
})

server.get('/ping', (request, response) => {
    return 'pong\n'
})

server.post('/', (request, response) => {
    console.log(request.body);

})

server.listen({
    port: 8080,
    host: '0.0.0.0'
}, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})