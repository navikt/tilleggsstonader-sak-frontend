import React from 'react';

import { HStack, Radio, RadioGroup } from '@navikt/ds-react';

import { EndreAktivitetFormLæremidler } from './EndreAktivitetLæremidler';
import { erUtdanningEllerTiltak } from './utilsLæremidler';
import { AktivitetValidering } from './valideringAktivitetLæremidler';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Studienivå, studienivåTilTekst } from '../typer/vilkårperiode/aktivitetLæremidler';
import { SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';

export const EndreStudienivå: React.FC<{
    form: EndreAktivitetFormLæremidler;
    settStudienivå: (studienivå: Studienivå) => void;
    resettHarRettTilUtstyrsstipendSvar: () => void;
    alleFelterKanEndres: boolean;
    alder?: number;
    settHarRettTilUtstyrsstipend: (svar: SvarJaNei) => void;
    feil?: FormErrors<AktivitetValidering>;
}> = ({ form, settStudienivå, resettHarRettTilUtstyrsstipendSvar, alleFelterKanEndres, feil }) => {
    if (!erUtdanningEllerTiltak(form.type)) {
        return null;
    }

    const brukerHarUtgifter = form.vurderinger.svarHarUtgifter === SvarJaNei.JA;
    if (!brukerHarUtgifter) {
        return null;
    }

    return (
        <RadioGroup
            value={form.studienivå || ''}
            legend="Studienivå"
            readOnly={!alleFelterKanEndres}
            onChange={(e) => {
                settStudienivå(e);
                if (e === Studienivå.HØYERE_UTDANNING) {
                    resettHarRettTilUtstyrsstipendSvar();
                }
            }}
            size="small"
            error={feil?.studienivå}
        >
            <HStack gap="4">
                <Radio value={Studienivå.HØYERE_UTDANNING}>
                    {studienivåTilTekst[Studienivå.HØYERE_UTDANNING]}
                </Radio>
                <Radio value={Studienivå.VIDEREGÅENDE}>
                    {studienivåTilTekst[Studienivå.VIDEREGÅENDE]}
                </Radio>
            </HStack>
        </RadioGroup>
    );
};
