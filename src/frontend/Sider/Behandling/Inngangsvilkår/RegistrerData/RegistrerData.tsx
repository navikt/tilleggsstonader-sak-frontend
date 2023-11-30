import React from 'react';

import MålgruppePeriodeValg from './MålgruppeValg';
import { validerRegistrerDataForm } from './registrerDataValidering';
import { MålgruppePeriode, RegistrerDataForm } from './typer';
import { tomMålgruppeRad } from './utils';
import useFormState from '../../../../hooks/felles/useFormState';
import { ListState } from '../../../../hooks/felles/useListState';
import { Vilkårsresultat } from '../../vilkår';
import { Vilkårpanel } from '../../Vilkårspanel/Vilkårpanel';

const initFormState = () => ({
    målgruppePerioder: [tomMålgruppeRad()],
});

const RegistrerData = () => {
    const vilkårsresultat = Vilkårsresultat.OPPFYLT; // TODO

    const formState = useFormState<RegistrerDataForm>(initFormState(), validerRegistrerDataForm);

    const stønadsperioderState = formState.getProps(
        'målgruppePerioder'
    ) as ListState<MålgruppePeriode>;

    return (
        <Vilkårpanel tittel="Registrer data" vilkårsresultat={vilkårsresultat}>
            <MålgruppePeriodeValg
                målgruppePerioderState={stønadsperioderState}
                errorState={formState.errors.målgruppePerioder}
                settValideringsFeil={formState.setErrors}
            />
        </Vilkårpanel>
    );
};

export default RegistrerData;
