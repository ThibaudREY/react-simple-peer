import { Instance } from 'simple-peer';
import { ReactSimplePeerState, ReactSimplePeerStatusState } from '../';
import { Status } from '../';
import { parse } from '../Commands/Tools/parse';
import { send } from '../Commands/Tools/send';
import { deflate_decode_raw } from 'wasm-flate';

export function handlePeerConnection(
  pc: Instance,
  openConnectionAsInitiator: boolean
) {
  pc.on('connect', async () => {
    if (openConnectionAsInitiator) {
      await send(
        pc,
        'OPEN_CNTS_AS_INIT___',
        JSON.stringify(ReactSimplePeerState.value.peers)
      );
    }
    let state = ReactSimplePeerState.value;
    let model = state.model;
    let peers = Array.from(state.connections.keys());
    await send(
      pc,
      'SYNC_MODEL_DATA_____',
      JSON.stringify({ model: model, peers: peers })
    );
  });

  pc.on('data', data => {
    if (
      !(pc as any).initiator &&
      ReactSimplePeerState.value.connections.size === 0
    ) {
      ReactSimplePeerStatusState.next(Status.CONNECTING_TO_EXISTING_PEERS);
    }

    parse(
      new TextDecoder('utf-8').decode(deflate_decode_raw(data)),
      ReactSimplePeerState.value
    );

    ReactSimplePeerState.next(ReactSimplePeerState.value);
  });
}
