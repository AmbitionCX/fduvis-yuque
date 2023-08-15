import fastify from 'fastify'

import * as sqlite from "./sqlite"
import { grantToken } from "./ethers"

const server = fastify()

server.get('/', (request, reply) => {
    reply.send('');
  })

server.get('/ping', (request, reply) => {
    return 'pong\n'
})

server.post('/', (request, reply) => {
    // console.log(request.body.data);
    
})

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})