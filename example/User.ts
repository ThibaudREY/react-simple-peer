import {ReactSimplePeerModel} from '../dist';
import SimplePeer, {Instance} from "simple-peer";

export class User implements ReactSimplePeerModel {
    public username: string;
    public stream: MediaStream;
    public connection: Instance;

    constructor(username: string, stream: MediaStream) {
        this.username = username;
        this.connection = new SimplePeer()
        this.stream = stream;
    }
}
