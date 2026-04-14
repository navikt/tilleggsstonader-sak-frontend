import React from 'react';

import { EndreFaktaOffentligTransport } from './EndreFaktaOffentligTransport';
import { EndreFaktaPrivatBil } from './EndreFaktaPrivatBil';
import {
    FaktaDagligReise,
    FaktaOffentligTransport,
    FaktaPrivatBil,
} from '../../typer/faktaDagligReise';
import { TypeVilkårFakta } from '../../typer/regelstrukturDagligReise';
import {
    FeilmeldingerDagligReise,
    FeilmeldingerFaktaOffentligTransport,
    FeilmeldingerFaktaPrivatBil,
} from '../validering';

export const EndreFaktaDagligReise: React.FC<{
    gjeldendeFaktaType: TypeVilkårFakta;
    fakta: FaktaDagligReise;
    periodeFom: string;
    periodeTom: string;
    settFakta: React.Dispatch<React.SetStateAction<FaktaDagligReise>>;
    nullstillFeilOgUlagretkomponent: () => void;

    feilmeldinger: FeilmeldingerDagligReise;
}> = ({
    gjeldendeFaktaType,
    fakta,
    nullstillFeilOgUlagretkomponent,
    settFakta,
    feilmeldinger,
    periodeFom,
    periodeTom,
}) => {
    switch (gjeldendeFaktaType) {
        case 'DAGLIG_REISE_OFFENTLIG_TRANSPORT':
            return (
                <EndreFaktaOffentligTransport
                    fakta={fakta as FaktaOffentligTransport}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta}
                    feilmeldinger={feilmeldinger.fakta as FeilmeldingerFaktaOffentligTransport}
                />
            );
        case 'DAGLIG_REISE_PRIVAT_BIL':
            return (
                <EndreFaktaPrivatBil
                    fakta={fakta as FaktaPrivatBil}
                    periodeFom={periodeFom}
                    periodeTom={periodeTom}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta as () => FaktaPrivatBil}
                    feilmeldinger={feilmeldinger.fakta as FeilmeldingerFaktaPrivatBil}
                />
            );
    }

    return null;
};
