import React from 'react';

import { BriefcaseIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { InfoSeksjon } from './Visningskomponenter';
import {
    FaktaAktivtet,
    typeAnnenAktivitetTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaAktivitet';
import { tekstEllerKode } from '../../../../utils/tekstformatering';

const Aktivitet: React.FC<{ aktivitet: FaktaAktivtet }> = ({ aktivitet }) => {
    const aktiviteter = aktivitet.søknadsgrunnlag?.aktiviteter;
    const annenAktivitet = aktivitet.søknadsgrunnlag?.annenAktivitet;
    const erLønnetAktivitet = aktivitet.søknadsgrunnlag?.lønnetAktivitet;

    return (
        <InfoSeksjon label="Aktivitet" ikon={<BriefcaseIcon />}>
            {aktiviteter?.map(
                (aktivitet) =>
                    aktivitet !== 'Annet' && (
                        <BodyShort size="small" key={aktivitet}>
                            {aktivitet}
                        </BodyShort>
                    )
            )}
            {annenAktivitet && (
                <BodyShort size="small">
                    Annen aktivitet: {tekstEllerKode(typeAnnenAktivitetTilTekst, annenAktivitet)}
                </BodyShort>
            )}
            {erLønnetAktivitet && erLønnetAktivitet === 'JA' && (
                <BodyShort size="small">Lønnet aktivitet</BodyShort>
            )}
        </InfoSeksjon>
    );
};

export default Aktivitet;
