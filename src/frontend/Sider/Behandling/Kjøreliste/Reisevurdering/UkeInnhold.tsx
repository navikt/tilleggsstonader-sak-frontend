import React, { FC, useState } from 'react';

import { PencilIcon } from '@navikt/aksel-icons';
import { Button, HStack, InlineMessage, Label, VStack } from '@navikt/ds-react';

import { RedigerAvklartsDag } from './Dag/DagvurderingLesevisning';
import styles from './UkeInnhold.module.css';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { RedigerbarAvklartDag, UkeVurdering } from '../../../../typer/kjøreliste';
import { RessursStatus } from '../../../../typer/ressurs';
import {
    mapTilRedigerbareAvklarteDager,
    tomRedigerbarAvklartDag,
    typeAvvikTilTekst,
} from '../utils';
import { AvklartDagLesevisning } from './Dag/AvklartDagLesevisning';
import { KjørelisteDagInfo } from './Dag/KjørelisteDagInfo';

export const UkeInnhold: FC<{
    uke: UkeVurdering;
    oppdaterUke: (uke: UkeVurdering) => void;
}> = ({ uke, oppdaterUke }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [redigerer, settRedigerer] = React.useState(false);
    const [redigerbareDager, settRedigerbareDager] = useState<RedigerbarAvklartDag[]>(
        mapTilRedigerbareAvklarteDager(uke.dager)
    );

    const oppdaterDag = (oppdatertDag: RedigerbarAvklartDag) => {
        settRedigerbareDager((prevState) =>
            prevState.map((dag) => (dag.dato === oppdatertDag.dato ? oppdatertDag : dag))
        );
    };

    const lagre = () => {
        request<UkeVurdering, RedigerbarAvklartDag[]>(
            `/api/sak/kjoreliste/${behandling.id}/${uke.avklartUkeId}`,
            'PUT',
            redigerbareDager
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                oppdaterUke(res.data);
            }
            settRedigerer(false);
        });
    };

    const avbryt = () => {
        settRedigerbareDager([]);
        settRedigerer(false);
    };

    return (
        <VStack gap="space-16">
            <div>
                <div className={styles.borderToppBunn}>
                    <div className={styles.gridOverskrifter}>
                        <Label size="small">Dag</Label>
                        <Label size="small">Dato</Label>
                        <Label size="small">Har kjørt</Label>
                        <Label size="small">Parking</Label>
                        <Label size="small">Får dekt dag</Label>
                        <Label size="small">Parkeringsutgifter</Label>
                        <Label size="small">Kommentar</Label>
                    </div>
                </div>
                <div className={styles.wrapper}>
                    {uke.dager.map((dag, dagIndeks) => (
                        <React.Fragment key={dagIndeks}>
                            <KjørelisteDagInfo dag={dag} />
                            {redigerer ? (
                                <RedigerAvklartsDag
                                    dag={
                                        redigerbareDager.find((dag2) => dag2.dato === dag.dato) ||
                                        tomRedigerbarAvklartDag(dag.dato)
                                    }
                                    oppdaterDag={oppdaterDag}
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
            <HStack gap="space-8" justify="end">
                {redigerer ? (
                    <>
                        <Button size="small" onClick={avbryt} variant="tertiary">
                            Avbryt
                        </Button>
                        <Button size="small" onClick={lagre}>
                            Lagre
                        </Button>
                    </>
                ) : (
                    <Button
                        size="small"
                        onClick={() => settRedigerer(!redigerer)}
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
