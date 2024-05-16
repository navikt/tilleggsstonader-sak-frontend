import React from 'react';

import { Informasjonskilde, Informasjonsrad } from './Visningskomponenter';
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
        <>
            {aktiviteter?.map(
                (aktivitet) =>
                    aktivitet !== 'Annet' && (
                        <Informasjonsrad
                            key={aktivitet}
                            kilde={Informasjonskilde.SØKNAD}
                            verdi={aktivitet}
                        />
                    )
            )}
            {annenAktivitet && (
                <Informasjonsrad
                    kilde={Informasjonskilde.SØKNAD}
                    verdi={`Annen aktivitet: ${tekstEllerKode(typeAnnenAktivitetTilTekst, annenAktivitet)}`}
                />
            )}
            {erLønnetAktivitet && erLønnetAktivitet === 'JA' && (
                <Informasjonsrad kilde={Informasjonskilde.SØKNAD} verdi={`Lønnet aktivitet`} />
            )}
        </>
    );
};

export default Aktivitet;
