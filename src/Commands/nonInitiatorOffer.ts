import { IReactSimplePeerState, ReactSimplePeerState } from '../.';
import { handlePeerConnection }                        from './handlePeerConnection';

export async function nonInitiatorOffer(_: string, str: string, state: IReactSimplePeerState) {
    const data = JSON.parse(str);
    const offer = data.offer;
    const id = data.id;

    handlePeerConnection(state.peerConnection, false);
    state.connections.set(id, {model: {connection: state.peerConnection, stream: null}, peers: []});

    state.peerConnection.signal(offer);

    ReactSimplePeerState.next(state);
}
