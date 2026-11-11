import { initierSvar, tomtSvar } from '../EndreVilkår/utils';
import {
    SvarVilkårReiseOppstartAvslutningHjemreise,
    ParaplyvilkårReiseOppstartAvslutningHjemreise,
} from '../typer/vilkårReiseOppstartAvslutningHjemreise';

/** Paraplyvilkåret for midlertidig bosted mens det redigeres */
export interface MidlertidigBostedUtkast {
    fom: string | undefined;
    tom: string | undefined;
    fraAdresse: string;
    tilAdresse: string;
    svar: SvarVilkårReiseOppstartAvslutningHjemreise;
}

export const tomtMidlertidigBostedUtkast: MidlertidigBostedUtkast = {
    fom: undefined,
    tom: undefined,
    fraAdresse: '',
    tilAdresse: '',
    svar: tomtSvar,
};

export const tilUtkast = (
    vilkår: ParaplyvilkårReiseOppstartAvslutningHjemreise
): MidlertidigBostedUtkast => ({
    fom: vilkår.fom,
    tom: vilkår.tom,
    fraAdresse: vilkår.fraAdresse,
    tilAdresse: vilkår.tilAdresse,
    svar: initierSvar(vilkår),
});
