import uid from 'uid-safe';
import { ReactSimplePeerModel } from 'Models/react-simple-peer.model';
import SimplePeer from 'simple-peer';
import { Stack } from 'typed-structures';
import { JoinRequest } from 'Models/JoinRequest';
import { ClientOffer } from 'Models/ClientOffer';

export const initState = {
  id: uid.sync(15),
  peers: {},
  // Room assignment left to createRoom implementation
  // Since users may want to base it on something business related
  room: null,
  roomCreatorId: null,
  signalData: {},
  connections: new Map<string, { model: ReactSimplePeerModel; peers: [] }>(),
  peerConnection: new SimplePeer(),
  commands: new Map<string, Function>(),
  model: { connection: new SimplePeer(), stream: null },
  joinRequests: new Stack<JoinRequest>(),
  clientOffers: new Stack<[ClientOffer, string, boolean, string]>(),
  emitJoinRequest: () => {},
  emitOfferResponse: () => {},
  emitInitiatorOffers: () => {},
  emitJoinAck: () => {},
};
