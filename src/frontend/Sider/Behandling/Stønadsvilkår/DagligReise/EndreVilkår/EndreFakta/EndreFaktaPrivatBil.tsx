import React, { useEffect } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, HStack, Select, TextField, VStack } from '@navikt/ds-react';

import SmallButton from '../../../../../../komponenter/Knapper/SmallButton';
import { Skillelinje } from '../../../../../../komponenter/Skillelinje';
import DateInputMedLeservisning from '../../../../../../komponenter/Skjema/DateInputMedLeservisning';
import { FeilmeldingMaksBredde } from '../../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { formaterIsoPeriode } from '../../../../../../utils/dato';
import { harTallverdi, tilHeltall } from '../../../../../../utils/tall';
import { Toggle } from '../../../../../../utils/toggles';
import { fjernSpaces } from '../../../../../../utils/utils';
import {
    Aktivitet,
    AktivitetTypeTilTekst,
} from '../../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import {
    FaktaDagligReise,
    FaktaDelperiodePrivatBil,
    FaktaPrivatBil,
} from '../../typer/faktaDagligReise';
import { LeggTilNyPeriodeKnapp } from '../LeggTilNyPeriodeKnapp';
import { defaultPrivatBilPeriode, tomtPrivatBil } from '../utils';
import { FeilmeldingerFaktaPrivatBil } from '../validering';
import styles from './EndreFaktaPrivatBil.module.css';

interface Props {
    fakta: FaktaPrivatBil;
    feilmeldinger: FeilmeldingerFaktaPrivatBil | undefined;
    settFakta: React.Dispatch<React.SetStateAction<FaktaDagligReise>>;
    nullstillFeilOgUlagretkomponent: () => void;
    oppfylteAktiviteter: Aktivitet[];
    reiseFom: string;
    reiseTom: string;
}

export const EndreFaktaPrivatBil: React.FC<Props> = ({
    fakta,
    settFakta,
    feilmeldinger,
    nullstillFeilOgUlagretkomponent,
    oppfylteAktiviteter,
    reiseFom,
    reiseTom,
}) => {
    const kanBehandlePrivatBil = useFlag(Toggle.KAN_BEHANDLE_PRIVAT_BIL);

    useEffect(() => {
        if (fakta.type !== 'PRIVAT_BIL') {
            const privatBilFakta: FaktaPrivatBil = {
                ...tomtPrivatBil,
                faktaDelperioder: oppdaterFørsteFomOgSisteTom(
                    [{ ...defaultPrivatBilPeriode }],
                    reiseFom,
                    reiseTom
                ),
            };
            settFakta(privatBilFakta);
        } else {
            settFakta((prevState) => {
                const privatBilState = prevState as FaktaPrivatBil;
                const nyePerioder = oppdaterFørsteFomOgSisteTom(
                    privatBilState.faktaDelperioder,
                    reiseFom,
                    reiseTom
                );
                return { ...privatBilState, faktaDelperioder: nyePerioder };
            });
        }
    }, [fakta.type, reiseFom, reiseTom, settFakta]);

    if (!kanBehandlePrivatBil) {
        return (
            <BodyShort size="small">
                Vi jobber med å gjøre det mulig å behandle kjøring med privat bil 🚗.
            </BodyShort>
        );
    }

    const oppdaterPeriode = (
        index: number,
        key: keyof FaktaDelperiodePrivatBil,
        verdi: number | string | undefined
    ) => {
        settFakta((prevState) => {
            const privatBilState = prevState as FaktaPrivatBil;
            const nyePerioder = privatBilState.faktaDelperioder.map((p, i) =>
                i === index ? { ...p, [key]: verdi } : p
            );
            return { ...privatBilState, faktaDelperioder: nyePerioder };
        });
        nullstillFeilOgUlagretkomponent();
    };

    const leggTilPeriode = () => {
        settFakta((prevState) => {
            const privatBilState = prevState as FaktaPrivatBil;
            const eksisterendePerioder = privatBilState.faktaDelperioder;
            const forrigeDelperiode = eksisterendePerioder[eksisterendePerioder.length - 1];
            const nyPeriode: FaktaDelperiodePrivatBil = {
                ...defaultPrivatBilPeriode,
                reisedagerPerUke: forrigeDelperiode?.reisedagerPerUke,
                bompengerPerDag: forrigeDelperiode?.bompengerPerDag,
                fergekostnadPerDag: forrigeDelperiode?.fergekostnadPerDag,
            };
            const nyePerioder = oppdaterFørsteFomOgSisteTom(
                [...eksisterendePerioder, nyPeriode],
                reiseFom,
                reiseTom
            );

            return {
                ...privatBilState,
                faktaDelperioder: nyePerioder,
            };
        });
        nullstillFeilOgUlagretkomponent();
    };

    const slettPeriode = (index: number) => {
        settFakta((prevState) => {
            const privatBilState = prevState as FaktaPrivatBil;
            const perioderEtterSlett =
                privatBilState.faktaDelperioder.length > 1
                    ? privatBilState.faktaDelperioder.filter((_, i) => i !== index)
                    : privatBilState.faktaDelperioder;
            const nyePerioder = oppdaterFørsteFomOgSisteTom(perioderEtterSlett, reiseFom, reiseTom);
            return { ...privatBilState, faktaDelperioder: nyePerioder };
        });
        nullstillFeilOgUlagretkomponent();
    };

    const oppdaterFelles = (key: keyof FaktaPrivatBil, verdi: number | string | undefined) => {
        settFakta((prevState) => {
            if (prevState.type !== 'PRIVAT_BIL') return { ...tomtPrivatBil };
            return { ...prevState, [key]: verdi };
        });
        nullstillFeilOgUlagretkomponent();
    };

    const oppdaterAktivitet = (aktivitetGlobalId: string) => {
        const valgtAktivitet = oppfylteAktiviteter.find((a) => a.globalId === aktivitetGlobalId);
        settFakta((prevState) => {
            if (prevState.type !== 'PRIVAT_BIL') return { ...tomtPrivatBil };
            return {
                ...prevState,
                aktivitetId: aktivitetGlobalId || undefined,
                aktivitetType: valgtAktivitet?.type,
            };
        });
        nullstillFeilOgUlagretkomponent();
    };

    return (
        <VStack>
            <Heading size="xsmall" level="4" style={{ marginBottom: '1rem' }}>
                Daglig reise med privat bil
            </Heading>
            {fakta.faktaDelperioder &&
                fakta.faktaDelperioder.length > 0 &&
                fakta.faktaDelperioder.map((periode, index) => {
                    const erFørste = index === 0;
                    const erSiste = index === fakta.faktaDelperioder.length - 1;
                    const readOnlyFom = erFørste && reiseFom !== '';
                    const readOnlyTom = erSiste && reiseTom !== '';

                    return (
                        <HStack gap={'space-16'} key={index}>
                            <FeilmeldingMaksBredde>
                                <DateInputMedLeservisning
                                    key={`fra-${index}-${periode.fom || 'emptyString'}`}
                                    label={erFørste ? 'Fra' : ''}
                                    value={periode.fom}
                                    feil={feilmeldinger?.[index]?.fom}
                                    onChange={(dato) => {
                                        oppdaterPeriode(index, 'fom', dato);
                                    }}
                                    readOnly={readOnlyFom}
                                    className={styles.readOnlyNoIcon}
                                    size="small"
                                />
                            </FeilmeldingMaksBredde>
                            <FeilmeldingMaksBredde>
                                <DateInputMedLeservisning
                                    // Endringen av key tvinger komponenten til en remount når tom settes til '', for å forhindre at den sender gammel state.
                                    key={`til-${index}-${periode.tom || 'tomString'}`}
                                    label={erFørste ? 'Til' : ''}
                                    value={periode.tom}
                                    feil={feilmeldinger?.[index]?.tom}
                                    onChange={(dato) => {
                                        oppdaterPeriode(index, 'tom', dato);
                                    }}
                                    readOnly={readOnlyTom}
                                    size="small"
                                    className={styles.readOnlyNoIcon}
                                />
                            </FeilmeldingMaksBredde>
                            <FeilmeldingMaksBredde $maxWidth={170}>
                                <TextField
                                    label={index === 0 ? 'Reisedager pr uke' : ''}
                                    size="small"
                                    error={feilmeldinger?.[index]?.reisedagerPerUke}
                                    value={
                                        harTallverdi(periode.reisedagerPerUke)
                                            ? periode.reisedagerPerUke
                                            : ''
                                    }
                                    onChange={(e) => {
                                        oppdaterPeriode(
                                            index,
                                            'reisedagerPerUke',
                                            tilHeltall(fjernSpaces(e.target.value))
                                        );
                                    }}
                                />
                            </FeilmeldingMaksBredde>
                            <FeilmeldingMaksBredde $maxWidth={170}>
                                <TextField
                                    label={index === 0 ? 'Bompenger per dag' : ''}
                                    size="small"
                                    error={feilmeldinger?.[index]?.bompengerPerDag}
                                    value={
                                        harTallverdi(periode.bompengerPerDag)
                                            ? periode.bompengerPerDag
                                            : ''
                                    }
                                    onChange={(e) => {
                                        oppdaterPeriode(
                                            index,
                                            'bompengerPerDag',
                                            tilHeltall(fjernSpaces(e.target.value))
                                        );
                                    }}
                                />
                            </FeilmeldingMaksBredde>
                            <FeilmeldingMaksBredde $maxWidth={170}>
                                <TextField
                                    label={index === 0 ? 'Fergekostnad per dag' : ''}
                                    size="small"
                                    error={feilmeldinger?.[index]?.fergePerDag}
                                    value={
                                        harTallverdi(periode.fergekostnadPerDag)
                                            ? periode.fergekostnadPerDag
                                            : ''
                                    }
                                    onChange={(e) => {
                                        oppdaterPeriode(
                                            index,
                                            'fergekostnadPerDag',
                                            tilHeltall(fjernSpaces(e.target.value))
                                        );
                                    }}
                                />
                            </FeilmeldingMaksBredde>
                            <HStack
                                align={'start'}
                                style={{
                                    marginTop: `${index === 0 ? '28px' : '8px'}`,
                                    maxWidth: `${feilmeldinger && '170px'}`,
                                }}
                            >
                                {fakta.faktaDelperioder.length > 1 && (
                                    <SmallButton
                                        type="button"
                                        variant={'tertiary'}
                                        iconPosition={'left'}
                                        icon={<TrashIcon title="Slett periode" />}
                                        onClick={() => slettPeriode(index)}
                                    />
                                )}
                            </HStack>
                        </HStack>
                    );
                })}
            <div style={{ marginTop: '1rem' }}>
                <LeggTilNyPeriodeKnapp
                    onKlikk={leggTilPeriode}
                    feilmelding={undefined}
                    onLukkFeilmelding={() => {}}
                />
            </div>
            <Skillelinje />
            <Heading size="xsmall" level="4">
                Felles for hele perioden
            </Heading>
            <HStack gap="space-16">
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Reiseavstand en vei (km)'}
                        size="small"
                        error={feilmeldinger?.[0]?.reiseavstandEnVei}
                        value={harTallverdi(fakta.reiseavstandEnVei) ? fakta.reiseavstandEnVei : ''}
                        onChange={(e) => {
                            oppdaterFelles(
                                'reiseavstandEnVei',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={300}>
                    <Select
                        label={'Aktivitet'}
                        size="small"
                        error={feilmeldinger?.[0]?.aktivitet}
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

function oppdaterFørsteFomOgSisteTom(
    perioder: FaktaDelperiodePrivatBil[],
    reiseFom: string,
    reiseTom: string
): FaktaDelperiodePrivatBil[] {
    if (perioder.length === 0) return perioder;

    return perioder.map((periode, index) => {
        const erFørste = index === 0;
        const erSiste = index === perioder.length - 1;

        // Første periode får alltid reiseFom
        const nyFom = erFørste ? reiseFom : periode.fom;

        // Siste periode får alltid reiseTom
        // Mellomperioder: hvis fom er tom, sett tom til '', ellers behold tom
        const nyTom = erSiste ? reiseTom : !periode.fom ? '' : periode.tom;

        return {
            ...periode,
            fom: nyFom,
            tom: nyTom,
        };
    });
}
