import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { ActionMenu } from '@navikt/ds-react';

import { useBehandling } from '../../../context/BehandlingContext';
import { usePersonopplysninger } from '../../../context/PersonopplysningerContext';
import {
    Hamburgermeny,
    HenleggMenuItem,
    LenkerGroup,
    NullstillMenuItem,
} from '../../../komponenter/Hamburgermeny/Hamburgermeny';
import TilordnetSaksbehandlerHamburgermeny from '../../../komponenter/TilordnetSaksbehandler/TilordnetSaksbehandlerHamburgermeny';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { Steg } from '../../../typer/behandling/steg';
import { Toggle } from '../../../utils/toggles';

export const HamburgermenyBehandling = () => {
    const {
        behandling,
        settVisRedigerGrunnlagFomAdmin,
        behandlingErRedigerbar,
        settVisHenleggModal,
        settVisNullstillModal,
    } = useBehandling();
    const { personopplysninger } = usePersonopplysninger();
    const kanRedigereGrunnlagFom = useFlag(Toggle.KAN_REDIGERE_GRUNNLAG_FOM);
    const kanNullstillBehandlingFlag = useFlag(Toggle.KAN_NULLSTILLE_BEHANDLING);

    const skalViseRedigerSaksopplysninger =
        behandling.type === BehandlingType.FØRSTEGANGSBEHANDLING &&
        behandling.steg === Steg.INNGANGSVILKÅR &&
        behandlingErRedigerbar &&
        kanRedigereGrunnlagFom;

    const skalViseNullstillBehandling =
        behandlingErRedigerbar &&
        behandling.type === BehandlingType.REVURDERING &&
        kanNullstillBehandlingFlag;

    return (
        <Hamburgermeny>
            <TilordnetSaksbehandlerHamburgermeny />
            <LenkerGroup ident={personopplysninger.personIdent} />
            <ActionMenu.Group label={'Behandling'}>
                {skalViseRedigerSaksopplysninger && (
                    <ActionMenu.Item onSelect={() => settVisRedigerGrunnlagFomAdmin(true)}>
                        Endre dato for henting av saksopplysning
                    </ActionMenu.Item>
                )}
                {behandlingErRedigerbar && (
                    <HenleggMenuItem onSelect={() => settVisHenleggModal(true)} />
                )}
                {skalViseNullstillBehandling && (
                    <NullstillMenuItem onSelect={() => settVisNullstillModal(true)} />
                )}
            </ActionMenu.Group>
        </Hamburgermeny>
    );
};
