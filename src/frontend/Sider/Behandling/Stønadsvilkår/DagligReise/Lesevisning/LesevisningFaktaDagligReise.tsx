import React, { FC } from 'react';

import { Alert, BodyShort } from '@navikt/ds-react';

import styles from './LesevisningFaktaDagligReise.module.css';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../../utils/fomatering';
import {
    FaktaDagligReise,
    FaktaOffentligTransport,
    FaktaPrivatBil,
} from '../typer/faktaDagligReise';
import { typeDagligReiseTilTekst } from '../typer/vilkårDagligReise';

export const LesevisningFaktaDagligReise: FC<{
    fakta: FaktaDagligReise | undefined;
}> = ({ fakta }) => {
    if (!fakta) return null;

    switch (fakta.type) {
        case 'OFFENTLIG_TRANSPORT':
            return <LesevisningFaktaOffentligTransport fakta={fakta as FaktaOffentligTransport} />;

        case 'PRIVAT_BIL':
            return <LesevisningFaktaPrivatBil fakta={fakta as FaktaPrivatBil} />;

        default:
            return (
                <Alert variant="info" size="small" inline>
                    Lesevisning for {typeDagligReiseTilTekst[fakta.type]} er ikke implementert enda
                </Alert>
            );
    }
};

const LesevisningFaktaOffentligTransport: FC<{
    fakta: FaktaOffentligTransport;
}> = ({ fakta }) => {
    return (
        <div className={styles.grid}>
            <BodyShort size="small">{'Reisedager pr uke'}</BodyShort>
            <BodyShort size="small">
                {fakta?.reisedagerPerUke ? `${fakta.reisedagerPerUke}` : '-'}
            </BodyShort>

            <BodyShort size="small">{'Pris enkeltbillett'}</BodyShort>
            <BodyShort size="small">
                {fakta?.prisEnkelbillett
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta.prisEnkelbillett)} kr`
                    : '-'}
            </BodyShort>

            <BodyShort size="small">{'Pris 7 dagers billett'}</BodyShort>
            <BodyShort size="small">
                {fakta?.prisSyvdagersbillett
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta?.prisSyvdagersbillett)} kr`
                    : '-'}
            </BodyShort>

            <BodyShort size="small">{'Pris 30 dagers billett'}</BodyShort>
            <BodyShort size="small">
                {fakta?.prisTrettidagersbillett
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta.prisTrettidagersbillett)} kr`
                    : '-'}
            </BodyShort>
        </div>
    );
};

const LesevisningFaktaPrivatBil: FC<{
    fakta: FaktaPrivatBil;
}> = ({ fakta }) => {
    return (
        <div className={styles.grid}>
            <BodyShort size="small">{'Reisedager pr uke'}</BodyShort>
            <BodyShort size="small">
                {fakta?.reisedagerPerUke ? `${fakta.reisedagerPerUke}` : '-'}
            </BodyShort>

            <BodyShort size="small">{'Reiseavstand en vei'}</BodyShort>
            <BodyShort size="small">
                {fakta?.reiseavstandEnVei
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta.reiseavstandEnVei)} km`
                    : '-'}
            </BodyShort>

            <BodyShort size="small">{'Bompenger per dag'}</BodyShort>
            <BodyShort size="small">
                {fakta?.prisBompengerPerDag
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta?.prisBompengerPerDag)} kr`
                    : '-'}
            </BodyShort>

            <BodyShort size="small">{'Fergekostnader per dag'}</BodyShort>
            <BodyShort size="small">
                {fakta?.prisFergekostandPerDag
                    ? `${formaterTallMedTusenSkilleEllerStrek(fakta.prisFergekostandPerDag)} kr`
                    : '-'}
            </BodyShort>
        </div>
    );
};
