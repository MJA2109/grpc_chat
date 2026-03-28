const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const readline = require('readline');

const def = protoLoader.loadSync('chat.proto');
const proto = grpc.loadPackageDefinition(def);

const client = new proto.ChatService(
  '127.0.0.1:50051',
  grpc.credentials.createInsecure()
);

const call = client.Chat();

call.on('data', (msg) => {
  console.log('received:', msg.text);
});

const rl = readline.createInterface({ input: process.stdin });

rl.on('line', (line) => {
  console.log('sending:', line);
  call.write({ text: line });
});
