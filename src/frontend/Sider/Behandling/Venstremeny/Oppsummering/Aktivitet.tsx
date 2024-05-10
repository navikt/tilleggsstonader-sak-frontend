import React from 'react';

import { Informasjonskilde, Informasjonsrad } from './Visningskomponenter';
import { FaktaAktivtet } from '../../../../typer/behandling/behandlingFakta/faktaAktivitet';

const Aktivitet: React.FC<{ aktivitet: FaktaAktivtet }> = ({ aktivitet }) => {
    const aktiviteter = aktivitet.søknadsgrunnlag?.aktiviteter;
    const annenAktivitet = aktivitet.søknadsgrunnlag?.annenAktivitet;
    const erLønnetAktivitet = aktivitet.søknadsgrunnlag?.lønnetAktivitet;

    return (
        <>
            {aktiviteter?.map((aktivitet) =>
                aktivitet !== 'Annet' && (
                    <Informasjonsrad kilde={Informasjonskilde.SØKNAD} verdi={aktivitet} />
                )
            )}
            {annenAktivitet && (
                <Informasjonsrad
                    kilde={Informasjonskilde.SØKNAD}
                    verdi={`Annen aktivitet: ${annenAktivitet}`}
                />
            )}
            {erLønnetAktivitet && erLønnetAktivitet === 'JA' ? (
                <Informasjonsrad kilde={Informasjonskilde.SØKNAD} verdi={`Lønnet aktivitet`} />
            ) : null}
        </>
    );
};

export default Aktivitet;
