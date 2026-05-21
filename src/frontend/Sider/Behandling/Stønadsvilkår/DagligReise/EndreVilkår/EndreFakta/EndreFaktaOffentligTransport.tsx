import React from 'react';

import { Alert, HelpText, HStack, Select, TextField, VStack } from '@navikt/ds-react';

import styles from './EndreFaktaOffentligTransport.module.css';
import { FeilmeldingMaksBredde } from '../../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Kodeverk } from '../../../../../../typer/kodeverk';
import { harTallverdi, tilHeltall } from '../../../../../../utils/tall';
import { fjernSpaces } from '../../../../../../utils/utils';
import { FaktaDagligReise, FaktaOffentligTransport } from '../../typer/faktaDagligReise';
import { tomtOffentligTransport } from '../utils';
import { FeilmeldingerFaktaOffentligTransport } from '../validering';

interface Props {
    fakta: FaktaOffentligTransport;
    feilmeldinger: FeilmeldingerFaktaOffentligTransport | undefined;
    settFakta: React.Dispatch<React.SetStateAction<FaktaDagligReise>>;
    nullstillFeilOgUlagretkomponent: () => void;
    gjelderTsr: boolean;
    tilgjengeligeTypeAktiviteter: Kodeverk[];
}

export const EndreFaktaOffentligTransport: React.FC<Props> = ({
    fakta,
    settFakta,
    nullstillFeilOgUlagretkomponent,
    feilmeldinger,
    gjelderTsr,
    tilgjengeligeTypeAktiviteter,
}) => {
    const oppdaterFakta = (key: keyof FaktaOffentligTransport, verdi: number | undefined) => {
        settFakta((prevState) => ({
            ...(prevState.type === 'OFFENTLIG_TRANSPORT' ? prevState : tomtOffentligTransport),
            [key]: verdi,
        }));

        nullstillFeilOgUlagretkomponent();
    };

    const oppdaterTypeAktivitet = (kode: string) => {
        settFakta((prevState) => ({
            ...(prevState.type === 'OFFENTLIG_TRANSPORT' ? prevState : tomtOffentligTransport),
            typeAktivitet: kode || undefined,
        }));

        nullstillFeilOgUlagretkomponent();
    };

    return (
        <VStack gap="space-16">
            <HStack gap="space-16" align="start">
                {gjelderTsr && (
                    <FeilmeldingMaksBredde $maxWidth={180}>
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
                            className={styles.wideSelect}
                            error={feilmeldinger?.aktivitet}
                            value={fakta.typeAktivitet || ''}
                            onChange={(e) => oppdaterTypeAktivitet(e.target.value)}
                        >
                            <option value="">Velg aktivitet</option>
                            {tilgjengeligeTypeAktiviteter.map((valg) => (
                                <option key={valg.kode} value={valg.kode}>
                                    {valg.beskrivelse}
                                </option>
                            ))}
                        </Select>
                    </FeilmeldingMaksBredde>
                )}
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Reisedager pr uke'}
                        size="small"
                        error={feilmeldinger?.reisedagerPerUke}
                        value={harTallverdi(fakta.reisedagerPerUke) ? fakta.reisedagerPerUke : ''}
                        onChange={(e) => {
                            oppdaterFakta(
                                'reisedagerPerUke',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Pris enkeltbillett'}
                        size="small"
                        error={feilmeldinger?.enkeltbillett}
                        value={harTallverdi(fakta?.prisEnkelbillett) ? fakta.prisEnkelbillett : ''}
                        onChange={(e) => {
                            oppdaterFakta(
                                'prisEnkelbillett',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Pris 7-dagersbillett'}
                        size="small"
                        error={feilmeldinger?.syvdagersbillett}
                        value={
                            harTallverdi(fakta.prisSyvdagersbillett)
                                ? fakta.prisSyvdagersbillett
                                : ''
                        }
                        onChange={(e) => {
                            oppdaterFakta(
                                'prisSyvdagersbillett',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Pris 30-dagersbillett'}
                        size="small"
                        error={feilmeldinger?.trettidagersbillett}
                        value={
                            harTallverdi(fakta.prisTrettidagersbillett)
                                ? fakta.prisTrettidagersbillett
                                : ''
                        }
                        onChange={(e) => {
                            oppdaterFakta(
                                'prisTrettidagersbillett',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
            </HStack>
            {feilmeldinger?.felles && (
                <Alert variant="error" size="small">
                    {feilmeldinger.felles}
                </Alert>
            )}
        </VStack>
    );
};
