import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { Alert, HStack, Select, TextField, VStack } from '@navikt/ds-react';

import { FeilmeldingMaksBredde } from '../../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { formaterIsoPeriode } from '../../../../../../utils/dato';
import { harTallverdi, tilHeltall } from '../../../../../../utils/tall';
import { Toggle } from '../../../../../../utils/toggles';
import { fjernSpaces } from '../../../../../../utils/utils';
import {
    Aktivitet,
    AktivitetTypeTilTekst,
} from '../../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { FaktaDagligReise, FaktaOffentligTransport } from '../../typer/faktaDagligReise';
import { tomtOffentligTransport } from '../utils';
import { FeilmeldingerFaktaOffentligTransport } from '../validering';

interface Props {
    fakta: FaktaOffentligTransport;
    feilmeldinger: FeilmeldingerFaktaOffentligTransport | undefined;
    settFakta: React.Dispatch<React.SetStateAction<FaktaDagligReise>>;
    nullstillFeilOgUlagretkomponent: () => void;
    oppfylteAktiviteter: Aktivitet[];
}

export const EndreFaktaOffentligTransport: React.FC<Props> = ({
    fakta,
    settFakta,
    nullstillFeilOgUlagretkomponent,
    feilmeldinger,
    oppfylteAktiviteter,
}) => {
    const kanKnytteOffentligTransportTilAktivitet = useFlag(
        Toggle.KAN_KNYTTE_OFFENTLIG_TRANSPORT_TIL_AKTIVITET
    );

    const oppdaterFakta = (key: keyof FaktaOffentligTransport, verdi: number | undefined) => {
        settFakta((prevState) => ({
            ...(prevState.type === 'OFFENTLIG_TRANSPORT' ? prevState : tomtOffentligTransport),
            [key]: verdi,
        }));

        nullstillFeilOgUlagretkomponent();
    };

    const oppdaterAktivitet = (aktivitetGlobalId: string) => {
        settFakta((prevState) => ({
            ...(prevState.type === 'OFFENTLIG_TRANSPORT' ? prevState : tomtOffentligTransport),
            aktivitetId: aktivitetGlobalId || undefined,
        }));

        nullstillFeilOgUlagretkomponent();
    };

    return (
        <VStack gap="space-16">
            <HStack gap="space-16" align="start">
                {kanKnytteOffentligTransportTilAktivitet && (
                    <FeilmeldingMaksBredde $maxWidth={300}>
                        <Select
                            label={'Aktivitet'}
                            size="small"
                            error={feilmeldinger?.aktivitet}
                            value={fakta.aktivitetId || ''}
                            onChange={(e) => oppdaterAktivitet(e.target.value)}
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
