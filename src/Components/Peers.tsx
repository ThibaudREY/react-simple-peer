import React, {ReactElement} from 'react';
import {ReactSimplePeerModel, ReactSimplePeerState} from '../index';

interface PeersProps {
    children: (connections: ReactSimplePeerModel[]) => void | ReactElement | ReactElement[];
}

interface PeersState {
    connections: ReactSimplePeerModel[]
}

export class Peers extends React.Component<PeersProps, PeersState> {

    readonly state = {
        connections: []
    };

    componentDidMount(): void {
        ReactSimplePeerState.subscribe(state => {
            this.setState({
                connections: Array.from(state.connections).map(set => set[1].model)
            });
        })
    }

    render() {
        const {children} = this.props;
        return children(this.state.connections) || (<></>);
    }
}
