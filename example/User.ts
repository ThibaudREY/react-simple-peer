import {ReactSimplePeerModel} from '../dist';
import SimplePeer, {Instance} from "simple-peer";

export class User implements ReactSimplePeerModel {
    public username: string;
    public stream: MediaStream | null = null;
    private _connection: Instance;

    constructor(username: string) {
        this.username = username;
        this._connection = new SimplePeer()
    }


    get connection(): Instance {
        return this._connection;
    }

    set connection(value: Instance) {
        this._connection = value;
    }
}