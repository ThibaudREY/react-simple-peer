import React from 'react';
import {ReactSimplePeerStatusState} from '../';
import {ReactSimplePeerStatus} from '../Utils/status';

interface SimplePeerReactStateTooltipProps {
}

interface SimplePeerReactStateTooltipState {
    value: string
}

export class State extends React.Component<SimplePeerReactStateTooltipProps, SimplePeerReactStateTooltipState> {

    readonly state = {
        value: ''
    };

    componentDidMount(): void {
        ReactSimplePeerStatusState.subscribe(async status => {
            this.setState({value: ReactSimplePeerStatus[status]});
        });
    }

    render() {
        return <>{this.state.value}</>
    }
}
