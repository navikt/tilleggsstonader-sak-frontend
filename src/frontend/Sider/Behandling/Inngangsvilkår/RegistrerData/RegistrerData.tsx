import React from 'react';

import { validerRegistrerDataForm } from './registrerDataValidering';
import { RegistrerDataForm } from './typer';
import { tomMålgruppeRad } from './utils';
import useFormState from '../../../../hooks/felles/useFormState';
import { Vilkårsresultat } from '../../vilkår';
import { Vilkårpanel } from '../../Vilkårspanel/Vilkårpanel';

const initFormState = () => ({
    målgruppePerioder: [tomMålgruppeRad()],
});

const RegistrerData = () => {
    const vilkårsresultat = Vilkårsresultat.OPPFYLT; // TODO

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const formState = useFormState<RegistrerDataForm>(initFormState(), validerRegistrerDataForm);

    return (
        <Vilkårpanel tittel="Registrer data" vilkårsresultat={vilkårsresultat}>
            Hei
        </Vilkårpanel>
    );
};

export default RegistrerData;
