import React from 'react';

import { EndreAktivitetBoutgfiter } from './EndreAktivitetBoutgifter';
import { EndreAktivitetDagligReiseTso } from './EndreAktivitetDagligReiseTso';
import { EndreAktivitetDagligReiseTsr } from './EndreAktivitetDagligReiseTsr';
import { EndreAktivitetLæremidler } from './EndreAktivitetLæremidler';
import { EndreAktivitetPassAvBarn } from './EndreAktivitetPassAvBarn';
import { EndreAktivitetReiseTilSamlingTso } from './EndreAktivitetReiseTilSamlingTso';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useHentTiltaksvariantValg } from '../../../../hooks/useHentTiltaksvariantValg';
import DataViewer from '../../../../komponenter/DataViewer';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { Aktivitet } from '../typer/vilkårperiode/aktivitet';
import { AktivitetBoutgifter } from '../typer/vilkårperiode/aktivitetBoutgifter';
import { AktivitetDagligReiseTso } from '../typer/vilkårperiode/aktivitetDagligReiseTso';
import { AktivitetDagligReiseTsr } from '../typer/vilkårperiode/aktivitetDagligReiseTsr';
import { AktivitetLæremidler } from '../typer/vilkårperiode/aktivitetLæremidler';
import { AktivitetPassAvBarn } from '../typer/vilkårperiode/aktivitetPassAvBarn';
import { AktivitetReiseTilSamlingTso } from '../typer/vilkårperiode/aktivitetReiseTilSamlingTso';

export const EndreAktivitet: React.FC<{
    aktivitet?: Aktivitet;
    aktivitetFraRegister?: Registeraktivitet;
    avbrytRedigering: () => void;
}> = ({ aktivitet, aktivitetFraRegister, avbrytRedigering }) => {
    const { behandling } = useBehandling();
    const { tiltaksvariantValg } = useHentTiltaksvariantValg();

    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return (
                <EndreAktivitetPassAvBarn
                    aktivitet={aktivitet as AktivitetPassAvBarn}
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
        case Stønadstype.LÆREMIDLER:
            return (
                <EndreAktivitetLæremidler
                    aktivitet={aktivitet as AktivitetLæremidler}
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
        case Stønadstype.BOUTGIFTER:
            return (
                <EndreAktivitetBoutgfiter
                    aktivitet={aktivitet as AktivitetBoutgifter}
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
        case Stønadstype.DAGLIG_REISE_TSO:
            return (
                <EndreAktivitetDagligReiseTso
                    aktivitet={aktivitet as AktivitetDagligReiseTso}
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
        case Stønadstype.DAGLIG_REISE_TSR:
            return (
                <DataViewer response={{ tiltaksvariantValg }} type={'tiltaksvariantValg'}>
                    {({ tiltaksvariantValg }) => (
                        <EndreAktivitetDagligReiseTsr
                            aktivitet={aktivitet as AktivitetDagligReiseTsr}
                            aktivitetFraRegister={aktivitetFraRegister}
                            avbrytRedigering={avbrytRedigering}
                            tiltaksvariantValg={tiltaksvariantValg}
                        />
                    )}
                </DataViewer>
            );
        case Stønadstype.REISE_TIL_SAMLING_TSO:
            return (
                <EndreAktivitetReiseTilSamlingTso
                    aktivitet={aktivitet as AktivitetReiseTilSamlingTso}
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
    }
};
