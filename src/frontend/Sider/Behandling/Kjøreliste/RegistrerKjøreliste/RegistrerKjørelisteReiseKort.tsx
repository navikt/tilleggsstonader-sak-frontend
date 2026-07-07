import React, { FC } from 'react';

import { Heading } from '@navikt/ds-react';

import { RegistrerKjørelisteReisevurdering } from './RegistrerKjørelisteReisevurdering';
import {
    RegistrertKjørtUke,
    RegistrertKjørtUkePostRequest,
    RegistrertKjørtUkePutRequest,
    ReisevurderingPrivatBil,
    UkeVurdering,
} from '../../../../typer/kjøreliste';
import { Ressurs } from '../../../../typer/ressurs';
import { OppsummeringRammevedtak } from '../OppsummeringRammevedtak';
import styles from '../ReiseKort.module.css';

export const RegistrerKjørelisteReiseKort: FC<{
    reisevurdering: ReisevurderingPrivatBil;
    oppdaterReisevurdering: (oppdatertReisevurdering: ReisevurderingPrivatBil) => void;
    registrertKjørtUker: RegistrertKjørtUke[];
    lagreUke: (req: RegistrertKjørtUkePostRequest) => Promise<Ressurs<RegistrertKjørtUke>>;
    oppdaterUke: (
        ukeId: string,
        req: RegistrertKjørtUkePutRequest
    ) => Promise<Ressurs<RegistrertKjørtUke>>;
}> = ({ reisevurdering, oppdaterReisevurdering, registrertKjørtUker, lagreUke, oppdaterUke }) => {
    const oppdaterUkeVurdering = (oppdatertUke: UkeVurdering) => {
        const oppdaterteUker = reisevurdering.uker.map((uke) =>
            uke.fraDato === oppdatertUke.fraDato ? oppdatertUke : uke
        );
        oppdaterReisevurdering({
            ...reisevurdering,
            uker: oppdaterteUker,
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Heading size="small">
                    {reisevurdering.rammevedtak?.aktivitetsadresse ??
                        reisevurdering.forrigeRammevedtak?.aktivitetsadresse}
                </Heading>
                <OppsummeringRammevedtak
                    rammeForReise={reisevurdering.rammevedtak ?? reisevurdering.forrigeRammevedtak}
                />
            </div>
            <div className={styles.innhold}>
                <RegistrerKjørelisteReisevurdering
                    reisevurdering={reisevurdering}
                    oppdaterUkeVurdering={oppdaterUkeVurdering}
                    registrertKjørtUker={registrertKjørtUker}
                    lagreRegistrertUke={lagreUke}
                    oppdaterRegistrertUke={oppdaterUke}
                />
            </div>
        </div>
    );
};
