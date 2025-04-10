import * as React from 'react';

import styled from 'styled-components';

import { PersonCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Detail, Label } from '@navikt/ds-react';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';

import { Metadata } from './Metadata';
import { formaterIsoDatoTid } from '../../../../utils/dato';
import { Behandlingshistorikk, hendelseTilTekst } from '../../typer/behandlingshistorikk';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';
import { KlagebehandlingSteg } from '../../typer/klagebehandling/klagebehandlingSteg';
import { utledStegutfall } from '../../utils/behandlingsresultat';

const Innslag = styled.div`
    display: flex;
    margin: 1rem 1.6rem;
`;

const Ikon = styled.div`
    display: block;
`;

const StipletLinje = styled.div`
    border-left: 0.15rem dotted ${ABorderStrong};
    margin-top: 0.5rem;
    margin-left: 0.75rem;
    height: 1.5rem;
`;

const Tekst = styled.div`
    margin-left: 0.7rem;
`;

interface IHistorikkOppdatering {
    behandling: Klagebehandling;
    historikk: Behandlingshistorikk;
}

const HistorikkInnslag: React.FunctionComponent<IHistorikkOppdatering> = ({
    behandling,
    historikk,
}) => {
    const { steg, hendelse, endretTid, endretAvNavn, metadata } = historikk;
    return (
        <Innslag>
            <Ikon>
                <PersonCircleIcon fontSize="1.5rem" />
                <StipletLinje />
            </Ikon>
            <Tekst>
                {}
                <Label size="small">{hendelseTilTekst[hendelse]}</Label>
                {hendelse === KlagebehandlingSteg.BEHANDLING_FERDIGSTILT && (
                    <BodyShort>{utledStegutfall(behandling, steg)}</BodyShort>
                )}
                <Detail size="small">
                    {formaterIsoDatoTid(endretTid)} | {endretAvNavn}
                </Detail>
                {metadata && <Metadata metadata={metadata} />}
            </Tekst>
        </Innslag>
    );
};

export default HistorikkInnslag;
