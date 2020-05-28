import {BehaviorSubject}       from 'rxjs';
import SimplePeer              from 'simple-peer';
import {ReactSimplePeerModel}  from 'Models/react-simple-peer.model';
import {Instance, SignalData}  from 'simple-peer';
import {JoinRequest}           from 'Models/JoinRequest';
import {Stack}                 from 'typed-structures/dist';
import { processOfferRequest } from './Commands/processOfferRequest';
import { ClientOffer }         from 'Models/ClientOffer';
import { initState }           from './state';

export {ReactSimplePeerModel} from './Models/react-simple-peer.model';
export {JoinRoomButton} from './Components/JoinRoomButton';
export {Setup} from './Components/Setup';
export {Peers} from './Components/Peers';
export {State} from './Components/State';
export {ClientOffer} from './Models/ClientOffer';
export {JoinRequest} from './Models/JoinRequest';

export enum Status {
    IDLE = 'IDLE',
    EMITTING_OFFER = 'EMITTING_OFFER',
    REQUESTING_ACCESS = 'REQUESTING_ACCESS',
    RECEIVING_RESPONSE_ACCESS = 'RECEIVING_RESPONSE_ACCESS',
    CONNECTING_TO_EXISTING_PEERS = 'CONNECTING_TO_EXISTING_PEERS',
    JOINING_SESSION = 'JOINING_SESSION'
}

export interface IReactSimplePeerState {

    // State of variables used by connection logic
    peers: { [key: string]: string }
    id: string
    room: string | null
    signalData: SimplePeer.SignalData
    connections: Map<string, {model: ReactSimplePeerModel, peers: string[]}>
    peerConnection: Instance
    commands: Map<string, Function>
    model: ReactSimplePeerModel
    joinRequests: Stack<JoinRequest>
    clientOffers: Stack<[ClientOffer, string, boolean, string]>

    // Storage of called Functions
    emitJoinRequest: () => void
    emitOfferResponse: (joinRequest: JoinRequest, signalData: SignalData) => void
    emitInitiatorOffers: (offers: {[key: string]: SignalData}, id: string, room: string) => void
    emitJoinAck: (signalData: SignalData, room: string, receivedId: string, id: string) => void
}

export const ReactSimplePeerStatusState = new BehaviorSubject<Status>(Status.IDLE);
export const ReactSimplePeerState = new BehaviorSubject<IReactSimplePeerState>(initState);

export function setModel(model: ReactSimplePeerModel) {
    let state = ReactSimplePeerState.value;
    state.model = model;
    ReactSimplePeerState.next(state);
}

export function setRoom(room: string) {
    let state = ReactSimplePeerState.value;
    state.room = room;
    ReactSimplePeerState.next(state);
}

export function getId() {
    return ReactSimplePeerState.value.id;
}

ReactSimplePeerStatusState.subscribe(async status => {
    if (status === Status.IDLE && ReactSimplePeerState.value.joinRequests.length()) {
        let state = ReactSimplePeerState.value;
        console.log(state.joinRequests.length());
        let joinRequest = state.joinRequests.unstack();
        console.log(state.joinRequests.length());
        ReactSimplePeerState.next(state);
        setTimeout(async () => await processOfferRequest(joinRequest), Math.ceil(Math.random() * 1000));
    }
});

