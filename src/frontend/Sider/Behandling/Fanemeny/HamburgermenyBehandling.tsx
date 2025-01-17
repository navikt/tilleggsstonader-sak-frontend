import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { ActionMenu } from '@navikt/ds-react';

import { useBehandling } from '../../../context/BehandlingContext';
import { usePersonopplysninger } from '../../../context/PersonopplysningerContext';
import {
    Hamburgermeny,
    HenleggMenuItem,
    LenkerGroup,
} from '../../../komponenter/Hamburgermeny/Hamburgermeny';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { Steg } from '../../../typer/behandling/steg';
import { Toggle } from '../../../utils/toggles';

export const HamburgermenyBehandling = () => {
    const {
        behandling,
        settVisRedigerGrunnlagFomAdmin,
        behandlingErRedigerbar,
        settVisHenleggModal,
    } = useBehandling();
    const { personopplysninger } = usePersonopplysninger();
    const kanRedigereGrunnlagFom = useFlag(Toggle.KAN_REDIGERE_GRUNNLAG_FOM);

    const skalViseRedigerSaksopplysninger =
        behandling.type === BehandlingType.FØRSTEGANGSBEHANDLING &&
        behandling.steg === Steg.INNGANGSVILKÅR &&
        kanRedigereGrunnlagFom;

    return (
        <Hamburgermeny>
            <LenkerGroup ident={personopplysninger.personIdent} />
            {behandlingErRedigerbar && skalViseRedigerSaksopplysninger && (
                <ActionMenu.Group label={'Behandling'}>
                    {skalViseRedigerSaksopplysninger && (
                        <ActionMenu.Item onSelect={() => settVisRedigerGrunnlagFomAdmin(true)}>
                            Endre dato for henting av saksopplysning
                        </ActionMenu.Item>
                    )}
                    <ActionMenu.Divider />
                    {behandlingErRedigerbar && (
                        <HenleggMenuItem onSelect={() => settVisHenleggModal(true)} />
                    )}
                </ActionMenu.Group>
            )}
        </Hamburgermeny>
    );
};
