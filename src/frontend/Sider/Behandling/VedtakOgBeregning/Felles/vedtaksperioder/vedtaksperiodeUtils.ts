import { v4 as uuidv4 } from 'uuid';

import { SelectOption } from '../../../../../komponenter/Skjema/SelectMedOptions';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import {
    FaktiskMålgruppeTilTekst,
    faktiskeMålgrupperForStønad,
} from '../../../Felles/faktiskMålgruppe';

export const initialiserVedtaksperioder = (
    vedtaksperioder: Vedtaksperiode[] | undefined
): Vedtaksperiode[] => {
    return vedtaksperioder?.length ? vedtaksperioder : [];
};

export const tomVedtaksperiode = (): Vedtaksperiode => ({
    fom: '',
    tom: '',
    målgruppeType: '',
    aktivitetType: '',
    id: uuidv4(),
});

// Brukes for å kun få relevante valg for faktisk målgruppe når man lager vedtaksperioder
export const finnFaktiskeMålgruppeValgForStønad = (stønadstype: Stønadstype): SelectOption[] => {
    const relevateFaktiskeMålgrupper = faktiskeMålgrupperForStønad[stønadstype];

    return relevateFaktiskeMålgrupper.map((faktiskMålgruppe) => ({
        value: faktiskMålgruppe,
        label: FaktiskMålgruppeTilTekst[faktiskMålgruppe],
    }));
};
