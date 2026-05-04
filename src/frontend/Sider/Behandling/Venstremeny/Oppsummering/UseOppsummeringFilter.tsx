import React from 'react';

import {
    oppsummeringAltFilterValg,
    oppsummeringAltFilterVerdi,
    SøknadInfoSeksjonFilterValg,
} from './Visningskomponenter';

export function useOppsummeringFilter(
    domeneFiltervalg: SøknadInfoSeksjonFilterValg[],
    antallDokumenter: number
) {
    const [valgtSeksjon, settValgtSeksjon] = React.useState<string>(oppsummeringAltFilterVerdi);

    const filtervalg: SøknadInfoSeksjonFilterValg[] = [
        oppsummeringAltFilterValg,
        ...domeneFiltervalg,
        ...(antallDokumenter > 0
            ? [
                  {
                      value: 'vedlegg',
                      label: 'Vedlegg',
                      ariaLabel: 'Vis vedlegg',
                      count: antallDokumenter,
                  },
              ]
            : []),
    ];

    const gyldigeVerdier = filtervalg.map((v) => v.value);
    const visFellesopplysninger = valgtSeksjon === oppsummeringAltFilterVerdi;

    return {
        valgtSeksjon,
        filtervalg,
        visFellesopplysninger: valgtSeksjon === oppsummeringAltFilterVerdi,
        visSeksjon: (seksjon: string) => visFellesopplysninger || valgtSeksjon === seksjon,
        visVedlegg: antallDokumenter > 0 && (visFellesopplysninger || valgtSeksjon === 'vedlegg'),
        onFilterChange: (value: string) => {
            if (gyldigeVerdier.includes(value)) {
                settValgtSeksjon(value);
            }
        },
    };
}
