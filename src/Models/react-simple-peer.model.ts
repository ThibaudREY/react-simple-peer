import { Instance } from 'simple-peer';

export interface ReactSimplePeerModel {
  connection: Instance;
  stream: MediaStream | null;
}
