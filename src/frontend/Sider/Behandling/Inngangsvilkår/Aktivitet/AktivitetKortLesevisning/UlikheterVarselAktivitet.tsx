import React from 'react';

import { Tag } from '@navikt/ds-react';

import {
    finnForskjellerMellomRegisterOgAktivitet as finnForskjellerMellomAktivitetOgRegisteraktivitet,
    keysMedMuligeUlikheterTilTekst,
} from './aktivitetKortUtils';
import { Registeraktivitet } from '../../../../../typer/registeraktivitet';
import { Aktivitet } from '../../typer/vilkårperiode/aktivitet';

export const UlikheterVarselEndring: React.FC<{
    aktivitet: Aktivitet;
    aktivitetFraRegister: Registeraktivitet | undefined;
}> = ({ aktivitet, aktivitetFraRegister }) => {
    if (!aktivitetFraRegister) {
        return (
            <Tag size="small" variant="info" style={{ alignSelf: 'start' }}>
                Opplysninger om aktivitet lagt til manuelt
            </Tag>
        );
    }

    const forskjeller = finnForskjellerMellomAktivitetOgRegisteraktivitet(
        aktivitet,
        aktivitetFraRegister
    );

    if (forskjeller.length > 0) {
        return (
            <Tag size="small" variant="warning" style={{ alignSelf: 'start' }}>
                Opplysninger om aktivitet ikke likt som Arena:{' '}
                {forskjeller.map((key) => keysMedMuligeUlikheterTilTekst[key]).join(', ')}
            </Tag>
        );
    }

    return null;
};
