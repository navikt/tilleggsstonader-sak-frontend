import React, { FC, useState } from 'react';

import { PencilIcon } from '@navikt/aksel-icons';
import { Button, HStack, InlineMessage, Label, VStack } from '@navikt/ds-react';

import { RedigerAvklartDag } from './Dag/RedigerAvklartDag';
import styles from './UkeInnhold.module.css';
import {
    validerAntallReisedagerInnenforRammevedtak,
    validerAvklarteDager,
} from './valideringAvklarteDager';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useSteg } from '../../../../context/StegContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { RedigerbarAvklartDag, UkeVurdering } from '../../../../typer/kjøreliste';
import { RessursStatus } from '../../../../typer/ressurs';
import {
    mapTilRedigerbareAvklarteDager,
    tomRedigerbarAvklartDag,
    typeAvvikTilTekst,
} from '../utils';
import { AvklartDagLesevisning } from './Dag/AvklartDagLesevisning';
import { KjørelisteDagInfo } from './Dag/KjørelisteDagInfo';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { Feil, feiletRessursTilFeilmelding } from '../../../../komponenter/Feil/feilmeldingUtils';
import { RammeForReiseMedPrivatBilDelperiode } from '../../../../typer/vedtak/vedtakDagligReise';

export const UkeInnhold: FC<{
    uke: UkeVurdering;
    oppdaterUke: (uke: UkeVurdering) => void;
    delperioder: RammeForReiseMedPrivatBilDelperiode[];
}> = ({ uke, oppdaterUke, delperioder }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();

    const [redigerer, settRedigerer] = React.useState(false);
    const [redigerbareDager, settRedigerbareDager] = useState<RedigerbarAvklartDag[]>([]);
    const [valideringsfeilForDager, settValideringsfeilForDager] =
        useState<FormErrors<RedigerbarAvklartDag[]>>();
    const [valideringsfeilForUke, settValideringsfeilForUke] = useState<string | undefined>(
        undefined
    );
    const [feilVedLagring, settFeilVedLagring] = useState<Feil | undefined>(undefined);

    const oppdaterDag = (oppdatertDag: RedigerbarAvklartDag) => {
        settRedigerbareDager((prevState) =>
            prevState.map((dag) => (dag.dato === oppdatertDag.dato ? oppdatertDag : dag))
        );
    };

    const valider = (): boolean => {
        const feil = validerAvklarteDager(redigerbareDager, uke);
        settValideringsfeilForDager(feil);

        const erAntallGodkjenteDagerInnenforRammevedtak =
            validerAntallReisedagerInnenforRammevedtak(redigerbareDager, uke, delperioder);

        settValideringsfeilForUke(
            erAntallGodkjenteDagerInnenforRammevedtak
                ? undefined
                : 'Antall dager med godkjent kjøring kan ikke være høyere enn antall reisedager godkjent i rammevedtak'
        );

        return isValid(feil) && erAntallGodkjenteDagerInnenforRammevedtak;
    };

    const lagre = () => {
        if (!valider()) {
            return;
        }

        request<UkeVurdering, RedigerbarAvklartDag[]>(
            `/api/sak/kjoreliste/${behandling.id}/${uke.avklartUkeId}`,
            'PUT',
            redigerbareDager
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                oppdaterUke(res.data);
                avbrytRedigering();
            } else {
                settFeilVedLagring(feiletRessursTilFeilmelding(res));
            }
        });
    };

    const startRedigering = () => {
        settRedigerer(true);
        settRedigerbareDager(mapTilRedigerbareAvklarteDager(uke.dager));
    };

    const avbrytRedigering = () => {
        settRedigerbareDager([]);
        settValideringsfeilForDager(undefined);
        settValideringsfeilForUke(undefined);
        settFeilVedLagring(undefined);
        settRedigerer(false);
    };

    // TODO: Må oppdateres når vi håndterer redigering uten at uke er innsendt
    const kanRedigereUke = erStegRedigerbart && !!uke.kjørelisteInnsendtDato && !!uke.avklartUkeId;

    return (
        <VStack gap="space-16">
            <div>
                <div className={`${styles.borderToppBunn} ${styles.wrapper}`}>
                    <div className={styles.venstreGrid}>
                        <Label size="small">Dag</Label>
                        <Label size="small">Dato</Label>
                        <Label size="small">Kjørt</Label>
                        <Label size="small">Parkering levert</Label>
                    </div>
                    <div className={redigerer ? styles.høyreGridRedigering : styles.høyreGrid}>
                        <Label size="small">Status</Label>
                        <Label size="small">Parkering godkjent</Label>
                        <Label size="small">Kommentar</Label>
                    </div>
                </div>
                <div className={styles.wrapper}>
                    {uke.dager.map((dag, dagIndeks) => (
                        <React.Fragment key={dagIndeks}>
                            <KjørelisteDagInfo dag={dag} />
                            {redigerer ? (
                                <RedigerAvklartDag
                                    dag={
                                        redigerbareDager.find((dag2) => dag2.dato === dag.dato) ||
                                        tomRedigerbarAvklartDag(dag.dato)
                                    }
                                    oppdaterDag={oppdaterDag}
                                    feil={
                                        valideringsfeilForDager &&
                                        valideringsfeilForDager[dagIndeks]
                                    }
                                />
                            ) : (
                                <AvklartDagLesevisning avklartDag={dag.avklartDag} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            {uke.avvik && (
                <InlineMessage size="small" status="error">
                    {typeAvvikTilTekst[uke.avvik.typeAvvik]}
                </InlineMessage>
            )}
            <Feilmelding feil={feilVedLagring} />
            <Feilmelding feil={valideringsfeilForUke} />
            <HStack gap="space-8" justify="end">
                {redigerer && (
                    <>
                        <Button size="small" onClick={avbrytRedigering} variant="tertiary">
                            Avbryt
                        </Button>
                        <Button size="small" onClick={lagre}>
                            Lagre
                        </Button>
                    </>
                )}

                {!redigerer && kanRedigereUke && (
                    <Button
                        size="small"
                        onClick={startRedigering}
                        variant="tertiary"
                        icon={<PencilIcon />}
                    >
                        Rediger
                    </Button>
                )}
            </HStack>
        </VStack>
    );
};
