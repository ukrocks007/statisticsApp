# statisticsApp
A simple statistics demo using React, node, python &amp; Apache thrift

## Demo

[![Demo](https://i.ibb.co/xYSccp2/Screenshot-2019-06-23-at-3-47-44-PM.png)](https://player.vimeo.com/video/343915055)

## How to run

### Setup thrift

As SystemB is using Python it need platform specific libraries of thrift

[Apache thrift build](https://thrift.apache.org/tutorial/)

You have to build thrift on the platform you are using and copy the contents of lib/py/build/ folder to SystemB/lib/py/build

### Running RPC server

```
cd SystemB
pip install numpy
python PythonServer.py
```

### Build frontend

```
cd SystemA/Client
yarn install
yarn build
```

### Running backend

```
cd SystemB/Server
npm i
cd ../
npm run start
```

## Browser

React App used to create front end.

## Browser - SystemA Communication

Client and Server communicates each other via REST api over http transport. The following communications is established between browser and Server.

- `/actions?method=IS-VALID-ENTRY&payload={entry: [1,2,'STR',4,5]}&ts=1548959400000` for sanitization information of input
- `/actions?method=CALCULATE-STATS&payload={entry: [1,2,4,5]}&ts=1548959400000`for calculation of statics for user entry (`payload.entry`)
- `/actions?method=GEN-RAND&ts=1548959400000`for random number generation

## SystemA

SystemA is a simple node server responsible to

- deliver the interface content
- receive http calls
- route http calls to SystemB
- sanitize input

### Sanitization

SystemA can sanitize the input from and respond the browser with sanitization status.

Browser can send the following request to SystemA

    /actions?method=IS-VALID-ENTRY&payload={entry: [1,2,'STR',4,5]}&ts=1548959400000

- **method:** Dictates what service of the SystemA should get invoked
- **payload:** Payload of the service. In this case it sends the user input. User might enter erroneous inputs to the system to check stability. `payload.entry` contains the whatever user is entered in the textbox.
- **ts:** Current timestamp

Sanitiaztion service would normally check if

- all the input values are Integer
- Number of items in the list is more than or equal to 2

If an error occurred during sanitization the error message is displayed in the interface. The status of sanitization is returned in the service response. Only after the sanitization is successfully done the subsequent actions are performed.

## SystemA - SystemB communication

SystemA and SystemB talks to each other over RPC. 

For `method = CALCULATE-STATS`  and `method = GEN-RAND`  SystemA calls SystemB to perform these actions.

### CALCULATE-STATS

Calculate statistics for a list of numbers

    statistics([1,2,3,4,5])
    
    mean: Float,
    median: Int,
    variance: Float,
    std-dev: Float

### GEN-RAND

Generate integers numbers between *[0 - 10]* such that

- The probability of choosing even numbers is *y* and probability of choosing odd numbers is *x;* then *y = 3x*

## SystemB

SystemB is responsible for calculation and generation. 

[Apache Thrift - Home](https://thrift.apache.org/)

The interface implements following functions

    boolean ping(void) { /* ping to check if the server is active */ }
    StatStruct calculateStat(list: [Int]) { /* calculates the statistics for a given list */ }
    [Int] generateNums() { /* list of generated nubers based on distribution */ }
