import {IReactSimplePeerState} from '../';
import {ReactSimplePeerState}  from '../';
import { initState }           from '../state';

export function retry(_: string, _1: string, state: IReactSimplePeerState) {
    ReactSimplePeerState.next(initState);
    setTimeout(() => state.emitJoinRequest(), Math.ceil(Math.random() * 1000));
}
