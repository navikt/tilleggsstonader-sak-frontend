import React from 'react';

import { Select, VStack, HStack } from '@navikt/ds-react';

import TextField from '../../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { harTallverdi, tilHeltall } from '../../../../../utils/tall';
import { fjernSpaces } from '../../../../../utils/utils';
import {
    Aktivitet,
    AktivitetTypeTilTekst,
} from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { tomtOffentligTransport } from '../EndreVilkår/utils';
import { FeilmeldingerFaktaOffentligTransport } from '../EndreVilkår/validering';
import { FaktaOffentligTransport, FaktaReiseTilSamling } from '../typer/faktaReiseTilSamling';

export const EndreFaktaOffentligTransport: React.FC<{
    fakta: FaktaOffentligTransport;
    settFakta: React.Dispatch<React.SetStateAction<FaktaReiseTilSamling>>;
    nullstillFeilOgUlagretkomponent: () => void;
    feilmeldinger: FeilmeldingerFaktaOffentligTransport | undefined;
    gjelderTsr: boolean;
    oppfylteAktiviteter: Aktivitet[];
}> = ({
    fakta,
    nullstillFeilOgUlagretkomponent,
    settFakta,
    feilmeldinger,
    gjelderTsr,
    oppfylteAktiviteter,
}) => {
    const oppdaterFakta = (key: keyof FaktaOffentligTransport, verdi: number | undefined) => {
        settFakta((prevState) => ({
            ...(prevState.type === 'OFFENTLIG_TRANSPORT' ? prevState : tomtOffentligTransport),
            [key]: verdi,
        }));

        nullstillFeilOgUlagretkomponent();
    };

    const oppdaterAktivitet = (aktivitetGlobalId: string) => {
        const valgtAktivitet = oppfylteAktiviteter.find((a) => a.globalId === aktivitetGlobalId);
        settFakta((prevState) => ({
            ...(prevState.type === 'OFFENTLIG_TRANSPORT' ? prevState : tomtOffentligTransport),
            aktivitetId: aktivitetGlobalId || undefined,
            aktivitetType: valgtAktivitet?.type,
        }));
        nullstillFeilOgUlagretkomponent();
    };

    return (
        <VStack gap="space-16">
            <HStack gap="space-16" align="start">
                {gjelderTsr && (
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
                )}
                <FeilmeldingMaksBredde $maxWidth={220}>
                    <TextField
                        label={'Utgifter til offentlig transport'}
                        size="small"
                        error={feilmeldinger?.utgifterOffentligTransport}
                        value={
                            harTallverdi(fakta.utgifterOffentligTransport)
                                ? fakta.utgifterOffentligTransport
                                : ''
                        }
                        onChange={(e) => {
                            oppdaterFakta(
                                'utgifterOffentligTransport',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
            </HStack>
        </VStack>
    );
};
