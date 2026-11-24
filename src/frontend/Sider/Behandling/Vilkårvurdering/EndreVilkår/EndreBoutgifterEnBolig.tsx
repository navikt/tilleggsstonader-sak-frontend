import React, { FC } from 'react';

import { HStack } from '@navikt/ds-react';

import TextField from '../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../utils/fomatering';
import { BoutgifterEnBolig } from '../../vilkår';

export type BoutgifterEnBoligFeilmeldinger = {
    utgiftHjemsted?: string;
    utgiftAktivitetssted?: string;
};

type Props = {
    utgiftHjemsted: string;
    utgiftAktivitetssted: string;
    feilmeldinger: BoutgifterEnBoligFeilmeldinger;
    oppdaterBoutgift: (felt: keyof BoutgifterEnBoligFeilmeldinger, verdi: string) => void;
};

type ValideringBoutgifterEnBolig = {
    feilmeldinger: BoutgifterEnBoligFeilmeldinger;
    boutgifterEnBolig?: BoutgifterEnBolig;
};

export function validerBoutgifterEnBolig(input: {
    utgiftHjemsted: string;
    utgiftAktivitetssted: string;
}): ValideringBoutgifterEnBolig {
    const feilmeldinger: BoutgifterEnBoligFeilmeldinger = {};
    const parseBeløp = (
        verdi: string,
        felt: keyof BoutgifterEnBoligFeilmeldinger
    ): number | undefined => {
        const trimmetVerdi = verdi.trim();
        if (!trimmetVerdi) {
            feilmeldinger[felt] = 'Du må oppgi boligutgiften';
            return undefined;
        }
        if (!/^\d+$/.test(trimmetVerdi)) {
            feilmeldinger[felt] = 'Oppgi beløpet i hele kroner, minst 0';
            return undefined;
        }

        const beløp = Number(trimmetVerdi);
        if (!Number.isInteger(beløp) || beløp < 0 || beløp > 2147483647) {
            feilmeldinger[felt] = 'Beløpet må være positivt';
            return undefined;
        }
        return beløp;
    };

    const hjemsted = parseBeløp(input.utgiftHjemsted, 'utgiftHjemsted');
    const aktivitetssted = parseBeløp(input.utgiftAktivitetssted, 'utgiftAktivitetssted');

    if (
        Object.keys(feilmeldinger).length > 0 ||
        hjemsted === undefined ||
        aktivitetssted === undefined
    ) {
        return { feilmeldinger };
    }

    return {
        feilmeldinger,
        boutgifterEnBolig: {
            utgiftHjemsted: hjemsted,
            utgiftAktivitetssted: aktivitetssted,
        },
    };
}

const EndreBoutgifterEnBolig: FC<Props> = ({
    utgiftHjemsted,
    utgiftAktivitetssted,
    feilmeldinger,
    oppdaterBoutgift,
}) => {
    const validering = validerBoutgifterEnBolig({ utgiftHjemsted, utgiftAktivitetssted });
    const merutgift = validering.boutgifterEnBolig
        ? Math.max(
              0,
              validering.boutgifterEnBolig.utgiftAktivitetssted -
                  validering.boutgifterEnBolig.utgiftHjemsted
          )
        : undefined;

    return (
        <HStack gap="space-16" align="start">
            <FeilmeldingMaksBredde $maxWidth={180}>
                <TextField
                    label="Utgift bolig på hjemsted pr mnd"
                    size="small"
                    value={utgiftHjemsted}
                    autoComplete="off"
                    inputMode="numeric"
                    required
                    error={feilmeldinger.utgiftHjemsted}
                    onChange={(event) => oppdaterBoutgift('utgiftHjemsted', event.target.value)}
                />
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde $maxWidth={180}>
                <TextField
                    label="Utgift bolig på aktivitetssted pr mnd"
                    size="small"
                    value={utgiftAktivitetssted}
                    autoComplete="off"
                    inputMode="numeric"
                    required
                    error={feilmeldinger.utgiftAktivitetssted}
                    onChange={(event) =>
                        oppdaterBoutgift('utgiftAktivitetssted', event.target.value)
                    }
                />
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde $maxWidth={180}>
                <TextField
                    label="Merutgift per måned"
                    size="small"
                    value={
                        merutgift === undefined
                            ? ''
                            : formaterTallMedTusenSkilleEllerStrek(merutgift)
                    }
                    autoComplete="off"
                    inputMode="numeric"
                    readOnly
                />
            </FeilmeldingMaksBredde>
        </HStack>
    );
};

export default EndreBoutgifterEnBolig;
