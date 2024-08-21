import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
    Button,
    Checkbox,
    CheckboxGroup,
    Detail,
    Heading,
    TextField,
    VStack,
} from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';
import DataViewer from '../../komponenter/DataViewer';
import { IdentRequest } from '../../typer/identrequest';
import {
    byggFeiletRessurs,
    byggHenterRessurs,
    byggTomRessurs,
    Ressurs,
    RessursStatus,
} from '../../typer/ressurs';
import { erGyldigFnr } from '../../utils/utils';

const Container = styled.div`
    margin: 2rem;
    width: 40rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

interface Personinfo {
    barn: {
        ident: string;
        navn: string;
    }[];
}

interface OpprettFørstegansbehandlingRequest {
    ident: string;
    valgteBarn: string[];
}

const OpprettFørstegangsbehandlingAdmin: React.FC = () => {
    const { request } = useApp();
    const navigate = useNavigate();
    const [ident, settIdent] = useState<string>('');
    const [valgteBarn, settValgteBarn] = useState<string[]>([]);

    const [personinfo, settPersoninfo] = useState<Ressurs<Personinfo>>(byggTomRessurs());

    const [opprettBehandlingResponse, settOpprettBehandlingResponse] =
        useState<Ressurs<null>>(byggTomRessurs());

    const hentPersoninfo = () => {
        settOpprettBehandlingResponse(byggTomRessurs());
        settValgteBarn([]);
        if (!erGyldigFnr(ident)) {
            settPersoninfo(byggFeiletRessurs('Ikke gyldig ident.'));
            return;
        }
        settPersoninfo(byggHenterRessurs());
        request<Personinfo, IdentRequest>(`/api/sak/behandling/admin/hent-person`, 'POST', {
            ident,
        }).then(settPersoninfo);
    };

    const opprettBehandling = () => {
        if (!valgteBarn.length) {
            settOpprettBehandlingResponse(byggFeiletRessurs('Må velge minimum 1 barn.'));
            return;
        }
        settOpprettBehandlingResponse(byggHenterRessurs());
        request<Personinfo, OpprettFørstegansbehandlingRequest>(
            `/api/sak/behandling/admin/opprett-foerstegangsbehandling`,
            'POST',
            { ident, valgteBarn }
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                navigate(`/behandling/${res.data}`);
            } else {
                settOpprettBehandlingResponse(res);
            }
        });
    };

    return (
        <Container>
            <div>
                <Heading size={'medium'}>[Admin] Opprett førstegangsbehandling Tilsyn barn</Heading>
                <Detail>Opprett en førstegangsbehandling med fødelsnummer.</Detail>
                <Detail>Man må velge hvilke barn som skal være med i behandlingen.</Detail>
            </div>
            <VStack gap={'1'}>
                <TextField
                    label={'Søkers ident'}
                    onChange={(e) => {
                        settIdent(e.target.value);
                        settValgteBarn([]);
                        settPersoninfo(byggTomRessurs());
                        settOpprettBehandlingResponse(byggTomRessurs());
                    }}
                />
                <Button
                    variant={'primary'}
                    size={'small'}
                    disabled={!ident.trim()}
                    onClick={hentPersoninfo}
                >
                    Hent barn til person
                </Button>
            </VStack>

            <DataViewer response={{ personinfo }}>
                {({ personinfo }) => (
                    <>
                        <Heading size={'small'}>Informasjon om søker</Heading>
                        <CheckboxGroup
                            legend={'Barn til søker'}
                            onChange={(values) => settValgteBarn(values)}
                        >
                            {personinfo.barn.map(({ ident, navn }) => (
                                <Checkbox key={ident} value={ident}>
                                    {ident} - {navn}
                                </Checkbox>
                            ))}
                        </CheckboxGroup>
                        <Button variant={'secondary'} size={'small'} onClick={opprettBehandling}>
                            Opprett behandling fra søknad
                        </Button>
                    </>
                )}
            </DataViewer>
            <DataViewer response={{ opprettBehandlingResponse }}>{() => <>Ok</>}</DataViewer>
        </Container>
    );
};

export default OpprettFørstegangsbehandlingAdmin;
