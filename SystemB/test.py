import unittest
from PythonServer import CalculatorHandler


class TestUM(unittest.TestCase):

    def setUp(self):
        self.handler = CalculatorHandler()

    def testPing(self):
        self.assertEqual(self.handler.ping(), 'pong')

    def testGenRand(self):
        self.assertEqual(len(self.handler.genRand()), 5)

    def testGetStats(self):
        self.assertEqual(self.handler.calculateStats([1,2,3,4,5]), [3, 3, 2, 1.4142135623730951])


if __name__ == '__main__':
    unittest.main()
