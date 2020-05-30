import { ReactSimplePeerModel, ReactSimplePeerState } from '../..';
import { send } from './send';

export async function broadcast(
  command: string,
  data?: string | ArrayBuffer | null,
  destinees: string[] = []
) {
  const state = ReactSimplePeerState.value;

  if (destinees.length === 0) {
    for (const entry of Array.from<
      [string, { model: ReactSimplePeerModel; peers: string[] }]
    >(state.connections.entries())) {
      await send(entry[1].model.connection, command, data);
    }
  } else {
    for (const peerId of destinees) {
      try {
        await send(
          state.connections.get(peerId)!.model.connection,
          command,
          data
        );
      } catch (e) {
        console.warn(
          'An error occurred when trying to send data to peer: Peer not found'
        );
      }
    }
  }
}
