import React, { FC } from 'react';

import { HStack } from '@navikt/ds-react';

import TextField from '../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../utils/fomatering';
import { harTallverdi, tilHeltall } from '../../../../utils/tall';
import { fjernSpaces } from '../../../../utils/utils';
import { BoutgifterEnBolig } from '../../vilkår';

export type BoutgifterEnBoligFeilmeldinger = {
    utgiftHjemsted?: string;
    utgiftAktivitetssted?: string;
};

type Props = {
    utgiftHjemsted: number | undefined;
    utgiftAktivitetssted: number | undefined;
    feilmeldinger: BoutgifterEnBoligFeilmeldinger;
    oppdaterBoutgift: (
        felt: keyof BoutgifterEnBoligFeilmeldinger,
        verdi: number | undefined
    ) => void;
};

type ValideringBoutgifterEnBolig = {
    feilmeldinger: BoutgifterEnBoligFeilmeldinger;
    boutgifterEnBolig?: BoutgifterEnBolig;
};

export function validerBoutgifterEnBolig(input: {
    utgiftHjemsted: number | undefined;
    utgiftAktivitetssted: number | undefined;
}): ValideringBoutgifterEnBolig {
    const feilmeldinger: BoutgifterEnBoligFeilmeldinger = {};
    const validerBeløp = (
        verdi: number | undefined,
        felt: keyof BoutgifterEnBoligFeilmeldinger
    ): void => {
        if (!verdi) {
            feilmeldinger[felt] = 'Du må oppgi boligutgiften';
            return;
        }

        if (!Number.isInteger(verdi) || verdi < 0) {
            feilmeldinger[felt] = 'Beløpet må være større enn 0';
        }
    };

    validerBeløp(input.utgiftHjemsted, 'utgiftHjemsted');
    validerBeløp(input.utgiftAktivitetssted, 'utgiftAktivitetssted');

    if (
        Object.keys(feilmeldinger).length > 0 ||
        input.utgiftHjemsted === undefined ||
        input.utgiftAktivitetssted === undefined
    ) {
        return { feilmeldinger };
    }

    return {
        feilmeldinger,
        boutgifterEnBolig: {
            utgiftHjemsted: input.utgiftHjemsted,
            utgiftAktivitetssted: input.utgiftAktivitetssted,
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
                    value={harTallverdi(utgiftHjemsted) ? utgiftHjemsted : ''}
                    autoComplete="off"
                    inputMode="numeric"
                    required
                    error={feilmeldinger.utgiftHjemsted}
                    onChange={(event) =>
                        oppdaterBoutgift(
                            'utgiftHjemsted',
                            tilHeltall(fjernSpaces(event.target.value))
                        )
                    }
                />
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde $maxWidth={180}>
                <TextField
                    label="Utgift bolig på aktivitetssted pr mnd"
                    size="small"
                    value={harTallverdi(utgiftAktivitetssted) ? utgiftAktivitetssted : ''}
                    autoComplete="off"
                    inputMode="numeric"
                    required
                    error={feilmeldinger.utgiftAktivitetssted}
                    onChange={(event) =>
                        oppdaterBoutgift(
                            'utgiftAktivitetssted',
                            tilHeltall(fjernSpaces(event.target.value))
                        )
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
