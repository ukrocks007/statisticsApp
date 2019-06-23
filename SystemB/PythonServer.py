import glob
import sys
import numpy
sys.path.append('gen-py')
sys.path.insert(0, glob.glob('./lib/py/build/lib*')[0])
from stats import Calculator
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer


class CalculatorHandler:
    def __init__(self):
        self.log = {}

    def ping(self):
        print('ping()')
        return 'pong'

    def genRand(self):
        print('genRand()')
        arr = []
        for x in range(5):
            arr.append(numpy.random.choice(numpy.arange(0, 10), p=[0.05, 0.15, 0.05, 0.15, 0.05, 0.15, 0.05, 0.15, 0.05, 0.15]))
        return arr

    def calculateStats(self, numbers):
        print('calculateStats()')
        arr = [numpy.mean(numbers), numpy.median(numbers), numpy.var(numbers), numpy.std(numbers)]
        return arr


if __name__ == '__main__':
    handler = CalculatorHandler()
    processor = Calculator.Processor(handler)
    transport = TSocket.TServerSocket(host='127.0.0.1', port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)

    print('Starting the server...')
    server.serve()
    print('done.')
