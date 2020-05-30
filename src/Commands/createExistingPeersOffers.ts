import { IReactSimplePeerState } from '../';
import SimplePeer, { SignalData, Options } from 'simple-peer';
import freeice from 'freeice';
import { getSignalData } from '../Commands/getSignalData';
import { ReactSimplePeerState } from '../';
import { handlePeerConnection } from '../Commands/handlePeerConnection';

export async function createExistingPeersOffers(
  peers: { [key: string]: any },
  state: IReactSimplePeerState
) {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(peers)
        .filter((set: [string, string]) => set[0] !== state.id)
        .map(async (set: [string, SignalData]) => {
          let config: Options = {
            initiator: true,
            trickle: false,
            config: { iceServers: freeice() },
          };

          if (state.model.stream) {
            config.stream = state.model.stream;
          }

          let pc = new SimplePeer(config);

          handlePeerConnection(pc, false);

          pc.on('stream', async (stream: Promise<MediaStream>) => {
            if (state.connections.get(set[0])) {
              state.connections.get(set[0])!.model.stream = await stream;
            }
          });

          let signalData = await getSignalData(pc);
          set.splice(1, 1, signalData);

          let connection = state.connections.get(set[0]);
          state.connections.set(
            set[0],
            connection || { model: { connection: pc, stream: null }, peers: [] }
          );
          ReactSimplePeerState.next(state);

          return set;
        })
    )
  );
}
