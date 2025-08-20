import { useState } from 'react';

import { OppsummeringForPeriode } from './simuleringTyper';
import { finnDefaultÅrForSimuleringsvisning } from './simuleringUtils';
import { formaterIsoÅr } from '../../../utils/dato';

const useSimuleringÅrvelger = (perioder: OppsummeringForPeriode[]) => {
    const muligeÅr = [...new Set(perioder.map((periode) => formaterIsoÅr(periode.måned)))];

    const [valgtÅr, settValgtÅr] = useState(finnDefaultÅrForSimuleringsvisning(muligeÅr));

    const kanVelgeForrigeÅr = muligeÅr.some((muligÅr) => muligÅr < valgtÅr);
    const kanVelgeNesteÅr = muligeÅr.some((muligÅr) => muligÅr > valgtÅr);

    const perioderForValgtÅr = perioder.filter(
        (periode) => formaterIsoÅr(periode.måned) === valgtÅr
    );

    return {
        valgtÅr,
        settValgtÅr,
        kanVelgeForrigeÅr,
        kanVelgeNesteÅr,
        perioderForValgtÅr,
    };
};

export default useSimuleringÅrvelger;
