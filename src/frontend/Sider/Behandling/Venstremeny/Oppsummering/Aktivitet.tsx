import React from 'react';

import { Informasjonskilde, Informasjonsrad, InfoSeksjon } from './Visningskomponenter';
import { FaktaAktivtet } from '../../../../typer/behandling/behandlingFakta/faktaAktivitet';

const Aktivitet: React.FC<{ aktivitet: FaktaAktivtet }> = ({ aktivitet }) => {
    const aktiviteter = aktivitet.søknadsgrunnlag?.aktiviteter;
    const annenAktivitet = aktivitet.søknadsgrunnlag?.annenAktivitet;
    const erLønnetAktivitet = aktivitet.søknadsgrunnlag?.lønnetAktivitet;

    return (
        <>
            <InfoSeksjon label="Valgte Aktiviteter">
                {aktiviteter?.map((akt) => (
                    <Informasjonsrad kilde={Informasjonskilde.SØKNAD} verdi={akt} />
                ))}
            </InfoSeksjon>
            <InfoSeksjon label="Annen Aktivitet">
                <Informasjonsrad kilde={Informasjonskilde.SØKNAD} verdi={annenAktivitet} />
            </InfoSeksjon>
            <InfoSeksjon label="Lønnet aktivitet?">
                <Informasjonsrad kilde={Informasjonskilde.SØKNAD} verdi={erLønnetAktivitet} />
            </InfoSeksjon>
        </>
    );
};

export default Aktivitet;
