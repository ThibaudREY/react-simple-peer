import {
  ClientOffer,
  ReactSimplePeerState,
  ReactSimplePeerStatusState,
  Status,
} from '../';
import { handlePeerConnection } from './handlePeerConnection';
import { send } from '../Commands/Tools/send';

export function processClientOffer(
  data: ClientOffer,
  id: string,
  roomCreator: boolean,
  emitterPeerId: string
) {
  let state = ReactSimplePeerState.value;

  if (roomCreator) {
    handlePeerConnection(state.peerConnection, true);
    let connection = state.connections.get(emitterPeerId);
    state.connections.set(
      emitterPeerId,
      connection || {
        model: { connection: state.peerConnection, stream: null },
        peers: [],
      }
    );
    ReactSimplePeerState.next(state);
  }

  if (id && state.connections.get(emitterPeerId)) {
    const peerConnection = state.connections.get(emitterPeerId);
    handlePeerConnection(peerConnection!.model.connection, false);
    state.peerConnection = peerConnection!.model.connection;
    ReactSimplePeerState.next(state);
  }

  let retry = async () => {
    let relayPeer = Array.from(
      ReactSimplePeerState.value.connections.values()
    ).find(peer => {
      return peer.peers.includes(emitterPeerId);
    });

    if (
      !relayPeer ||
      (relayPeer &&
        !(await send(
          relayPeer.model.connection,
          'TELL_HIM_TO_RETRY___',
          emitterPeerId
        )))
    ) {
      setTimeout(async () => await retry(), Math.ceil(Math.random() * 1000));
    }
  };

  state.peerConnection.on('error', async (e: any) => {
    if (e.code === 'ERR_SET_REMOTE_DESCRIPTION') {
      console.warn(
        'Encountered an error while trying to signal incoming offer, retrying'
      );
      setTimeout(async () => await retry(), Math.ceil(Math.random() * 1000));
      return;
    }
  });

  state.peerConnection.signal(data.offer);
  state.peers = data.peers;

  ReactSimplePeerStatusState.next(Status.IDLE);

  ReactSimplePeerState.next(state);
}
