import { ISaksbehandler } from '../typer/saksbehandler';
import { PåklagetVedtakstype, StegType } from '../typer/fagsak';
import {
    FagsystemType,
    FormkravFristUnntak,
    IFormkravVilkår,
    VilkårStatus,
} from '../../Komponenter/Behandling/Formkrav/typer';
import { FagsystemVedtak } from '../typer/fagsystemVedtak';
import {
    EBrevmottakerRolle,
    IBrevmottakere,
} from '../../Komponenter/Behandling/Brevmottakere/typer';
import { IBehandlingshistorikk } from '../../Komponenter/Behandling/Høyremeny/behandlingshistorikk';

export const saksbehandlerStub: ISaksbehandler = {
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

export const fagsystemVedakStub: FagsystemVedtak = {
        eksternBehandlingId: '17934',
        behandlingstype: 'Førstegangsbehandling',
        resultat: 'Innvilget',
        vedtakstidspunkt: '2024-01-22T17:13:23.621',
        fagsystemType: FagsystemType.ORDNIÆR,
    }

export const formkravVilkårStub: IFormkravVilkår = {
    behandlingId: '56694255-4a4a-407e-9079-8b14a7acbe80',
    klagePart: VilkårStatus.OPPFYLT,
    klageKonkret: VilkårStatus.OPPFYLT,
    klagefristOverholdt: VilkårStatus.OPPFYLT,
    klagefristOverholdtUnntak: FormkravFristUnntak.IKKE_SATT,
    klageSignert: VilkårStatus.OPPFYLT,
    saksbehandlerBegrunnelse: '',
    endretTid: '2024-05-28T08:14:20.478',
    påklagetVedtak: {
        eksternFagsystemBehandlingId: '17934',
        påklagetVedtakstype: PåklagetVedtakstype.VEDTAK,
        fagsystemVedtak: fagsystemVedakStub,
        manuellVedtaksdato: undefined,
        // regelverk: "NASJONAL"
    },
};

export const brevmottakereStub: IBrevmottakere = {
    personer: [
        {
            personIdent: '25518735813',
            navn: 'HURTIG PLEIE',
            mottakerRolle: EBrevmottakerRolle.BRUKER,
        },
    ],
    organisasjoner: [],
};

export const behandlingshistorikkStub: IBehandlingshistorikk[] = [
    {
        behandlingId: '56694255-4a4a-407e-9079-8b14a7acbe80',
        steg: StegType.VURDERING,
        opprettetAv: 'Z994781',
        endretTid: '2024-05-28T08:24:17.341055',
    },
    {
        behandlingId: '56694255-4a4a-407e-9079-8b14a7acbe80',
        steg: StegType.FORMKRAV,
        opprettetAv: 'Z994781',
        endretTid: '2024-05-28T08:16:29.451124',
    },
    {
        behandlingId: '56694255-4a4a-407e-9079-8b14a7acbe80',
        steg: StegType.FORMKRAV,
        opprettetAv: 'Z994781',
        endretTid: '2024-05-28T08:15:29.345039',
    },
];
