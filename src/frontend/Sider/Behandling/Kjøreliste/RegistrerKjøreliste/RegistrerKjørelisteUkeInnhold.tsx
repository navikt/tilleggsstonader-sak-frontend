import React, { FC, useState } from 'react';

import { PencilIcon, PencilWritingIcon, SackKronerIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Label, Textarea, VStack } from '@navikt/ds-react';

import { RegistrerKjørelisteDagInfo } from './RegistrerKjørelisteDagInfo';
import { useSteg } from '../../../../context/StegContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { Feil, feiletRessursTilFeilmelding } from '../../../../komponenter/Feil/feilmeldingUtils';
import { Skillelinje } from '../../../../komponenter/Skillelinje';
import {
    Dag,
    RegistrertKjørtDagRequest,
    RegistrertKjørtUke,
    RegistrertKjørtUkePostRequest,
    RegistrertKjørtUkePutRequest,
    UkeVurdering,
} from '../../../../typer/kjøreliste';
import { erFeilressurs } from '../../../../typer/ressurs';
import { Ressurs } from '../../../../typer/ressurs';
import { RammeForReiseMedPrivatBilDelperiode } from '../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoDato, ukedagTilKortNorsk } from '../../../../utils/dato';
import { kronerEllerStrek } from '../../../../utils/tekstformatering';
import styles from '../Reisevurdering/UkeInnhold.module.css';

function tilRedigerbareDager(
    dager: Dag[],
    registrertKjørtUke: RegistrertKjørtUke | undefined
): RegistrertKjørtDagRequest[] {
    return dager
        .filter((d) => !d.erDagSlettet)
        .map((d) => {
            const registrert = registrertKjørtUke?.dager.find((r) => r.dato === d.dato);
            return {
                dato: d.dato,
                harKjørt: registrert?.harKjørt ?? false,
                parkeringsutgift: registrert?.parkeringsutgift,
            };
        });
}

export const RegistrerKjørelisteUkeInnhold: FC<{
    uke: UkeVurdering;
    delperiodeForUke: RammeForReiseMedPrivatBilDelperiode;
    utbetaltePerioder: boolean | string | undefined;
    reiseId: string;
    registrertKjørtUke: RegistrertKjørtUke | undefined;
    lagreRegistrertUke: (
        req: RegistrertKjørtUkePostRequest
    ) => Promise<Ressurs<RegistrertKjørtUke>>;
    oppdaterRegistrertUke: (
        ukeId: string,
        req: RegistrertKjørtUkePutRequest
    ) => Promise<Ressurs<RegistrertKjørtUke>>;
    redigerer: boolean;
    settRedigerer: (b: boolean) => void;
}> = ({
    uke,
    delperiodeForUke,
    utbetaltePerioder,
    reiseId,
    registrertKjørtUke,
    lagreRegistrertUke,
    oppdaterRegistrertUke,
    redigerer,
    settRedigerer,
}) => {
    const { erStegRedigerbart } = useSteg();

    const [redigerbareDager, settRedigerbareDager] = useState<RegistrertKjørtDagRequest[]>(() =>
        tilRedigerbareDager(uke.dager, registrertKjørtUke)
    );
    const [begrunnelse, settBegrunnelse] = useState<string>(registrertKjørtUke?.begrunnelse ?? '');
    const [feilVedLagring, settFeilVedLagring] = useState<Feil | undefined>(undefined);
    const [lagrer, settLagrer] = useState(false);

    const oppdaterDag = (oppdatertDag: RegistrertKjørtDagRequest) => {
        settRedigerbareDager((prev) =>
            prev.map((d) => (d.dato === oppdatertDag.dato ? oppdatertDag : d))
        );
    };

    const avbryt = () => {
        settRedigerbareDager(tilRedigerbareDager(uke.dager, registrertKjørtUke));
        settBegrunnelse(registrertKjørtUke?.begrunnelse ?? '');
        settFeilVedLagring(undefined);
        settRedigerer(false);
    };

    const lagre = () => {
        settLagrer(true);
        settFeilVedLagring(undefined);

        const request = registrertKjørtUke
            ? oppdaterRegistrertUke(registrertKjørtUke.id, {
                  begrunnelse: begrunnelse || undefined,
                  dager: redigerbareDager,
              })
            : lagreRegistrertUke({
                  reiseId,
                  begrunnelse: begrunnelse || undefined,
                  dager: redigerbareDager,
              });

        request
            .then((res) => {
                if (erFeilressurs(res)) {
                    settFeilVedLagring(feiletRessursTilFeilmelding(res));
                } else {
                    settRedigerer(false);
                }
            })
            .finally(() => settLagrer(false));
    };

    const kanRedigere = !!erStegRedigerbart && !utbetaltePerioder;

    if (!redigerer) {
        return (
            <div className={styles.bakgrunnOgPadding}>
                {registrertKjørtUke ? (
                    <VStack gap="space-8" marginBlock={'space-8 space-0'}>
                        <HStack marginInline={'space-16 space-0'}>
                            <Label size="small">
                                Antall reisedager fra rammevedtak:{' '}
                                {delperiodeForUke.reisedagerPerUke}
                            </Label>
                        </HStack>

                        <div className={styles.wrapper}>
                            <div className={styles.venstreGrid}>
                                <Label size="small">Dag</Label>
                                <Label size="small">Dato</Label>
                                <Label size="small">Kjørt</Label>
                                <Label size="small">Parkering levert</Label>
                            </div>
                        </div>
                        {uke.dager
                            .filter((dag) => !dag.erDagSlettet)
                            .map((dag) => {
                                const registrertDag = registrertKjørtUke.dager.find(
                                    (d) => d.dato === dag.dato
                                );
                                return (
                                    <div key={dag.dato} className={styles.wrapper}>
                                        <div className={styles.venstreGrid}>
                                            <BodyShort size="small">
                                                {ukedagTilKortNorsk[dag.ukedag]}
                                            </BodyShort>
                                            <BodyShort size="small">
                                                {formaterIsoDato(dag.dato)}
                                            </BodyShort>
                                            <BodyShort size="small">
                                                {registrertDag?.harKjørt ? 'Ja' : 'Nei'}
                                            </BodyShort>
                                            <BodyShort size="small">
                                                {kronerEllerStrek(registrertDag?.parkeringsutgift)}
                                            </BodyShort>
                                        </div>
                                    </div>
                                );
                            })}
                        {registrertKjørtUke.begrunnelse && (
                            <VStack gap="space-4" paddingInline={'space-16 space-0'}>
                                <Skillelinje />
                                <Label size="small">Begrunnelse</Label>
                                <BodyShort size="small">{registrertKjørtUke.begrunnelse}</BodyShort>
                            </VStack>
                        )}
                    </VStack>
                ) : (
                    <>
                        {!utbetaltePerioder ? (
                            <HStack gap="space-4" align="center">
                                <PencilWritingIcon />
                                <BodyShort size="small">Fyll ut kjørelisten manuelt</BodyShort>
                            </HStack>
                        ) : (
                            <HStack gap="space-4" align="center">
                                <SackKronerIcon />
                                <BodyShort size="small">
                                    Denne perioden er allerede utbetalt
                                </BodyShort>
                            </HStack>
                        )}
                    </>
                )}
                {kanRedigere && (
                    <HStack justify="end" marginBlock={'space-8 space-0'}>
                        <Button
                            size="small"
                            variant="tertiary"
                            icon={<PencilIcon />}
                            onClick={() => settRedigerer(true)}
                        >
                            {registrertKjørtUke ? 'Rediger' : 'Fyll ut'}
                        </Button>
                    </HStack>
                )}
            </div>
        );
    }

    return (
        <div className={styles.bakgrunnOgPadding}>
            <HStack marginInline={'space-16 space-0'}>
                <Label size="small">
                    Antall reisedager fra rammevedtak: {delperiodeForUke.reisedagerPerUke}
                </Label>
            </HStack>
            <HStack className={styles.wrapper}>
                <VStack gap="space-16">
                    <div>
                        <div className={styles.wrapper}>
                            <div className={styles.venstreGrid}>
                                <Label size="small">Dag</Label>
                                <Label size="small">Dato</Label>
                                <Label size="small">Kjørt</Label>
                                <Label size="small">Parkering levert</Label>
                            </div>
                        </div>
                        {uke.dager.map((dag, dagIndeks) => (
                            <React.Fragment key={dagIndeks}>
                                <RegistrerKjørelisteDagInfo
                                    dag={dag}
                                    registrertDag={redigerbareDager.find(
                                        (d) => d.dato === dag.dato
                                    )}
                                    oppdaterDag={oppdaterDag}
                                    kanRedigere={kanRedigere}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                </VStack>
                <VStack gap="space-16" marginBlock={'space-8 space-0'} style={{ width: '400px' }}>
                    <Textarea
                        label="Begrunnelse"
                        description={'Hvorfor fylles kjøreliste inn av saksbehandler?'}
                        size="small"
                        minRows={4}
                        value={begrunnelse}
                        onChange={(e) => settBegrunnelse(e.target.value)}
                        resize
                        disabled={!kanRedigere}
                    />
                </VStack>
            </HStack>
            <Feilmelding feil={feilVedLagring} />
            {kanRedigere && (
                <HStack gap="space-8" justify="end" marginBlock={'space-8 space-0'}>
                    <Button size="small" variant="tertiary" onClick={avbryt} disabled={lagrer}>
                        Avbryt
                    </Button>
                    <Button size="small" onClick={lagre} loading={lagrer}>
                        Lagre
                    </Button>
                </HStack>
            )}
        </div>
    );
};
