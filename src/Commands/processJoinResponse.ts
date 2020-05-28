import freeice from 'freeice';
import SimplePeer, {SignalData, Options} from 'simple-peer';
import {ReactSimplePeerState, ReactSimplePeerStatusState} from '../';
import {Status} from '../';
import {getSignalData}        from "../Commands/getSignalData";
import {handlePeerConnection} from "./handlePeerConnection";

export async function processJoinResponse(offer: SignalData, id: string, room: string/*, roomCreatorId: string*/) {

    let state = ReactSimplePeerState.value;

    if (state.connections.size === 0) {
        ReactSimplePeerStatusState.next(Status.RECEIVING_RESPONSE_ACCESS);
    }

    let config: Options = {
        initiator: false,
        trickle: false,
        config: {iceServers: freeice()}
    };

    if (state.model.stream) {
        config.stream = state.model.stream;
    }

    state.peerConnection = new SimplePeer(config);

    state.peerConnection.on('stream', (/*stream: Promise<MediaStream>*/) => {

        if (id) {

            //this.streamManagerService.subscribePeerStream(id, stream);
        } else {
            // TODO
            //this.streamManagerService.subscribePeerStream(roomCreatorId, stream);
        }
    });

    state.peerConnection.signal(offer);
    const signalData = await getSignalData(state.peerConnection);

    if (state.connections.size === 0) {
        ReactSimplePeerStatusState.next(Status.JOINING_SESSION);
    }

    state.emitJoinAck(signalData, room, id, state.id);

    if (id) {
        state.connections.set(id, {model: {connection: state.peerConnection, stream: null}, peers: []});
    }

    handlePeerConnection(state.peerConnection, false);

    ReactSimplePeerState.next(state);
}
