import { IReactSimplePeerState } from '../';
import { ReactSimplePeerState } from '../';

export function syncModelData(
  senderId: string,
  data: string,
  state: IReactSimplePeerState
) {
  if (state.connections.get(senderId)) {
    let syncData = JSON.parse(data);

    let model = state.connections.get(senderId)!.model;

    state.connections.set(senderId, {
      peers: syncData.peers,
      model: {
        ...syncData.model,
        connection: model.connection,
        stream: model.stream,
      },
    });

    ReactSimplePeerState.next(state);
  }
}
