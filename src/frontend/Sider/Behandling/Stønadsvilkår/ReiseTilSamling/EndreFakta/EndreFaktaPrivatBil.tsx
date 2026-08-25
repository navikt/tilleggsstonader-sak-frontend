import React from 'react';

import { Select, VStack, HStack } from '@navikt/ds-react';

import TextField from '../../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { harTallverdi, tilTallverdi } from '../../../../../utils/tall';
import { fjernSpaces } from '../../../../../utils/utils';
import {
    Aktivitet,
    AktivitetTypeTilTekst,
} from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { tomtPrivatBil } from '../EndreVilkår/utils';
import { FeilmeldingerFaktaPrivatBil } from '../EndreVilkår/validering';
import { FaktaPrivatBil, FaktaReiseTilSamling } from '../typer/faktaReiseTilSamling';

export const EndreFaktaPrivatBil: React.FC<{
    fakta: FaktaPrivatBil;
    settFakta: React.Dispatch<React.SetStateAction<FaktaReiseTilSamling>>;
    nullstillFeilOgUlagretkomponent: () => void;
    feilmeldinger: FeilmeldingerFaktaPrivatBil | undefined;
    oppfylteAktiviteter: Aktivitet[];
}> = ({
    fakta,
    nullstillFeilOgUlagretkomponent,
    settFakta,
    feilmeldinger,
    oppfylteAktiviteter,
}) => {
    const oppdaterFakta = (key: keyof FaktaPrivatBil, verdi: number | string | undefined) => {
        settFakta((prevState) => ({
            ...(prevState.type === 'PRIVAT_BIL' ? prevState : tomtPrivatBil),
            [key]: verdi,
        }));

        nullstillFeilOgUlagretkomponent();
    };

    const oppdaterAktivitet = (aktivitetGlobalId: string) => {
        const valgtAktivitet = oppfylteAktiviteter.find((a) => a.globalId === aktivitetGlobalId);
        settFakta((prevState) => ({
            ...(prevState.type === 'PRIVAT_BIL' ? prevState : tomtPrivatBil),
            aktivitetId: aktivitetGlobalId || undefined,
            aktivitetType: valgtAktivitet?.type,
        }));
        nullstillFeilOgUlagretkomponent();
    };

    return (
        <VStack gap="space-16">
            <HStack gap="space-16" align="start">
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Totalt reiseavstand i km'}
                        size="small"
                        error={feilmeldinger?.reiseavstand}
                        value={harTallverdi(fakta.reiseavstand) ? fakta.reiseavstand : ''}
                        onChange={(e) => {
                            oppdaterFakta(
                                'reiseavstand',
                                tilTallverdi(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={300}>
                    <Select
                        label={'Aktivitet'}
                        size="small"
                        error={feilmeldinger?.aktivitet}
                        value={fakta.aktivitetId || ''}
                        onChange={(e) => {
                            oppdaterAktivitet(e.target.value);
                        }}
                    >
                        <option value="">Velg aktivitet</option>
                        {oppfylteAktiviteter.map((aktivitet) => (
                            <option key={aktivitet.globalId} value={aktivitet.globalId}>
                                {AktivitetTypeTilTekst[aktivitet.type]} (
                                {formaterIsoPeriode(aktivitet.fom, aktivitet.tom)})
                            </option>
                        ))}
                    </Select>
                </FeilmeldingMaksBredde>
            </HStack>
        </VStack>
    );
};
