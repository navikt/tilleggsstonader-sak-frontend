import React, { Dispatch, SetStateAction } from 'react';
import { VisFormkravVurderinger } from './VisFormkravVurderinger';
import { IFormkravVilkår, Redigeringsmodus } from './typer';
import { EndreFormkravVurderinger } from './EndreFormkravVurderinger';
import { RessursFeilet, RessursSuksess } from '../../../../typer/ressurs';
import { FagsystemVedtak } from '../../typer/fagsystemVedtak';

export interface IProps {
    vurderinger: IFormkravVilkår;
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
    redigeringsmodus: Redigeringsmodus;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
    feilmelding: string;
    fagsystemVedtak: FagsystemVedtak[];
}

export const VisEllerEndreFormkravVurderinger: React.FC<IProps> = ({
    vurderinger,
    lagreVurderinger,
    redigeringsmodus,
    settRedigeringsmodus,
    settOppdaterteVurderinger,
    feilmelding,
    fagsystemVedtak,
}) => {
    switch (redigeringsmodus) {
        case Redigeringsmodus.IKKE_PÅSTARTET:
        case Redigeringsmodus.REDIGERING:
            return (
                <EndreFormkravVurderinger
                    fagsystemVedtak={fagsystemVedtak}
                    feilmelding={feilmelding}
                    lagreVurderinger={lagreVurderinger}
                    settOppdaterteVurderinger={settOppdaterteVurderinger}
                    settRedigeringsmodus={settRedigeringsmodus}
                    vurderinger={vurderinger}
                />
            );
        case Redigeringsmodus.VISNING:
            return (
                <VisFormkravVurderinger
                    fagsystemVedtak={fagsystemVedtak}
                    lagreVurderinger={lagreVurderinger}
                    settOppdaterteVurderinger={settOppdaterteVurderinger}
                    settRedigeringsmodus={settRedigeringsmodus}
                    vurderinger={vurderinger}
                />
            );
    }
};
