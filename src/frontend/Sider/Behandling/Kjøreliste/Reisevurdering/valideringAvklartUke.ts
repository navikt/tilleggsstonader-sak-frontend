import { FormErrors } from '../../../../hooks/felles/useFormState';
import { GodkjentGjennomførtKjøring, RedigerbarAvklartDag } from '../../../../typer/kjøreliste';
import { harTallverdi } from '../../../../utils/tall';
import { harIkkeVerdi } from '../../../../utils/utils';

export const validerAvklarteDager = (
    avklarteDager: RedigerbarAvklartDag[]
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

            if (avklartDag.parkeringsutgift >= 100 && harIkkeVerdi(avklartDag.begrunnelse)) {
                return {
                    ...feil,
                    begrunnelse: 'Må begrunne parkeringsutgift over 100 kr',
                };
            }
        }

        return feil;
    });

export const validerAntallReisedagerInnenforRammevedtak = (
    avklarteDager: RedigerbarAvklartDag[],
    reisedagerPerUke: number
): boolean => {
    const antallDagerMedKjøring = avklarteDager.filter(
        (dag) => dag.godkjentGjennomførtKjøring === 'JA'
    ).length;

    return antallDagerMedKjøring <= reisedagerPerUke;
};
