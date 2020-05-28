import {IReactSimplePeerState} from '../';
import {SignalData}                from 'simple-peer';
import {createExistingPeersOffers} from "./createExistingPeersOffers";

export async function openConnectionsAsInitiator(_: string, data: string, state: IReactSimplePeerState) {

    const peers = JSON.parse(data);

    if (Object.entries(peers).length) {
        const offers: { [key: string]: SignalData } = await createExistingPeersOffers(peers, state);
        state.emitInitiatorOffers(offers, state.id, state.room!);
    }
}
