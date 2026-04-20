import { FormErrors } from '../../../../hooks/felles/useFormState';
import {
    GodkjentGjennomførtKjøring,
    RedigerbarAvklartDag,
    UkeVurdering,
} from '../../../../typer/kjøreliste';
import { RammeForReiseMedPrivatBilDelperiode } from '../../../../typer/vedtak/vedtakDagligReise';
import { perioderOverlapper } from '../../../../utils/dato';
import { harTallverdi } from '../../../../utils/tall';
import { harIkkeVerdi, harVerdi } from '../../../../utils/utils';

export const validerAvklarteDager = (
    avklarteDager: RedigerbarAvklartDag[],
    uke: UkeVurdering
): FormErrors<RedigerbarAvklartDag[]> =>
    avklarteDager.map((avklartDag) => {
        const feil: FormErrors<RedigerbarAvklartDag> = {
            dato: undefined,
            godkjentGjennomførtKjøring: undefined,
            parkeringsutgift: undefined,
            begrunnelse: undefined,
        };

        if (avklartDag.godkjentGjennomførtKjøring === GodkjentGjennomførtKjøring.IKKE_VURDERT) {
            return {
                ...feil,
                godkjentGjennomførtKjøring: 'Må settes',
            };
        }

        if (harTallverdi(avklartDag.parkeringsutgift)) {
            if (avklartDag.godkjentGjennomførtKjøring !== GodkjentGjennomførtKjøring.JA) {
                return {
                    ...feil,
                    parkeringsutgift: 'Parkeringsutgift kan kun fylles ut hvis kjøring er godkjent',
                };
            }

            if (avklartDag.parkeringsutgift > 100 && harIkkeVerdi(avklartDag.begrunnelse)) {
                return {
                    ...feil,
                    begrunnelse: 'Må begrunne parkeringsutgift over 100 kr',
                };
            }
        }

        const feilmeldingDersomBegrunnelseManglerVedAvvikFraKjøreliste =
            validerAvvikFraKjørelisteErBegrunnet(avklartDag, uke);

        if (feilmeldingDersomBegrunnelseManglerVedAvvikFraKjøreliste) {
            return {
                ...feil,
                begrunnelse: feilmeldingDersomBegrunnelseManglerVedAvvikFraKjøreliste,
            };
        }

        return feil;
    });

export const validerAntallReisedagerInnenforRammevedtak = (
    avklarteDager: RedigerbarAvklartDag[],
    uke: UkeVurdering,
    delperioder: RammeForReiseMedPrivatBilDelperiode[]
): boolean => {
    const antallDagerMedKjøring = avklarteDager.filter(
        (dag) => dag.godkjentGjennomførtKjøring === GodkjentGjennomførtKjøring.JA
    ).length;

    const rammevedtakDelperiodeForUke = delperioder.filter((delperiode) =>
        perioderOverlapper(delperiode, { fom: uke.fraDato, tom: uke.tilDato })
    );

    return antallDagerMedKjøring <= rammevedtakDelperiodeForUke[0].reisedagerPerUke;
};

const validerAvvikFraKjørelisteErBegrunnet = (
    avklartDag: RedigerbarAvklartDag,
    uke: UkeVurdering
): string | undefined => {
    // Validerer kun at begrunnelse er satt og ikke hva som står
    if (harVerdi(avklartDag.begrunnelse)) return undefined;

    const innsendtFraBruker = uke.dager.find((dag) => dag.dato === avklartDag.dato)?.kjørelisteDag;

    if (dagErIkkeGodkjentOgBrukerMeldteKjøring(avklartDag, innsendtFraBruker?.harKjørt)) {
        return 'Må begrunne hvorfor kjøring ikke er godkjent når bruker meldte kjøring';
    }

    if (dagErGodkjentOgBrukerMeldteIngenKjøring(avklartDag, innsendtFraBruker?.harKjørt)) {
        return 'Må begrunne hvorfor kjøring er godkjent når bruker ikke har meldt kjøring';
    }

    if (innsendtFraBruker?.parkeringsutgift !== avklartDag.parkeringsutgift) {
        return 'Må begrunne endring i parkeringsutgift';
    }
};

const dagErIkkeGodkjentOgBrukerMeldteKjøring = (
    avklartDag: RedigerbarAvklartDag,
    brukerHarKjørt: boolean | undefined
): boolean => {
    return (
        brukerHarKjørt === true &&
        avklartDag.godkjentGjennomførtKjøring === GodkjentGjennomførtKjøring.NEI
    );
};

const dagErGodkjentOgBrukerMeldteIngenKjøring = (
    avklartDag: RedigerbarAvklartDag,
    brukerHarKjørt: boolean | undefined
): boolean => {
    return (
        brukerHarKjørt === false &&
        avklartDag.godkjentGjennomførtKjøring === GodkjentGjennomførtKjøring.JA
    );
};
