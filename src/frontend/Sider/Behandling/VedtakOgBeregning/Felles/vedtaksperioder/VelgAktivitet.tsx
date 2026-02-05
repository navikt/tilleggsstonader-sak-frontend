import React from 'react';

import { FormErrors } from '../../../../../hooks/felles/useFormState';
import SelectMedOptions from '../../../../../komponenter/Skjema/SelectMedOptions';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import {
    aktivitetTypeTilTekst,
    valgbareAktivitetTyperForVedtaksperiode,
} from '../../../Inngangsvilkår/Aktivitet/utilsAktivitet';

interface Props {
    stønadstype: Stønadstype;
    vedtaksperiode: Vedtaksperiode;
    erLesevisning: boolean;
    vedtaksperiodeFeil: FormErrors<Vedtaksperiode> | undefined;
    oppdaterPeriode: (property: 'aktivitetType', value: string | undefined) => void;
}

export const VelgAktivitet: React.FC<Props> = ({
    stønadstype,
    vedtaksperiode,
    erLesevisning,
    vedtaksperiodeFeil,
    oppdaterPeriode,
}) => {
    const valgbareAktiviteter = valgbareAktivitetTyperForVedtaksperiode(stønadstype);

    return (
        <FeilmeldingMaksBredde>
            <SelectMedOptions
                label={'Aktivitet'}
                hideLabel
                erLesevisning={erLesevisning}
                value={
                    erLesevisning
                        ? aktivitetTypeTilTekst(vedtaksperiode.aktivitetType ?? '')
                        : vedtaksperiode.aktivitetType
                }
                onChange={(e) => oppdaterPeriode('aktivitetType', e.target.value)}
                valg={valgbareAktiviteter}
                size={'small'}
                error={vedtaksperiodeFeil?.aktivitetType}
            />
        </FeilmeldingMaksBredde>
    );
};
