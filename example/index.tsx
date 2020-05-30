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
                ws.on('client-offer', async (data: ClientOffer, peerId: string, sessionInitiator: boolean, emitterPeerId: string) => await processClientOffer(data, peerId, sessionInitiator, emitterPeerId));
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
                           type="text"
                           onChange={async event => setModel(new User(event.target.value, await navigator.mediaDevices.getUserMedia({
                               audio: false,
                               video: true
                           })))}/>
                </div>

                <div className="col-10 offset-1">
                    <button type="button" className="btn btn-primary">
                        State <span className="badge badge-light">
                        <State/>
                    </span>
                    </button>

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
                            return <div className="container row">
                                {peers.map((peer: User) => <div className="col-3" key={peer.username}>
                                        <button type="button" className="btn btn-primary">
                                            <PeerVideo className="center" style={{height: '70px'}} peer={peer}/>
                                            <p className="text-center">
                                                {peer.username}
                                            </p>
                                        </button>
                                    </div>
                                )}
                            </div>
                        }
                    }
                </Peers>

            </div>
        </Setup>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
