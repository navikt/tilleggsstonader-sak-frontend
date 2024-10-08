import * as React from 'react';

import styled from 'styled-components';

import { Alert, BodyShort, Heading, Label } from '@navikt/ds-react';

import { KlageinstansEventType } from '../../../../typer/klage';
import { formaterIsoDatoTid } from '../../../../utils/dato';
import {
    Klagebehandling,
    klagehendelseTypeTilTekst,
} from '../../typer/klagebehandling/klagebehandling';
import { utfallTilTekst } from '../../utils/behandlingsresultat';

const AlertMedMaxbredde = styled(Alert)`
    max-width: 60rem;
`;

export const AnkeVisning: React.FC<{ behandling: Klagebehandling }> = ({ behandling }) => {
    const ankeResultater = behandling.klageinstansResultat.filter((resultat) =>
        [
            KlageinstansEventType.ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET,
            KlageinstansEventType.ANKEBEHANDLING_OPPRETTET,
            KlageinstansEventType.ANKEBEHANDLING_AVSLUTTET,
        ].includes(resultat.type)
    );

    return ankeResultater.length > 0 ? (
        <AlertMedMaxbredde variant={'warning'}>
            <Heading spacing size="small" level="3">
                Merk at det finnes informasjon om anke på denne klagen
            </Heading>
            {ankeResultater.map((resultat) => (
                <div key={resultat.mottattEllerAvsluttetTidspunkt}>
                    <Label size={'small'}>
                        {formaterIsoDatoTid(resultat.mottattEllerAvsluttetTidspunkt)}
                    </Label>
                    <BodyShort size={'small'}>{klagehendelseTypeTilTekst[resultat.type]}</BodyShort>
                    {resultat.utfall && (
                        <BodyShort size={'small'}>{utfallTilTekst[resultat.utfall]}</BodyShort>
                    )}
                </div>
            ))}
        </AlertMedMaxbredde>
    ) : null;
};
