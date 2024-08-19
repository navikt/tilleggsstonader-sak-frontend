import * as React from 'react';

import styled from 'styled-components';

import { PersonCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Detail, Label } from '@navikt/ds-react';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';

import { formaterIsoDatoTid } from '../../../../utils/dato';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';
import {
    behandlingStegFullførtTilTekst,
    KlagebehandlingSteg,
} from '../../typer/klagebehandling/klagebehandlingSteg';
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
    historikksteg: KlagebehandlingSteg;
    opprettetAv: string;
    endretTid: string;
}

const HistorikkInnslag: React.FunctionComponent<IHistorikkOppdatering> = ({
    behandling,
    historikksteg,
    opprettetAv,
    endretTid,
}) => {
    return (
        <Innslag>
            <Ikon>
                <PersonCircleIcon fontSize="1.5rem" />
                <StipletLinje />
            </Ikon>
            <Tekst>
                <Label size="small">{behandlingStegFullførtTilTekst[historikksteg]}</Label>
                {historikksteg === KlagebehandlingSteg.BEHANDLING_FERDIGSTILT && (
                    <BodyShort>{utledStegutfall(behandling, historikksteg)}</BodyShort>
                )}
                <Detail size="small">
                    {formaterIsoDatoTid(endretTid)} | {opprettetAv}
                </Detail>
            </Tekst>
        </Innslag>
    );
};

export default HistorikkInnslag;
