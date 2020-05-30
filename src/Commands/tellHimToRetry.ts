import { IReactSimplePeerState } from '../';
import { send } from './Tools/send';

export async function tellHimToRetry(
  _: string,
  data: string,
  state: IReactSimplePeerState
) {
  let target = state.connections.get(data);

  if (target) {
    await send(target.model.connection, 'RETRY_______________');
  }
}
