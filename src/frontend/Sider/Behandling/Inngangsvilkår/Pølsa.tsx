import React, { useMemo } from 'react';

import { Periode, Tidslinje } from '@navikt/familie-tidslinje';

import { Aktivitet, AktivitetType } from './typer/aktivitet';
import { Målgruppe, MålgruppeType } from './typer/målgruppe';
import { useInngangsvilkår } from '../../../context/InngangsvilkårContext';

type Status = 'suksess' | 'feil' | 'advarsel' | 'inaktiv' | 'ukjent';
const tilPeriode = (periode: Målgruppe | Aktivitet, status: Status, valgdId?: string) => ({
    id: periode.id,
    fom: new Date(`${periode.fom}T00:00:00.000Z`),
    tom: new Date(`${periode.tom}T00:00:00.000Z`),
    infoPin: false,
    status: status,
    active: periode.id === valgdId,
    children: <>{periode.type}</>,
});
const grupper = <T extends Målgruppe | Aktivitet>(
    perioder: T[],
    status: Status,
    valgdId?: string
): Periode[][] =>
    Object.values(
        perioder.reduce(
            (prev, curr) => ({
                ...prev,
                [curr.type]: [...(prev[curr.type] || []), tilPeriode(curr, status, valgdId)],
            }),
            {} as { [key in MålgruppeType | AktivitetType]: Periode[] }
        )
    );

const Pølsa: React.FC = () => {
    const { målgrupper, aktiviteter, velgKombinasjon, settVelgKombinasjon } = useInngangsvilkår();

    const perioder = useMemo(() => {
        const målgrupperader = grupper(målgrupper, 'suksess', velgKombinasjon?.målgruppeId);
        const aktivitetrader = grupper(aktiviteter, 'feil', velgKombinasjon?.aktivitetId);
        return [...målgrupperader, ...aktivitetrader];
    }, [målgrupper, aktiviteter, velgKombinasjon]);
    const velgPeriode = (periode: Periode) => {
        settVelgKombinasjon((prevState) => ({
            ...prevState,
            [målgrupper.find((m) => m.id == periode.id) ? 'målgruppeId' : 'aktivitetId']:
                periode.id,
        }));
    };
    return (
        <>
            <Tidslinje
                rader={perioder}
                kompakt={true}
                onSelectPeriode={velgKombinasjon && velgPeriode}
            />
        </>
    );
};

export default Pølsa;
