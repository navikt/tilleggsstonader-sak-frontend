import React from 'react';

import {
    BeregningResultatReiseTilSamling,
    BeregningsresultatOffentligTransport,
    BeregningsresultatPrivatBil,
} from '../../../../typer/vedtak/vedtakReiseTilSamling';

export const cellStyle: React.CSSProperties = {
    border: '1px solid black',
    padding: '5px',
    boxSizing: 'border-box',
    whiteSpace: 'pre-line',
    overflowWrap: 'anywhere',
};

export const stønadsbeløpKolonneBredde = '130px';

export const bredder = {
    kolonner: {
        offentligTransport: [
            `calc(100% - ${stønadsbeløpKolonneBredde})`,
            stønadsbeløpKolonneBredde,
        ],
        privatBil: ['25%', '21.67%', '35%', stønadsbeløpKolonneBredde],
    },
};

export const gråOverskrift = '#ECEDEF';

export interface Samlingsgruppe {
    nøkkel: string;
    offentligTransport: BeregningsresultatOffentligTransport[];
    privatBil: BeregningsresultatPrivatBil[];
}

export function harBeløp(verdi: number | undefined): verdi is number {
    return verdi !== undefined && verdi > 0;
}

export function lagEkstrakostnaderTekst(samling: BeregningsresultatPrivatBil): string {
    const linjer = [
        harBeløp(samling.bompenger) ? `Bom: ${samling.bompenger}kr` : null,
        harBeløp(samling.fergekostnad) ? `Ferge: ${samling.fergekostnad}kr` : null,
        harBeløp(samling.piggdekkavgift) ? `Piggdekk: ${samling.piggdekkavgift}kr` : null,
        harBeløp(samling.parkering) ? `Parkering: ${samling.parkering}kr` : null,
    ].filter((linje): linje is string => linje !== null);

    return linjer.join('<br/>');
}

export function summerBeløpForGruppe(gruppe: Samlingsgruppe): number {
    const beløpOffentligTransport = gruppe.offentligTransport.reduce(
        (sum, samling) => sum + samling.beløp,
        0
    );
    const beløpPrivatBil = gruppe.privatBil.reduce((sum, samling) => sum + samling.beløp, 0);

    return beløpOffentligTransport + beløpPrivatBil;
}

function lagNøkkel(fom: string, tom: string, adresse: string): string {
    return `${fom}|${tom}|${adresse}`;
}

/*
 * Filtrer bort samlinger som er fra tidligere vedtak.
 *
 * Lager grupper av samlinger som har samme periode og adresse slik
 * at det er mulig å gruppere visningen av disse i brevet.
 */
export function fjernPerioderFraTidligereVedtakOgGrupperPåPeriodeOgAdresse(
    beregningsresultat: BeregningResultatReiseTilSamling
): Samlingsgruppe[] {
    const grupper = new Map<string, Samlingsgruppe>();

    beregningsresultat.offentligTransport
        ?.filter((samling) => !samling.fraTidligereVedtak)
        .forEach((samling) => {
            const adresse = samling.adresse ?? '-';
            const nøkkel = lagNøkkel(samling.fom, samling.tom, adresse);
            const gruppe = grupper.get(nøkkel) ?? nyGruppe(nøkkel);
            gruppe.offentligTransport.push(samling);
            grupper.set(nøkkel, gruppe);
        });

    beregningsresultat.privatBil
        ?.filter((samling) => !samling.fraTidligereVedtak)
        .forEach((samling) => {
            const adresse = samling.adresse ?? '-';
            const nøkkel = lagNøkkel(samling.fom, samling.tom, adresse);
            const gruppe = grupper.get(nøkkel) ?? nyGruppe(nøkkel);
            gruppe.privatBil.push(samling);
            grupper.set(nøkkel, gruppe);
        });

    return Array.from(grupper.values()).sort((a, b) =>
        fomForGruppe(a).localeCompare(fomForGruppe(b))
    );
}

function fomForGruppe(gruppe: Samlingsgruppe): string {
    return gruppe.offentligTransport[0]?.fom ?? gruppe.privatBil[0]?.fom ?? '';
}

const nyGruppe = (nøkkel: string): Samlingsgruppe => ({
    nøkkel,
    offentligTransport: [],
    privatBil: [],
});
