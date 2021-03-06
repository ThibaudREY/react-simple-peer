# react-simple-peer

React component which aims to wrap up [simple-peer](https://github.com/feross/simple-peer) 
into an easy to use P2P room creator. It's main purpose is to hide signaling data exchange 
complexity behind a rather simple set of components.

![demo](demo.gif)


## How does it work ?

![sequence](sequence.png)

## Getting Started

### Installing

react-simple-peer comes as a [npm package](https://www.npmjs.com/package/react-simple-peer)

```shell script
npm install react-simple-peer
```
or 
```shell script
yarn add react-simple-peer
```

### Usage

````typescript jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {SignalData} from 'simple-peer';
import {User} from "./User";
import io from 'socket.io-client';
import {
    Setup,
    JoinRequest,
    ClientOffer,
    State,
    setModel,
    getId,
    setRoom,
    Peers
} from 'react-simple-peer';

const App = () => {
    const ws = io('localhost:9000');

    return (
        <Setup
            onOfferRequest={processOfferRequest => {
                ws.on('offer-request', (request: JoinRequest) => processOfferRequest(request));
            }}

            emitOfferResponse={(joinRequest: JoinRequest, signalData: SignalData) => {
                ws.emit('offer-response', joinRequest, signalData);
            }}

            onJoinResponse={processJoinResponse => {
                ws.on('join-response', (offer: SignalData, id: string, roomCreatorId: string) => processJoinResponse(offer, id, 'AZE', roomCreatorId))
            }}

            emitJoinAck={(signalData, room, recievedId, id) => {
                ws.emit('join-ack', {offer: signalData, roomId: room, peerId: recievedId}, id);
            }}

            onClientOffer={processClientOffer => {
                ws.on('client-offer', (data: ClientOffer, peerId: string, sessionInitiator: boolean, emitterPeerId: string) => processClientOffer(data, peerId, sessionInitiator, emitterPeerId));
            }}

            emitInitiatorOffers={(offers, id, room) => {
                ws.emit('initiator-offers', offers, id, room);
            }}

            onLeaving={(processLeaving: (id: string) => void) => {
                ws.on('leaving', (id: string) => processLeaving(id));
            }}
        >
            <div className="App">
                <header className="App-header">

                    <input type="text" onChange={event => setModel(new User(event.target.value))}/>

                    <p>
                        State : <State/>
                    </p>

                    <button onClick={() => {
                        const roomId = 'myroom';
                        const room = {initiatorPeerId: getId(), roomId: roomId};
                        setRoom(roomId);
                        ws.emit('create', room);
                    }}>Create a room
                    </button>

                    <button onClick={() => {
                        setRoom('myroom');
                        ws.emit('join-request', {roomId: 'AZE', peerId: getId()});
                    }}>Join a room
                    </button>

                    <Peers>
                        {
                            peers => {
                                return <ul>
                                    {Array.from<any>(peers).map((set: [string, User]) => <li
                                        key={set[1].username}>{set[1].username}</li>)}
                                </ul>
                            }
                        }
                    </Peers>
                </header>
            </div>
        </Setup>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
````

## API

### `<Setup>` 
Returns : 
````typescript
children
````
#### Props
##### onOfferRequest
Type: 
````typescript
(processOfferRequest: (request: JoinRequest) => void) => void
````  
Wrapper around OfferRequest event listener that provides processing callback for that request.  

##### emitOfferResponse
Type: 
````typescript
(joinRequest: JoinRequest, signalData: SignalData) => void
````  
Wrapper around OfferRequest event emitter that provides both JoinRequest and SignalingData objects.

##### onJoinResponse
Type: 
````typescript
(processJoinResponse: (offer: SignalData, id: string, roomCreatorId: string) => void) => void
````  
Wrapper around JoinResponse event listener that provides processing callback for that response.

##### emitJoinAck
Type: 
````typescript
(signalData: SignalData, room: string, recievedId: string, id: string) => void
````  
Wrapper around JoinAck event emitter that provides SignalingData as well as room id, received peer id and self peer id.

##### onClientOffer
Type: 
````typescript
(processClientOffer: async (data: ClientOffer, peerId: string, sessionInitiator: boolean, emitterPeerId: string) => void) => void
````  
Wrapper around clientOffer event listener that provides processing callback for that offer.

##### emitInitiatorOffers
Type: 
````typescript
(offers, id, room) => void
````  
Wrapper around InitiatorOffers event emitter that provides list of offers, self id and room id

##### onLeaving
Type: 
````typescript
(processLeaving: (id: string) => void) => void
````  
Wrapper around leaving event listener that provides processing callback for that leaving peer.


### `<JoinRoomButton>`
Returns : 
````typescript
React.HTMLButtonElement
````

#### Props
##### className
Type: 
````typescript
string
````  
CSS class names

##### className
Type: 
````typescript
string
````  
CSS class names

##### room
Type: 
````typescript
string
````  
id of room to join

##### join
Type: 
````typescript
() => void
````  
Wrapper around joinRequest emitter

### `<Peers>`
Returns : 
````typescript
children
````
#### children
Type: 
````typescript
(peers: ReactSimplePeerModel[]) => React.HTMLElement
````   

### `<State>`
Returns :
````typescript
'Waiting for peers' | 'Emitting offer' | 'Requesting access' | 'Receiving response access' | 'Connecting to existing peers' | 'Joining session'
````
Returns the current state of the peer
### JoinRequest
 
````typescript
roomId: string;
peerId: string;
````

### ClientOffer
 
````typescript
offer: SignalData;
peers: {[key: string]: string}
````

### `setModel`
Params:
````typescript
model: ReactSimplePeerModel
```` 
Returns :
````typescript
void
````

### `getId`
Returns :
````typescript
string
````
Returns self peerId

### `setRoom`
Params:
````typescript
roomId: string
```` 
Returns :
````typescript
void
````

### `<PeerVideo>`
#### Props
##### peer
Type: 
````typescript
ReactSimplePeerModel
````   
Returns :
````typescript
React.HTMLVideoElement
````
