import React from 'react';

import { EndreAktivitetBoutgfiter } from './EndreAktivitetBoutgifter';
import { EndreAktivitetDagligReiseTso } from './EndreAktivitetDagligReiseTso';
import { EndreAktivitetDagligReiseTsr } from './EndreAktivitetDagligReiseTsr';
import { EndreAktivitetFlytting } from './EndreAktivitetFlytting';
import { EndreAktivitetLæremidler } from './EndreAktivitetLæremidler';
import { EndreAktivitetPassAvBarn } from './EndreAktivitetPassAvBarn';
import { EndreAktivitetReiseOppstartAvslutningHjemreiseTso } from './EndreAktivitetReiseOppstartAvslutningHjemreiseTso';
import { EndreAktivitetReiseOppstartAvslutningHjemreiseTsr } from './EndreAktivitetReiseOppstartAvslutningHjemreiseTsr';
import { EndreAktivitetReiseTilSamlingTso } from './EndreAktivitetReiseTilSamlingTso';
import { EndreAktivitetReiseTilSamlingTsr } from './EndreAktivitetReiseTilSamlingTsr';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useHentTiltaksvariantValg } from '../../../../hooks/useHentTiltaksvariantValg';
import DataViewer from '../../../../komponenter/DataViewer';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import {
    Aktivitet,
    erAktivitetBoutgifter,
    erAktivitetDagligReiseTso,
    erAktivitetDagligReiseTsr,
    erAktivitetLæremidler,
    erAktivitetPassAvBarn,
    erAktivitetReiseTilSamlingTso,
    erAktivitetReiseTilSamlingTsr,
    erAktivitetReiseOppstartAvslutningHjemreiseTso,
    erAktivitetReiseOppstartAvslutningHjemreiseTsr,
} from '../typer/vilkårperiode/aktivitet';

export const EndreAktivitet: React.FC<{
    aktivitet?: Aktivitet;
    aktivitetFraRegister?: Registeraktivitet;
    avbrytRedigering: () => void;
}> = ({ aktivitet, aktivitetFraRegister, avbrytRedigering }) => {
    const { behandling } = useBehandling();
    const { tiltaksvariantValg } = useHentTiltaksvariantValg(behandling.stønadstype);

    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return (
                <EndreAktivitetPassAvBarn
                    aktivitet={erAktivitetPassAvBarn(aktivitet) ? aktivitet : undefined}
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
        case Stønadstype.LÆREMIDLER:
            return (
                <EndreAktivitetLæremidler
                    aktivitet={erAktivitetLæremidler(aktivitet) ? aktivitet : undefined}
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
        case Stønadstype.BOUTGIFTER:
            return (
                <EndreAktivitetBoutgfiter
                    aktivitet={erAktivitetBoutgifter(aktivitet) ? aktivitet : undefined}
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
        case Stønadstype.DAGLIG_REISE_TSO:
            return (
                <EndreAktivitetDagligReiseTso
                    aktivitet={erAktivitetDagligReiseTso(aktivitet) ? aktivitet : undefined}
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
        case Stønadstype.DAGLIG_REISE_TSR:
            return (
                <DataViewer response={{ tiltaksvariantValg }} type={'tiltaksvariantValg'}>
                    {({ tiltaksvariantValg }) => (
                        <EndreAktivitetDagligReiseTsr
                            aktivitet={erAktivitetDagligReiseTsr(aktivitet) ? aktivitet : undefined}
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
                    aktivitet={erAktivitetReiseTilSamlingTso(aktivitet) ? aktivitet : undefined}
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
        case Stønadstype.REISE_TIL_SAMLING_TSR:
            return (
                <DataViewer response={{ tiltaksvariantValg }} type={'tiltaksvariantValg'}>
                    {({ tiltaksvariantValg }) => (
                        <EndreAktivitetReiseTilSamlingTsr
                            aktivitet={
                                erAktivitetReiseTilSamlingTsr(aktivitet) ? aktivitet : undefined
                            }
                            aktivitetFraRegister={aktivitetFraRegister}
                            avbrytRedigering={avbrytRedigering}
                            tiltaksvariantValg={tiltaksvariantValg}
                        />
                    )}
                </DataViewer>
            );
        case Stønadstype.FLYTTING_TSO:
        case Stønadstype.FLYTTING_TSR:
            return (
                <EndreAktivitetFlytting
                    aktivitet={aktivitet}
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
        case Stønadstype.REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO:
            return (
                <EndreAktivitetReiseOppstartAvslutningHjemreiseTso
                    aktivitet={
                        erAktivitetReiseOppstartAvslutningHjemreiseTso(aktivitet)
                            ? aktivitet
                            : undefined
                    }
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
        case Stønadstype.REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR:
            return (
                <EndreAktivitetReiseOppstartAvslutningHjemreiseTsr
                    aktivitet={
                        erAktivitetReiseOppstartAvslutningHjemreiseTsr(aktivitet)
                            ? aktivitet
                            : undefined
                    }
                    aktivitetFraRegister={aktivitetFraRegister}
                    avbrytRedigering={avbrytRedigering}
                />
            );
    }
};
