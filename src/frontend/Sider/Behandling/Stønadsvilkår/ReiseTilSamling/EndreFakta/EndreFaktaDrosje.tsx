import React from 'react';

import { Select, VStack, HStack } from '@navikt/ds-react';

import { SpesifikasjonAvUtgift } from './SpesifikasjonAvUtgift';
import { Skillelinje } from '../../../../../komponenter/Skillelinje';
import TextField from '../../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { NødvendigUtgift } from '../../../../../typer/nødvendigUtgift';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { harTallverdi, tilHeltall } from '../../../../../utils/tall';
import { fjernSpaces } from '../../../../../utils/utils';
import {
    Aktivitet,
    AktivitetTypeTilTekst,
} from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { NødvendigUtgiftFelt } from '../../Felles/EndreFakta/NødvendigUtgiftFelt';
import { tomtDrosje } from '../EndreVilkår/utils';
import { FeilmeldingerFaktaDrosje } from '../EndreVilkår/validering';
import { erFaktaDrosje, FaktaDrosje, FaktaReiseTilSamling } from '../typer/faktaReiseTilSamling';

export const EndreFaktaDrosje: React.FC<{
    fakta: FaktaDrosje;
    settFakta: React.Dispatch<React.SetStateAction<FaktaReiseTilSamling>>;
    nullstillFeilOgUlagretkomponent: () => void;
    feilmeldinger: FeilmeldingerFaktaDrosje | undefined;
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
    const oppdaterFakta = (
        key: keyof FaktaDrosje,
        verdi: number | string | NødvendigUtgift | undefined
    ) => {
        settFakta((prevState) => ({
            ...(erFaktaDrosje(prevState) ? prevState : tomtDrosje),
            [key]: verdi,
        }));
        nullstillFeilOgUlagretkomponent();
    };

    const oppdaterAktivitet = (aktivitetGlobalId: string) => {
        const aktivitet = oppfylteAktiviteter.find((a) => a.globalId === aktivitetGlobalId);
        if (!aktivitet) return;

        settFakta((prevState) => ({
            ...(erFaktaDrosje(prevState) ? prevState : tomtDrosje),
            aktivitet: {
                aktivitetId: aktivitet.globalId,
                aktivitetType: aktivitet.type,
                fom: aktivitet.fom,
                tom: aktivitet.tom,
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
            <HStack gap="space-16" align="start">
                {gjelderTsr && (
                    <FeilmeldingMaksBredde $maxWidth={300}>
                        <Select
                            label="Aktivitet"
                            size="small"
                            error={feilmeldinger?.aktivitet}
                            value={fakta.aktivitet?.aktivitetId || ''}
                            onChange={(event) => {
                                oppdaterAktivitet(event.target.value);
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
                        label="Utgifter til drosje"
                        size="small"
                        error={feilmeldinger?.utgifterDrosje}
                        value={harTallverdi(fakta.utgifterDrosje) ? fakta.utgifterDrosje : ''}
                        onChange={(event) => {
                            oppdaterFakta(
                                'utgifterDrosje',
                                tilHeltall(fjernSpaces(event.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
            </HStack>
            <FeilmeldingMaksBredde $maxWidth={300}>
                <SpesifikasjonAvUtgift
                    value={fakta.begrunnelse || ''}
                    error={feilmeldinger?.spesifikasjonAvUtgift}
                    onChange={(value) => oppdaterFakta('begrunnelse', value || undefined)}
                    pakrevd={true}
                    beskrivelse="Spesifikasjonen vil komme med i vedtaksbrevet, fatt deg i korthet"
                />
            </FeilmeldingMaksBredde>
        </VStack>
    );
};
