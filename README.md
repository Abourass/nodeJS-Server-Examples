# Node Server Examples
These are simple networking examples for NodeJS

## Installation:
Download and open your preferred terminal within the folder, then run:

`npm i`

## Running the Examples:
You can use any of the run commands in the package.json file

## #1: Raw Server
An extermely basic TCP echo server. Run:

`node rawServer.js`

Now the server is running use Telnet or NetCat to connect:

Windows:
```telnet localhost 9000```

Linux/Unix: 
```nc localhost 9000```

Now type in whatever string you want. In the terminal window running the server you should see log statements that log when you connect, and the raw buffer data (printing out each byte)
