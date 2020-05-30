import React                    from 'react';
import { ReactSimplePeerModel } from '../';

interface PeerVideoProps {
    peer: ReactSimplePeerModel
}

interface PeerVideoState {
    stream: MediaStream | null
}

export class PeerVideo extends React.Component<PeerVideoProps,
    PeerVideoState> {

    readonly state = {
        stream: null
    }
    private video: HTMLVideoElement = document.createElement('video');

    async componentDidUpdate() {
        this.video.srcObject = await this.props.peer.stream
    }

    render() {
        return <video
            autoPlay={true}
            muted={true}
            ref={(video: HTMLVideoElement) => {
                this.video = video
            }}
        />

    }
}
