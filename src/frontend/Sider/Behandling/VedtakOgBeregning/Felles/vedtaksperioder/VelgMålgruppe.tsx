import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { finnFaktiskeMålgruppeValgForStønad } from './vedtaksperiodeUtils';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import SelectMedOptions from '../../../../../komponenter/Skjema/SelectMedOptions';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { Toggle } from '../../../../../utils/toggles';
import { FaktiskMålgruppe, faktiskMålgruppeTilTekst } from '../../../Felles/faktiskMålgruppe';

export const useMålgruppeValg = (stønadstype: Stønadstype) => {
    const kanBrukeAktivitetspenger = useFlag(Toggle.KAN_BRUKE_MÅLGRUPPE_AKTIVITETSPENGER);
    const kanBrukeUngdomsprogrammet = useFlag(Toggle.KAN_BRUKE_MÅLGRUPPE_UNGDOMSPROGRAMMET);

    return finnFaktiskeMålgruppeValgForStønad(stønadstype).filter(({ value }) => {
        if (value === FaktiskMålgruppe.AKTIVITETSPENGER) return kanBrukeAktivitetspenger;
        if (value === FaktiskMålgruppe.UNGDOMSPROGRAMMET) return kanBrukeUngdomsprogrammet;
        return true;
    });
};

interface Props {
    stønadstype: Stønadstype;
    vedtaksperiode: Vedtaksperiode;
    erLesevisning: boolean;
    vedtaksperiodeFeil: FormErrors<Vedtaksperiode> | undefined;
    oppdaterPeriode: (property: 'målgruppeType', value: string | undefined) => void;
}

export const VelgMålgruppe: React.FC<Props> = ({
    stønadstype,
    vedtaksperiode,
    erLesevisning,
    vedtaksperiodeFeil,
    oppdaterPeriode,
}) => {
    const valgForFaktiskMålgruppe = useMålgruppeValg(stønadstype);

    return (
        <FeilmeldingMaksBredde>
            <SelectMedOptions
                label={'Målgruppe'}
                hideLabel
                erLesevisning={erLesevisning}
                value={
                    erLesevisning
                        ? faktiskMålgruppeTilTekst(vedtaksperiode.målgruppeType ?? '')
                        : vedtaksperiode.målgruppeType
                }
                onChange={(e) => oppdaterPeriode('målgruppeType', e.target.value)}
                valg={valgForFaktiskMålgruppe}
                size={'small'}
                error={vedtaksperiodeFeil?.målgruppeType}
            />
        </FeilmeldingMaksBredde>
    );
};
