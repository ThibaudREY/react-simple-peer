import {IReactSimplePeerState} from "../../";

export function parse(data: string, state: IReactSimplePeerState) {

    const senderId: string = data.substr(0, 20);
    const command: string = data.substr(20, 20);

    if (state.commands.get(command)) {
        try {
            state.commands.get(command)!(senderId, data.substr(40), state);
        } catch (e) {
            console.warn(e);
        }
    }

    return senderId;
}
