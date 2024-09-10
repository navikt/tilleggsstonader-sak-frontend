import { VilkårFaktaBarn } from '../../../../typer/behandling/behandlingFakta/faktaBarn';
import { Regel } from '../../../../typer/regel';
import { dagensDato, formaterDato } from '../../../../utils/dato';
import { Vurdering } from '../../vilkår';
import { tomVurdering } from '../../Vilkårvurdering/utils';

/**
 * Dette er kode som er flyttet fra backend - PassBarnRegel. Resultatet sattes i backend til automatisk oppfylt.
 * Men i det saksbehandler oppdaterte et annet delvilkår på vilkåret ble resultatet oppdatert til OPPFYLT, selv uten endringer på `HAR_FULLFØRT_FJERDEKLASSE`
 * Det blir då vanskelig å spåre om det faktiskt er automatisk vurdert eller ikke. Vi ble enige om at det prefylles
 *
 * Problemet med denne er at man først legger inn perioder, og hvordan burde vilkåret prefylles når man egentlige ikke vet om perioden?
 * Muligens at dette burde bli håndtert på en bedre måte, og bedre sporing om det er automatisk oppfylt eller ikke
 */
export const automatiskVurdert = (regel: Regel, vilkårBarn: VilkårFaktaBarn): Vurdering => {
    switch (regel.regelId) {
        case 'HAR_FULLFØRT_FJERDEKLASSE':
            if (vilkårBarn.harFullførtFjerdetrinn === 'NEI') {
                return {
                    regelId: regel.regelId,
                    svar: 'NEI',
                    begrunnelse: `Automatisk preutfylt: Ut ifra barnets alder er det ${formaterDato(dagensDato())} automatisk vurdert at barnet ikke har fullført 4. skoleår.`,
                };
            }
    }
    return tomVurdering(regel);
};
