import { SignalData } from 'simple-peer';

export class ClientOffer {
  public offer: SignalData;
  public peers: { [key: string]: string };

  constructor(offer: SignalData, peers: { [p: string]: string }) {
    this.offer = offer;
    this.peers = peers;
  }
}
