import { useState } from 'react';

import { OppsummeringForPeriode } from './simuleringTyper';
import { finnDefaultÅrForSimuleringsvisning } from './simuleringUtils';
import { formaterIsoÅr } from '../../../utils/dato';

const useSimuleringÅrvelger = (perioder: OppsummeringForPeriode[]) => {
    const muligeÅr = [...new Set(perioder.map((periode) => formaterIsoÅr(periode.fom)))];

    const [valgtÅr, settValgtÅr] = useState(finnDefaultÅrForSimuleringsvisning(muligeÅr));

    const kanVelgeForrigeÅr = muligeÅr.some((muligÅr) => muligÅr < valgtÅr);
    const kanVelgeNesteÅr = muligeÅr.some((muligÅr) => muligÅr > valgtÅr);

    const perioderForValgtÅr = perioder.filter((periode) => {
        return formaterIsoÅr(periode.fom) === valgtÅr;
    });

    return {
        valgtÅr,
        settValgtÅr,
        kanVelgeForrigeÅr,
        kanVelgeNesteÅr,
        perioderForValgtÅr,
    };
};

export default useSimuleringÅrvelger;
