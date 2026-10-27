import React from 'react';

import { Select, VStack, HStack } from '@navikt/ds-react';

import { SpesifikasjonAvUtgift } from './SpesifikasjonAvUtgift';
import { Skillelinje } from '../../../../../komponenter/Skillelinje';
import TextField from '../../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { NødvendigUtgift } from '../../../../../typer/nødvendigUtgift';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { harTallverdi, tilTallverdi } from '../../../../../utils/tall';
import { fjernSpaces } from '../../../../../utils/utils';
import {
    Aktivitet,
    AktivitetTypeTilTekst,
} from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { NødvendigUtgiftFelt } from '../../Felles/EndreFakta/NødvendigUtgiftFelt';
import { tomtPrivatBil } from '../EndreVilkår/utils';
import { FeilmeldingerFaktaPrivatBil } from '../EndreVilkår/validering';
import {
    erFaktaPrivatBil,
    FaktaPrivatBil,
    FaktaReiseTilSamling,
} from '../typer/faktaReiseTilSamling';

export const EndreFaktaPrivatBil: React.FC<{
    fakta: FaktaPrivatBil;
    settFakta: React.Dispatch<React.SetStateAction<FaktaReiseTilSamling>>;
    nullstillFeilOgUlagretkomponent: () => void;
    feilmeldinger: FeilmeldingerFaktaPrivatBil | undefined;
    oppfylteAktiviteter: Aktivitet[];
    gjelderTsr: boolean;
}> = ({
    fakta,
    nullstillFeilOgUlagretkomponent,
    settFakta,
    feilmeldinger,
    oppfylteAktiviteter,
    gjelderTsr,
}) => {
    const oppdaterFakta = (
        key: keyof FaktaPrivatBil,
        verdi: number | string | NødvendigUtgift | undefined
    ) => {
        settFakta((prevState) => ({
            ...(erFaktaPrivatBil(prevState) ? prevState : tomtPrivatBil),
            [key]: verdi,
        }));

        nullstillFeilOgUlagretkomponent();
    };

    const oppdaterAktivitet = (aktivitetGlobalId: string) => {
        const valgtAktivitet = oppfylteAktiviteter.find((a) => a.globalId === aktivitetGlobalId);
        if (!valgtAktivitet) {
            return;
        }

        settFakta((prevState) => ({
            ...(erFaktaPrivatBil(prevState) ? prevState : tomtPrivatBil),
            aktivitet: {
                aktivitetId: valgtAktivitet.globalId,
                aktivitetType: valgtAktivitet.type,
                fom: valgtAktivitet.fom,
                tom: valgtAktivitet.tom,
            },
        }));

        nullstillFeilOgUlagretkomponent();
    };

    return (
        <VStack gap="space-16">
            <NødvendigUtgiftFelt
                nødvendigUtgift={fakta.nødvendigUtgift}
                feilNødvendigUtgift={feilmeldinger?.nødvendigUtgift}
                feilBegrunnelse={feilmeldinger?.begrunnelseNødvendigUtgift}
                beskrivelse="Vurder om den oppgitte utgiften er på et rimelig nivå for å få gjennomført reisen."
                oppdaterFakta={(nødvendigUtgift) =>
                    oppdaterFakta('nødvendigUtgift', nødvendigUtgift)
                }
            />
            <Skillelinje />
            <FeilmeldingMaksBredde $maxWidth={300}>
                <SpesifikasjonAvUtgift
                    value={fakta.begrunnelse || ''}
                    error={feilmeldinger?.spesifikasjonAvUtgift}
                    onChange={(value) => oppdaterFakta('begrunnelse', value || undefined)}
                    pakrevd={false}
                />
            </FeilmeldingMaksBredde>
            <HStack gap="space-16" align="start">
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Samlet kjøreavstand tur/retur i km'}
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
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Bompenger'}
                        size="small"
                        error={feilmeldinger?.bompenger}
                        value={harTallverdi(fakta.bompenger) ? fakta.bompenger : ''}
                        onChange={(e) => {
                            oppdaterFakta('bompenger', tilTallverdi(fjernSpaces(e.target.value)));
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Fergekostnad'}
                        size="small"
                        error={feilmeldinger?.fergekostnad}
                        value={harTallverdi(fakta.fergekostnad) ? fakta.fergekostnad : ''}
                        onChange={(e) => {
                            oppdaterFakta(
                                'fergekostnad',
                                tilTallverdi(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Parkering'}
                        size="small"
                        error={feilmeldinger?.parkering}
                        value={harTallverdi(fakta.parkering) ? fakta.parkering : ''}
                        onChange={(e) => {
                            oppdaterFakta('parkering', tilTallverdi(fjernSpaces(e.target.value)));
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Piggdekkavgift'}
                        size="small"
                        error={feilmeldinger?.piggdekkavgift}
                        value={harTallverdi(fakta.piggdekkavgift) ? fakta.piggdekkavgift : ''}
                        onChange={(e) => {
                            oppdaterFakta(
                                'piggdekkavgift',
                                tilTallverdi(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
            </HStack>

            {gjelderTsr && (
                <FeilmeldingMaksBredde $maxWidth={300} style={{ maxWidth: 'fit-content' }}>
                    <Select
                        label={'Aktivitet'}
                        size="small"
                        error={feilmeldinger?.aktivitet}
                        value={fakta.aktivitet?.aktivitetId || ''}
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
        </VStack>
    );
};
