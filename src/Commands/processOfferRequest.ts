import freeice from "freeice";
import {JoinRequest, ReactSimplePeerState, ReactSimplePeerStatusState, Status} from "../";
import SimplePeer, {Options} from 'simple-peer';
import {getSignalData} from '../Commands/getSignalData';

export async function processOfferRequest(request: JoinRequest) {

    let state = ReactSimplePeerState.value;

    if (ReactSimplePeerStatusState.value !== Status.IDLE) {
        state.joinRequests.stack(request);
        ReactSimplePeerState.next(state);
        return;
    }

    ReactSimplePeerStatusState.next(Status.EMITTING_OFFER);

    let config: Options = {
        initiator: true,
        trickle: false,
        config: {iceServers: freeice()}
    };

    if (state.model.stream) {
        config.stream = state.model.stream;
    }

    state.peerConnection = new SimplePeer(config);

    state.peerConnection.on('stream', async (stream: Promise<MediaStream>) => {
        let localState = ReactSimplePeerState.value;
        if (localState.connections.get(request.peerId)) {
            let connection = localState.connections.get(request.peerId)!;
            connection.model.stream = await stream;
            localState.connections.set(request.peerId, connection);
            ReactSimplePeerState.next(localState);
        }
    });

    state.signalData = await getSignalData(state.peerConnection);

    state.emitOfferResponse(request, state.signalData);

    ReactSimplePeerState.next(state);
}
