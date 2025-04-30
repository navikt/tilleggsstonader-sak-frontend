import {
    BehandlingFakta,
    BehandlingFaktaTilsynBarn,
} from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { Stønadsvilkår } from '../../../../typer/behandling/behandlingOppsummering';
import { vilkårTypeTilTekst } from '../../Vilkårvurdering/tekster';

export const finnNavnFraBarnId = (
    barnId: string | undefined,
    behandlingFakta: BehandlingFaktaTilsynBarn
) => {
    return behandlingFakta.barn.find((barn) => barn.barnId === barnId)?.registergrunnlag.navn;
};

export const finnTittelForStønadsvilkår = (
    vilkår: Stønadsvilkår,
    behandlingFakta: BehandlingFakta
) => {
    return vilkår.barnId
        ? finnNavnFraBarnId(vilkår.barnId, behandlingFakta as BehandlingFaktaTilsynBarn)
        : vilkårTypeTilTekst[vilkår.type];
};
