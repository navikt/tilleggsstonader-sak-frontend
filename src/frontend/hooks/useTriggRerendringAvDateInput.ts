import { useState } from 'react';

import { v4 as uuid } from 'uuid';

/**
 * Vi bruker [DateInput] for å fjerne litt støy for hvordan man skal bruke DatePicker
 * useDatepicker har setSelected for å kunne endre komponenten utenfor, men den er ikke tilgjengelig når vi bruker DateInput
 *
 * Hvis man har behov for å nullstille eller endre den utenfor komponenten så må man då endre key for å ikke ha en skummel useEffect inne i DateInput
 */
export const useTriggRerendringAvDateInput = () => {
    const [keyDato, settKeyDato] = useState<string>(uuid());

    return {
        keyDato,
        oppdaterDatoKey: () => settKeyDato(uuid()),
    };
};
