import React from 'react';

import { ErrorMessage } from '@navikt/ds-react';

import { useVilkår } from '../../../context/VilkårContext';

const MeldingHvisLagringFeilet = (props: { id: string }) => {
    const { feilmeldinger } = useVilkår();

    const feilmelding = feilmeldinger[props.id];

    return (
        feilmelding && (
            <ErrorMessage size={'small'}>Oppdatering av vilkår feilet: {feilmelding}</ErrorMessage>
        )
    );
};

export default MeldingHvisLagringFeilet;
