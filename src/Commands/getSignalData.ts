import {Instance, SignalData} from 'simple-peer';

export async function getSignalData(peerConnection: Instance) {
    return new Promise<SignalData>((resolve, reject) => {
        try {
            if (peerConnection)
                peerConnection.on('signal', data => resolve(data))
        } catch (e) {
            reject(e);
        }
    });
}