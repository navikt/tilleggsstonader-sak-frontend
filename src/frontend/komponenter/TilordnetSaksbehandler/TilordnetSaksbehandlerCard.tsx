import React from 'react';

import styled from 'styled-components';

import { PersonHeadsetIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Tooltip } from '@navikt/ds-react';
import {
    ABorderSubtle,
    ASurfaceNeutral,
    ASurfaceSuccess,
    ASurfaceWarning,
    ATextSubtle,
} from '@navikt/ds-tokens/dist/tokens';

import { useBehandling } from '../../context/BehandlingContext';
import { behandlingResultatTilTekst } from '../../typer/behandling/behandlingResultat';
import { behandlingStatusTilTekst } from '../../typer/behandling/behandlingStatus';
import { SaksbehandlerDto, SaksbehandlerRolle } from '../../typer/behandling/saksbehandlerDto';
import { formaterIsoDato, formaterIsoDatoTid } from '../../utils/dato';

const Container = styled.div`
    padding: 1rem;
    display: flex;
    gap: 0.5rem;
    border: 1px solid ${ABorderSubtle};
    border-radius: 0.125rem;
    margin: 1rem 0.5rem;
`;

const FlexBoxRow = styled.div`
    align-items: center;
    display: flex;
    gap: 0.75rem;
`;

const FlexBoxColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const FlexBoxColumnFullWidth = styled(FlexBoxColumn)`
    width: 100%;
    gap: 0.75rem;
`;

const GråBodyShort = styled(BodyShort)`
    color: ${ATextSubtle};
`;

const FontStyledBodyShort = styled(BodyShort)<{ $fontStyle: string }>`
    font-style: ${(props) => props.$fontStyle};
`;

const PersonIkon = styled(PersonHeadsetIcon)`
    width: 3rem;
    height: 3rem;
`;

const StatusBar = styled.span<{ $color: string }>`
    width: 100%;
    border-top: 4px solid ${(props) => props.$color};
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, max-content);
    row-gap: 1rem;
    column-gap: 1.5rem;
`;

const TilordnetSaksbehandlerCard: React.FC = () => {
    const { behandling } = useBehandling();
    if (!behandling.tilordnetSaksbehandler) {
        return null;
    }

    const saksbehandler = behandling.tilordnetSaksbehandler;

    const behandlingHarAnsvarligSaksbehandler =
        saksbehandler.rolle === SaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER ||
        saksbehandler.rolle === SaksbehandlerRolle.ANNEN_SAKSBEHANDLER ||
        saksbehandler.rolle ===
            SaksbehandlerRolle.OPPGAVE_FINNES_IKKE_SANNSYNLIGVIS_INNLOGGET_SAKSBEHANDLER;

    const statusBarFarge = utledStatusbarFarge(saksbehandler.rolle);
    const visingsnavn = utledVisningsnavn(saksbehandler);
    const fontStyle = behandlingHarAnsvarligSaksbehandler ? 'normal' : 'italic';

    const skalViseAnsvarligSaksbehandler =
        saksbehandler.rolle !== SaksbehandlerRolle.OPPGAVE_FINNES_IKKE;

    return (
        <Container>
            <FlexBoxColumnFullWidth>
                {skalViseAnsvarligSaksbehandler && (
                    <>
                        <FlexBoxRow>
                            <PersonIkon />
                            <FlexBoxColumn>
                                <GråBodyShort size={'small'}>Ansvarlig saksbehandler</GråBodyShort>
                                <FontStyledBodyShort $fontStyle={fontStyle} size={'small'}>
                                    {visingsnavn}
                                </FontStyledBodyShort>
                            </FlexBoxColumn>
                        </FlexBoxRow>
                        <StatusBar $color={statusBarFarge} />
                    </>
                )}
                <Grid>
                    <FlexBoxColumn>
                        <GråBodyShort size={'small'}>Behandlingsstatus</GråBodyShort>
                        <BodyShort size={'small'}>
                            {behandlingStatusTilTekst[behandling.status]}
                        </BodyShort>
                    </FlexBoxColumn>
                    <Tooltip content={formaterIsoDatoTid(behandling.opprettet)}>
                        <FlexBoxColumn>
                            <GråBodyShort size={'small'}>Opprettet</GråBodyShort>
                            <BodyShort size={'small'}>
                                {formaterIsoDato(behandling.opprettet)}
                            </BodyShort>
                        </FlexBoxColumn>
                    </Tooltip>
                    <FlexBoxColumn>
                        <GråBodyShort size={'small'}>Behandlingsresultat</GråBodyShort>
                        <BodyShort size={'small'}>
                            {behandlingResultatTilTekst[behandling.resultat]}
                        </BodyShort>
                    </FlexBoxColumn>
                    <Tooltip
                        content={formaterIsoDatoTid(behandling.sistEndret)}
                        placement={'bottom'}
                    >
                        <FlexBoxColumn>
                            <GråBodyShort size={'small'}>Sist endret</GråBodyShort>
                            <BodyShort size={'small'}>
                                {formaterIsoDato(behandling.sistEndret)}
                            </BodyShort>
                        </FlexBoxColumn>
                    </Tooltip>
                </Grid>
                {saksbehandler.rolle ===
                    SaksbehandlerRolle.OPPGAVE_TILHØRER_IKKE_TILLEGGSSTONADER && (
                    <Alert variant={'warning'}>
                        Behandlingens tilhørende oppgave er enten feilregistrert eller satt på et
                        annet tema.
                    </Alert>
                )}
            </FlexBoxColumnFullWidth>
        </Container>
    );
};

export function utledStatusbarFarge(ansvarligSaksbehandlerRolle: SaksbehandlerRolle) {
    switch (ansvarligSaksbehandlerRolle) {
        case SaksbehandlerRolle.IKKE_SATT:
        case SaksbehandlerRolle.UTVIKLER_MED_VEILDERROLLE:
            return ASurfaceNeutral;
        case SaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER:
        case SaksbehandlerRolle.OPPGAVE_FINNES_IKKE_SANNSYNLIGVIS_INNLOGGET_SAKSBEHANDLER:
            return ASurfaceSuccess;
        case SaksbehandlerRolle.ANNEN_SAKSBEHANDLER:
        case SaksbehandlerRolle.OPPGAVE_TILHØRER_IKKE_TILLEGGSSTONADER:
            return ASurfaceWarning;
        default:
            return ASurfaceNeutral;
    }
}

export function utledVisningsnavn(ansvarligSaksbehandler: SaksbehandlerDto) {
    switch (ansvarligSaksbehandler.rolle) {
        case SaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER:
        case SaksbehandlerRolle.OPPGAVE_FINNES_IKKE_SANNSYNLIGVIS_INNLOGGET_SAKSBEHANDLER:
        case SaksbehandlerRolle.ANNEN_SAKSBEHANDLER:
            return `${ansvarligSaksbehandler.fornavn} ${ansvarligSaksbehandler.etternavn}`;
        case SaksbehandlerRolle.UTVIKLER_MED_VEILDERROLLE:
            return 'ingen tilgang';
        default:
            return 'ingen ansvarlig';
    }
}

export default TilordnetSaksbehandlerCard;
