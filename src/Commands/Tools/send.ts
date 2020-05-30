import { Instance } from 'simple-peer';
import { ReactSimplePeerState } from '../..';
import { deflate_encode_raw } from 'wasm-flate';

export async function send(
  pc: Instance,
  command: string,
  data?: string | ArrayBuffer | null
) {
  try {
    pc.send(
      deflate_encode_raw(
        new Uint8Array(
          Buffer.from(`${ReactSimplePeerState.value.id}${command}${data}`)
        )
      )
    );
    return true;
  } catch (e) {
    console.warn(
      'An error occurred when trying to send data to peer: Failed to reach peer'
    );
    return false;
  }
}
