import React from 'react';

import { HelpText, HStack, Select, VStack } from '@navikt/ds-react';

import TextField from '../../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Kodeverk } from '../../../../../typer/kodeverk';
import { harTallverdi, tilHeltall } from '../../../../../utils/tall';
import { fjernSpaces } from '../../../../../utils/utils';
import { tomtOffentligTransport } from '../EndreVilkår/utils';
import { FeilmeldingerFaktaOffentligTransport } from '../EndreVilkår/validering';
import { FaktaOffentligTransport, FaktaReiseTilSamling } from '../typer/faktaReiseTilSamling';

export const EndreFaktaOffentligTransport: React.FC<{
    fakta: FaktaOffentligTransport;
    settFakta: React.Dispatch<React.SetStateAction<FaktaReiseTilSamling>>;
    nullstillFeilOgUlagretkomponent: () => void;
    feilmeldinger: FeilmeldingerFaktaOffentligTransport | undefined;
    gjelderTsr: boolean;
    tilgjengeligeTiltaksvarianter: Kodeverk[];
}> = ({
    fakta,
    nullstillFeilOgUlagretkomponent,
    settFakta,
    feilmeldinger,
    gjelderTsr,
    tilgjengeligeTiltaksvarianter,
}) => {
    const oppdaterFakta = (key: keyof FaktaOffentligTransport, verdi: number | undefined) => {
        settFakta((prevState) => ({
            ...(prevState.type === 'OFFENTLIG_TRANSPORT' ? prevState : tomtOffentligTransport),
            [key]: verdi,
        }));

        nullstillFeilOgUlagretkomponent();
    };

    const oppdaterTiltaksvariant = (kode: string) => {
        settFakta((prevState) => ({
            ...(prevState.type === 'OFFENTLIG_TRANSPORT' ? prevState : tomtOffentligTransport),
            tiltaksvariant: kode || undefined,
        }));

        nullstillFeilOgUlagretkomponent();
    };

    return (
        <VStack gap="space-16">
            <HStack gap="space-16" align="start">
                {gjelderTsr && (
                    <FeilmeldingMaksBredde $maxWidth={220}>
                        <Select
                            label={
                                <HStack gap="space-4" align="center">
                                    <span>Tiltaksvariant</span>
                                    <HelpText>
                                        Velg tiltaksvarianten bruker skal reise med offentlig
                                        transport til. Dette er for at TS-sak skal kunne knytte
                                        utbetalinger til riktig konto.
                                    </HelpText>
                                </HStack>
                            }
                            size="small"
                            error={feilmeldinger?.aktivitet}
                            value={fakta.tiltaksvariant || ''}
                            onChange={(e) => oppdaterTiltaksvariant(e.target.value)}
                        >
                            <option value="">Velg aktivitet</option>
                            {tilgjengeligeTiltaksvarianter.map((valg) => (
                                <option key={valg.kode} value={valg.kode}>
                                    {valg.beskrivelse}
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
