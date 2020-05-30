import { IReactSimplePeerState } from '../.';
import SimplePeer, { Options }   from 'simple-peer';
import freeice                   from "freeice";
import { getSignalData }        from './getSignalData';
import { handlePeerConnection } from './handlePeerConnection';
import { send }                 from './Tools/send';

export async function initiatorOffer(_: string, str: string, state: IReactSimplePeerState) {

    const data = JSON.parse(str);
    const offer = JSON.parse(data.offer);
    const id = data.id;

    let config: Options = {
        initiator: false,
        trickle: false,
        config: {iceServers: freeice()}
    };

    if (state.model.stream) {
        config.stream = state.model.stream;
    }

    const peerConnection = new SimplePeer(config);

    peerConnection.signal(offer);
    const signalData = await getSignalData(state.peerConnection);

    send(peerConnection, 'NON_INITIATOR_OFFER_', JSON.stringify({id: state.id, offer: signalData}));

    handlePeerConnection(peerConnection, false);

    let connection = state.connections.get(id);
    state.connections.set(id, connection || {model: {connection: peerConnection, stream: null}, peers: []});
}
