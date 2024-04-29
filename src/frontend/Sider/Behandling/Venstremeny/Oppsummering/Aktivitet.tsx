import React from 'react';

import { Informasjonskilde, Informasjonsrad } from './Visningskomponenter';
import { FaktaAktivtet } from '../../../../typer/behandling/behandlingFakta/faktaAktivitet';

const Aktivitet: React.FC<{ aktivitet: FaktaAktivtet }> = ({ aktivitet }) => {
    const aktiviteter = aktivitet.søknadsgrunnlag?.aktiviteter;
    const annenAktivitet = aktivitet.søknadsgrunnlag?.annenAktivitet;
    const erLønnetAktivitet = aktivitet.søknadsgrunnlag?.lønnetAktivitet;

    return (
        <>
            {aktiviteter?.map((akt) => (
                <Informasjonsrad kilde={Informasjonskilde.SØKNAD} verdi={akt} />
            ))}
            {annenAktivitet && (
                <Informasjonsrad
                    kilde={Informasjonskilde.SØKNAD}
                    verdi={`Annen aktivitet: ${annenAktivitet}`}
                />
            )}
            {erLønnetAktivitet && (
                <Informasjonsrad
                    kilde={Informasjonskilde.SØKNAD}
                    verdi={`Lønnet aktivitet: ${erLønnetAktivitet}`}
                />
            )}
        </>
    );
};

export default Aktivitet;
