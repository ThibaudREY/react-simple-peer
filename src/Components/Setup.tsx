import { SignalData }                                     from 'simple-peer';
import { ReactElement }                                   from 'react';
import React                                              from 'react';
import { ClientOffer, JoinRequest, ReactSimplePeerState } from '../';
import { openConnectionsAsInitiator }                     from '../Commands/openConnectionAsInitiator';
import { syncModelData }                                  from '../Commands/syncModelData';
import { processOfferRequest }                            from '../Commands/processOfferRequest';
import { processJoinResponse }                            from "../Commands/processJoinResponse";
import { processClientOffer }                             from "../Commands/processClientOffer";
import { initiatorOffer }                                 from '../Commands/InitiatorOffer';
import { nonInitiatorOffer }                              from '../Commands/nonInitiatorOffer';
import { tellHimToRetry }                                 from '../Commands/tellHimToRetry';
import { retry }                                          from '../Commands/retry';

interface SimplePeerSetupProps {
    children: ReactElement | ReactElement[];
    onJoinResponse: (processJoinResponse: (offer: SignalData, id: string, room: string, roomCreatorId: string) => void) => void
    onClientOffer: (processClientOffer: (offer: ClientOffer, id: string, isRoomCreator: boolean, emitterId: string) => void) => void
    onOfferRequest: (processOfferRequest: (request: JoinRequest) => void) => void
    onLeaving: (processLeaving: (id: string) => void) => void
    emitOfferResponse: (joinRequest: JoinRequest, signalData: SignalData) => void
    emitInitiatorOffers: (offers: { [key: string]: SignalData }, id: string, room: string) => void
    emitJoinAck: (signalData: SignalData, room: string, recievedId: string, id: string) => void
}

export class Setup extends React.Component<SimplePeerSetupProps, {}> {

    readonly state = {};

    constructor(props: SimplePeerSetupProps) {
        super(props);

        const {onJoinResponse, onClientOffer, onOfferRequest, onLeaving, emitOfferResponse, emitInitiatorOffers, emitJoinAck} = this.props;
        let state = ReactSimplePeerState.value;

        state.commands.set('OPEN_CNTS_AS_INIT___', openConnectionsAsInitiator);
        state.commands.set('SYNC_MODEL_DATA_____', syncModelData);
        state.commands.set('INITIATOR_OFFER_____', initiatorOffer);
        state.commands.set('NON_INITIATOR_OFFER_', nonInitiatorOffer);
        state.commands.set('TELL_HIM_TO_RETRY___', tellHimToRetry);
        state.commands.set('RETRY_______________', retry);

        state.emitOfferResponse = emitOfferResponse;
        state.emitInitiatorOffers = emitInitiatorOffers;
        state.emitJoinAck = emitJoinAck;

        onOfferRequest(processOfferRequest);
        onJoinResponse(processJoinResponse);
        onClientOffer(processClientOffer);
        onLeaving(() => console.log('TODO: Implement processLeaving'));

        ReactSimplePeerState.next(state);
    }

    render() {
        return this.props.children || (<></>);
    }
}
