import 'react-app-polyfill/ie11';
import * as React     from 'react';
import * as ReactDOM  from 'react-dom';
import { SignalData } from 'simple-peer';
import { User }       from "./User";
import io             from 'socket.io-client';
import {
    Setup,
    JoinRequest,
    ClientOffer,
    State,
    setModel,
    getId,
    setRoom,
    Peers,
    JoinRoomButton,
    PeerVideo
}                     from '../dist';

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

            <div className="container">
                <div className="form-group">
                    <input className="form-control" id="exampleInputEmail1" placeholder="Username" autoFocus={true}
                           type="text" onChange={event => setModel(new User(event.target.value))}/>
                </div>

                <div className="col-4 offset-4">
                    <button type="button" className="btn btn-primary">
                        State <span className="badge badge-light">
                        <State/>
                    </span>
                    </button>
                </div>

                <div className="col-8 offset-2">
                    <button className="btn btn-primary m-1" onClick={() => {
                        const roomId = 'AZE';
                        const room = {initiatorPeerId: getId(), roomId: roomId};
                        setRoom(roomId);
                        ws.emit('create', room);
                    }}>Create a room
                    </button>

                    <JoinRoomButton className="btn btn-secondary m-1" room={'AZE'} join={() => {
                        ws.emit('join-request', {roomId: 'AZE', peerId: getId()});
                    }}>Join a room</JoinRoomButton>
                </div>


                <Peers>
                    {
                        peers => {
                            return <ul>
                                {peers.map((peer: User) => <li key={peer.username}>{peer.username}
                                    <PeerVideo peer={peer}/>
                                </li>)}
                            </ul>
                        }
                    }
                </Peers>
            </div>
        </Setup>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
