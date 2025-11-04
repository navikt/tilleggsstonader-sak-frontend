import React from 'react';

import { styled } from 'styled-components';

import { Detail, HStack } from '@navikt/ds-react';
import { BorderNeutralSubtle, ShadowDialog } from '@navikt/ds-tokens/darkside-js';

import { utledFargeTilResultat } from './utils';
import { useBehandling } from '../../context/BehandlingContext';
import { erAktivitet } from '../../Sider/Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';
import { Aktivitet } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { Målgruppe } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { VilkårBase } from '../../Sider/Behandling/vilkår';
import { BehandlingType } from '../../typer/behandling/behandlingType';
import { HvittVilkårsresultatIkon } from '../Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import { Statusbånd } from '../Statusbånd';

/**
 * Høyde og position sørger for at statusbånd og knapp plasseres riktig.
 */
const Container = styled.div`
    min-height: 110px;
    position: relative;

    display: grid;
    grid-template-columns: 26px 1fr;

    border-radius: 12px;
    border: 1px solid ${BorderNeutralSubtle};
    border-bottom: none;
    box-shadow: ${ShadowDialog};
`;

const InnholdContainer = styled.div<{ redigeres: boolean }>`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    margin-right: ${({ redigeres }) => (redigeres ? '0' : '3rem')};
`;

export const ResultatMarg = styled.div<{ bakgrunnsfarge: string }>`
    border-radius: 11px 0 0 11px;
    padding-top: 1rem;
    background-color: ${({ bakgrunnsfarge }) => bakgrunnsfarge};
    display: flex;
    justify-content: center;
`;

const RedigeringsknappContainer = styled(HStack)`
    right: 1rem;
    bottom: 1rem;
    position: absolute;
    align-items: center;
`;

export const ResultatOgStatusKort: React.FC<{
    periode: VilkårBase | Aktivitet | Målgruppe | undefined;
    redigeringKnapp?: React.ReactNode;
    redigeres?: boolean;
    children: React.ReactNode;
    footer?: React.ReactNode;
}> = ({ periode, redigeringKnapp, children, redigeres = false, footer }) => {
    const { behandling } = useBehandling();

    const skalViseStatus =
        behandling.type === BehandlingType.REVURDERING &&
        periode?.status !== undefined &&
        !redigeres;

    const resultatFarge = utledFargeTilResultat(periode?.resultat, redigeres);

    // Vises kun på aktiviteter
    const kildeId = periode && erAktivitet(periode) ? periode.kildeId : undefined;

    return (
        <Container>
            {skalViseStatus && <Statusbånd status={periode.status} />}
            <ResultatMarg bakgrunnsfarge={resultatFarge}>
                {periode && !redigeres && (
                    <HvittVilkårsresultatIkon vilkårsresultat={periode?.resultat} />
                )}
            </ResultatMarg>
            <InnholdContainer redigeres={redigeres}>
                {children}
                {footer}
            </InnholdContainer>
            <RedigeringsknappContainer gap="4">
                {kildeId && <Detail>ID: {kildeId}</Detail>}
                {redigeringKnapp}
            </RedigeringsknappContainer>
        </Container>
    );
};
