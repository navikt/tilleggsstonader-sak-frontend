import React from 'react';

import { ErrorMessage } from '@navikt/ds-react';

import { useVilkår } from '../../../context/VilkårContext';

const MeldingHvisLagringFeilet = (props: { vilkårId: string }) => {
    const { feilmeldinger } = useVilkår();

    const feilmelding = feilmeldinger[props.vilkårId];

    return (
        feilmelding && (
            <ErrorMessage size={'small'}>Oppdatering av vilkår feilet: {feilmelding}</ErrorMessage>
        )
    );
};

export default MeldingHvisLagringFeilet;
