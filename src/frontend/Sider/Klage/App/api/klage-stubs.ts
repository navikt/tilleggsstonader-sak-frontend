import { ISaksbehandler } from '../typer/saksbehandler';
import { Folkeregisterpersonstatus, IPersonopplysninger } from '../typer/personopplysninger';
import { kjønnType } from '../../familie-felles-frontend/familie-typer/person';
import {
    Behandling,
    BehandlingResultat,
    Fagsystem,
    PåklagetVedtakstype,
    StegType,
} from '../typer/fagsak';
import { BehandlingStatus } from '../typer/behandlingstatus';
import { Stønadstype } from '../typer/stønadstype';
import {
    FagsystemType,
    FormkravFristUnntak,
    IFormkravVilkår,
    VilkårStatus,
} from '../../Komponenter/Behandling/Formkrav/typer';
import { FagsystemVedtak } from '../typer/fagsystemVedtak';
import { IVurdering, VedtakValg } from '../../Komponenter/Behandling/Vurdering/vurderingValg';
import { FolketrygdHjemmel } from '../../Komponenter/Behandling/Vurdering/hjemmel';

export const saksbehandlerDummyData: ISaksbehandler = {
    displayName: 'F_Z994808 E_Z994808',
    email: 'F_Z994808.E_Z994808@trygdeetaten.no',
    firstName: 'Navn',
    lastName: 'Navnesen',
    groups: [
        '01166863-22f1-4e16-9785-d7a05a22df74',
        'ee5e0b5e-454c-4612-b931-1fe363df7c2c',
        'd21e00a4-969d-4b28-8782-dc818abfae65',
        '928636f4-fd0d-4149-978e-a6fb68bb19de',
        '9449c153-5a1e-44a7-84c6-7cc7a8867233',
    ],
    identifier: 'F_Z994808.E_Z994808@trygdeetaten.no',
    navIdent: 'X123',
    enhet: '000',
};

export const personopplysningerDummyData: IPersonopplysninger = {
    personIdent: '25518735813',
    navn: 'HURTIG PLEIE',
    kjønn: kjønnType.KVINNE,
    adressebeskyttelse: undefined,
    folkeregisterpersonstatus: Folkeregisterpersonstatus.BOSATT,
    dødsdato: undefined,
    fullmakt: [],
    egenAnsatt: false,
    vergemål: [],
    navEnhet: "FA1",
};

export const behandlingDummydata: Behandling = {
    id: "56694255-4a4a-407e-9079-8b14a7acbe80",
    fagsakId: "c0656c5b-878e-470e-864f-dbafbae9cd82",
    steg: StegType.FORMKRAV, // Map to StegType enum
    status: BehandlingStatus.OPPRETTET, // Map to BehandlingStatus enum
    sistEndret: "2024-05-27T17:25:49",
    opprettet: "2024-05-27T17:25:48.658",
    resultat: BehandlingResultat.IKKE_SATT, // Map to BehandlingResultat enum
    vedtakDato: undefined,
    stønadstype: Stønadstype.OVERGANGSSTØNAD, // Assuming this is imported from somewhere
    klageinstansResultat: [],
    påklagetVedtak: {
        eksternFagsystemBehandlingId: undefined,
        påklagetVedtakstype: PåklagetVedtakstype.IKKE_VALGT, // Map to PåklagetVedtakstype enum
        fagsystemVedtak: undefined,
        manuellVedtaksdato: undefined,
    },
    eksternFagsystemFagsakId: "200054236",
    fagsystem: Fagsystem.EF, // Map to Fagsystem enum
    klageMottatt: "2024-05-22",
    fagsystemRevurdering: undefined
};

export const formkravVilkårDummyData: IFormkravVilkår = {
    behandlingId: "56694255-4a4a-407e-9079-8b14a7acbe80",
    klagePart: VilkårStatus.OPPFYLT,
    klageKonkret: VilkårStatus.OPPFYLT,
    klagefristOverholdt: VilkårStatus.OPPFYLT,
    klagefristOverholdtUnntak: FormkravFristUnntak.IKKE_SATT,
    klageSignert: VilkårStatus.OPPFYLT,
    saksbehandlerBegrunnelse: "",
    endretTid: "2024-05-28T08:14:20.478",
    påklagetVedtak: {
        eksternFagsystemBehandlingId: "17934",
        påklagetVedtakstype: PåklagetVedtakstype.VEDTAK,
        fagsystemVedtak: {
            eksternBehandlingId: "17934",
            behandlingstype: "Førstegangsbehandling",
            resultat: "Innvilget",
            vedtakstidspunkt: "2024-01-22T17:13:23.621",
            fagsystemType: FagsystemType.ORDNIÆR,
            //regelverk: "NASJONAL"
        },
        manuellVedtaksdato: undefined,
        //regelverk: "NASJONAL"
    }
}

export const fagsystemVedakDummydata: FagsystemVedtak[] = [
    {
        eksternBehandlingId: "17934",
        behandlingstype: "Førstegangsbehandling",
        resultat: "Innvilget",
        vedtakstidspunkt: "2024-01-22T17:13:23.621",
        fagsystemType: FagsystemType.ORDNIÆR,
    }
] 

export const vurderingStub: IVurdering = {
    behandlingId: "56694255-4a4a-407e-9079-8b14a7acbe80",
    vedtak: VedtakValg.OPPRETTHOLD_VEDTAK,
    årsak: undefined ,
    begrunnelseOmgjøring: undefined ,
    hjemmel: FolketrygdHjemmel.FT_FEMTEN_TO,
    innstillingKlageinstans: "Dette er fritekst",
    interntNotat: undefined
}