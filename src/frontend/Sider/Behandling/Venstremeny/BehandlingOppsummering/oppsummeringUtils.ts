import { BehandlingFaktaTilsynBarn } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';

export const finnNavnFraBarnId = (
    barnId: string | undefined,
    behandlingFakta: BehandlingFaktaTilsynBarn
) => {
    return behandlingFakta.barn.find((barn) => barn.barnId === barnId)?.registergrunnlag.navn;
};
