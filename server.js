const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const def = protoLoader.loadSync('chat.proto');
const proto = grpc.loadPackageDefinition(def);

const clients = [];

function Chat(call) {
  clients.push(call);
  console.log('client connected');

  call.on('data', (msg) => {
    console.log('server received:', msg.text);

    clients.forEach(c => c.write(msg));
  });

  call.on('end', () => {
    console.log('client disconnected');
    clients.splice(clients.indexOf(call), 1);
  });
}

const server = new grpc.Server();

server.addService(proto.ChatService.service, { Chat });

server.bindAsync(
  '127.0.0.1:50051',
  grpc.ServerCredentials.createInsecure(),
  () => console.log('server running')
);
