import {IReactSimplePeerState} from '../';
import {ReactSimplePeerState} from '../';

export function syncModelData(senderId: string, data: string, state: IReactSimplePeerState) {

    if (state.connections.get(senderId)) {
        let syncData = JSON.parse(data);

        syncData.model.connection = state.connections.get(senderId)!.model.connection;

        state.connections.set(senderId, syncData);

        ReactSimplePeerState.next(state);
    }
}
