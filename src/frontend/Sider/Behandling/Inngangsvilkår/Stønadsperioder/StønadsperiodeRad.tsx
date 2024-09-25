import React from 'react';

import { useBehandling } from '../../../../context/BehandlingContext';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { SøppelbøtteKnapp } from '../../../../komponenter/Knapper/SøppelbøtteKnapp';
import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
import SelectMedOptions from '../../../../komponenter/Skjema/SelectMedOptions';
import { aktivitetTypeOptionsForStønadsperiode, aktivitetTypeTilTekst } from '../typer/aktivitet';
import { målgruppeTypeOptionsForStønadsperiode, målgruppeTypeTilTekst } from '../typer/målgruppe';
import { Stønadsperiode } from '../typer/stønadsperiode';

interface Props {
    stønadsperide: Stønadsperiode;
    feilmeldinger: FormErrors<Stønadsperiode>;
    oppdaterStønadsperiode: (property: keyof Stønadsperiode, value: string | undefined) => void;
    slettPeriode: () => void;
    erLeservisning: boolean;
}

const StønadsperiodeRad: React.FC<Props> = ({
    stønadsperide,
    feilmeldinger,
    oppdaterStønadsperiode,
    slettPeriode,
    erLeservisning,
}) => {
    const { kanKunEndreTomForPeriode, periodenErLåstForEndring } = useBehandling();

    const finnFeilmelding = (property: keyof Stønadsperiode) =>
        feilmeldinger && feilmeldinger[property];

    const kanKunEndreTom = kanKunEndreTomForPeriode(stønadsperide.fom, stønadsperide.tom);
    const helePeriodenErLåst = periodenErLåstForEndring(stønadsperide.tom);
    const nyRadLeggesTil = !stønadsperide.id;

    const readOnly = !nyRadLeggesTil && (kanKunEndreTom || helePeriodenErLåst);

    return (
        <>
            <SelectMedOptions
                className="kolonne1"
                erLesevisning={erLeservisning}
                valg={aktivitetTypeOptionsForStønadsperiode}
                label={'Aktivitet'}
                hideLabel
                readOnly={readOnly}
                value={
                    erLeservisning
                        ? aktivitetTypeTilTekst(stønadsperide.aktivitet)
                        : stønadsperide.aktivitet
                }
                onChange={(e) => oppdaterStønadsperiode('aktivitet', e.target.value)}
                size="small"
                error={finnFeilmelding('aktivitet')}
            />
            <SelectMedOptions
                erLesevisning={erLeservisning}
                valg={målgruppeTypeOptionsForStønadsperiode}
                label={'Målgruppe'}
                hideLabel
                readOnly={readOnly}
                value={
                    erLeservisning
                        ? målgruppeTypeTilTekst(stønadsperide.målgruppe)
                        : stønadsperide.målgruppe
                }
                onChange={(e) => oppdaterStønadsperiode('målgruppe', e.target.value)}
                size="small"
                error={finnFeilmelding('målgruppe')}
            />

            <DateInputMedLeservisning
                erLesevisning={erLeservisning}
                label={'Fra'}
                hideLabel
                value={stønadsperide.fom}
                readOnly={readOnly}
                onChange={(dato) => oppdaterStønadsperiode('fom', dato || '')}
                size="small"
                feil={finnFeilmelding('fom')}
            />
            <DateInputMedLeservisning
                erLesevisning={erLeservisning}
                label={'Til'}
                hideLabel
                value={stønadsperide.tom}
                readOnly={!nyRadLeggesTil && helePeriodenErLåst}
                onChange={(dato) => oppdaterStønadsperiode('tom', dato || '')}
                size="small"
                feil={finnFeilmelding('tom')}
            />
            {!erLeservisning && !helePeriodenErLåst && (
                <SøppelbøtteKnapp onClick={slettPeriode} size="xsmall" type="button" />
            )}
        </>
    );
};

export default StønadsperiodeRad;
