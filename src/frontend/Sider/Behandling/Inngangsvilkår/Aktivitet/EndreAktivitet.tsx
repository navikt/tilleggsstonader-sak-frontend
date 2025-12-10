import React from 'react';

import { EndreAktivitetBarnetilsyn } from './EndreAktivitetBarnetilsyn';
import { EndreAktivitetBoutgfiter } from './EndreAktivitetBoutgifter';
import { EndreAktivitetDagligReiseTso } from './EndreAktivitetDagligReiseTso';
import { EndreAktivitetDagligReiseTsr } from './EndreAktivitetDagligReiseTsr';
import { EndreAktivitetLæremidler } from './EndreAktivitetLæremidler';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useHentTypeAktivitetValg } from '../../../../hooks/useHentTypeAktivitetValg';
import DataViewer from '../../../../komponenter/DataViewer';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { Aktivitet } from '../typer/vilkårperiode/aktivitet';
import { AktivitetBarnetilsyn } from '../typer/vilkårperiode/aktivitetBarnetilsyn';
import { AktivitetBoutgifter } from '../typer/vilkårperiode/aktivitetBoutgifter';
import { AktivitetDagligReiseTso } from '../typer/vilkårperiode/aktivitetDagligReiseTso';
import { AktivitetDagligReiseTsr } from '../typer/vilkårperiode/aktivitetDagligReiseTsr';
import { AktivitetLæremidler } from '../typer/vilkårperiode/aktivitetLæremidler';

export const EndreAktivitet: React.FC<{
    aktivitet?: Aktivitet;
    aktivitetFraRegister?: Registeraktivitet;
    avbrytRedigering: () => void;
}> = ({ aktivitet, aktivitetFraRegister, avbrytRedigering }) => {
    const { behandling } = useBehandling();
    const { typeAktivitetValg } = useHentTypeAktivitetValg();

    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return (
                <EndreAktivitetBarnetilsyn
                    aktivitet={aktivitet as AktivitetBarnetilsyn}
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
                <DataViewer response={{ typeAktivitetValg }} type={'typeAktivitetValg'}>
                    {({ typeAktivitetValg }) => (
                        <EndreAktivitetDagligReiseTsr
                            aktivitet={aktivitet as AktivitetDagligReiseTsr}
                            aktivitetFraRegister={aktivitetFraRegister}
                            avbrytRedigering={avbrytRedigering}
                            typeAktivitetValg={typeAktivitetValg}
                        />
                    )}
                </DataViewer>
            );
    }
};
