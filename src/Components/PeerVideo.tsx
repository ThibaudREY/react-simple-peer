import React from 'react';
import { ReactSimplePeerModel } from '../';
import filterReactProps from 'filter-react-props';

interface PeerVideoProps {
  peer: ReactSimplePeerModel;
}

interface PeerVideoState {
  stream: MediaStream | null;
}

export class PeerVideo extends React.Component<
  PeerVideoProps &
    React.DetailedHTMLProps<
      React.VideoHTMLAttributes<HTMLVideoElement>,
      HTMLVideoElement
    >,
  PeerVideoState
> {
  readonly state = {
    stream: null,
  };
  private video: HTMLVideoElement = document.createElement('video');

  async componentDidUpdate() {
    this.video.srcObject = await this.props.peer.stream;
  }

  render() {
    return (
      <video
        {...filterReactProps(this.props)}
        autoPlay={true}
        muted={true}
        ref={(video: HTMLVideoElement) => {
          this.video = video;
        }}
      />
    );
  }
}
