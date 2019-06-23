var thrift = require('thrift');
var Calculator = require('./gen-nodejs/Calculator');
const assert = require('assert');

var transport = thrift.TBufferedTransport;
var protocol = thrift.TBinaryProtocol;

var connection = thrift.createConnection("localhost", 9090, {
    transport: transport,
    protocol: protocol
});

connection.on('error', function (err) {
    assert(false, err);
});

// Create a Calculator client with the connection
var client = thrift.createClient(Calculator, connection);


const ping = () => client.ping(function (err, response) {
    console.log('ping()');
});


const genRand = async () => {
    return (await client.genRand());
}

const calculateStats = async (list) => {
    return (await client.calculateStats(list));
}

module.exports = {
    ping,
    genRand,
    calculateStats

}