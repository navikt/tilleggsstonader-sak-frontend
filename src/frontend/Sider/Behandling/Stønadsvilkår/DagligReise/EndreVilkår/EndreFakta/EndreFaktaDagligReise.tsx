import React from 'react';

import { EndreFaktaOffentligTransport } from './EndreFaktaOffentligTransport';
import { erFaktaOffentligTransport, FaktaDagligReise } from '../../typer/faktaDagligReise';
import { TypeVilkårFakta } from '../../typer/regelstrukturDagligReise';

export const EndreFaktaDagligReise: React.FC<{
    gjeldendeFaktaType: TypeVilkårFakta | undefined;
    fakta: FaktaDagligReise | undefined;
    settFakta: React.Dispatch<React.SetStateAction<FaktaDagligReise | undefined>>;
}> = ({ gjeldendeFaktaType, fakta, settFakta }) => {
    switch (gjeldendeFaktaType) {
        case 'DAGLIG_REISE_OFFENTLIG_TRANSPORT':
            return (
                <EndreFaktaOffentligTransport
                    fakta={erFaktaOffentligTransport(fakta) ? fakta : undefined}
                    settFakta={settFakta}
                />
            );
        case 'DAGLIG_REISE_PRIVAT_BIL':
            return <p>Privat bil</p>;
    }

    return null;
};
