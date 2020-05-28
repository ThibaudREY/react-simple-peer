import React            from 'react';
import { ReactElement }                  from 'react';
import { ReactSimplePeerState, setRoom } from '../';
import filterReactProps                  from 'filter-react-props'

interface SimplePeerReactJoinRoomButtonProps {
    children: ReactElement
    room: string
    join: () => void
    className: string
}

export class JoinRoomButton extends React.Component<SimplePeerReactJoinRoomButtonProps & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, {}> {

    readonly state = {};

    componentDidMount(): void {
        let state = ReactSimplePeerState.value;
        state.emitJoinRequest = this.props.join;
        ReactSimplePeerState.next(state);
    }

    render() {
        let {join, children, room, onClick} = this.props;
        return <button {...filterReactProps(this.props)}
                        onClick={e => {
                           setRoom(room);
                           join();
                           if (onClick) {
                               onClick(e)
                           }
                       }}
        >{children}</button>
    }
}
