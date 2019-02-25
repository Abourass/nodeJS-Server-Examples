# Node Server Examples
These are some simple networking examples for NodeJS that I learned while reading *Networking Patterns* by *Pedro Teixeira*

### Table of Contents
Example | Description
------- | -----------
#1 | [Raw Server](#1)
#2 | [Flawed Basic Service](#2)
#3 | [Basic Service as a Stream](#3)

## Installation:
Download and open your preferred terminal within the folder, then run:

`npm i`

## Running the Examples:
You can use any of the run commands in the package.json file

<a name="1"></a>
## #1: Raw Server
An extremely basic TCP echo server. Run:

`node rawServer.js`

Now the server is running use Telnet or NetCat to connect:

Windows:
```telnet localhost 9000```

Linux/Unix: 
```nc localhost 9000```

Now type in whatever string you want. In the terminal window running the server you should see log statements that log when you connect, and the raw buffer data (printing out each byte). If you are curious what it does, just open the file, I've commented enough to highlight how it works. 

<a name="2"></a>
## #2: A Flawed Basic Service
A service which returns the provided string in all caps. This service was built with a flaw, it provides no back-pressure. If the rate at which a client connection sends characters is lower than the rate it receives (for instance, if the downstream available bandwidth is higher than the upstream one), the process memory will grow until it is exhausted. What's needed here is a mechanism by which the incoming TCP stream is paused if the level of memory pending on the outgoing buffer gets high enough. Run via:

```node capitalizingServer.js```

Now the server is running use Telnet or NetCat to connect:

Windows:
```telnet localhost 9000```

Linux/Unix: 
```nc localhost 9000```

Now type in whatever string you want, and you will get back that string in all caps.

<a name="3"></a>
## #3: A Basic Service as a Stream
This is an implementation of the same capitalization service as #2, however, it's implemented as a stream in order to solve the flaw outlined in example #2.
