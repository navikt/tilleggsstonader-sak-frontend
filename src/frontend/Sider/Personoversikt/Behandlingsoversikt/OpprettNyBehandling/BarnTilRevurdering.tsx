import React, { useEffect } from 'react';

import { BodyShort, Checkbox, CheckboxGroup, List } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import DataViewer from '../../../../komponenter/DataViewer';
import { byggHenterRessurs, Ressurs } from '../../../../typer/ressurs';

export interface BarnTilRevurderingResponse {
    barn: BarnTilRevurdering[];
}

interface BarnTilRevurdering {
    ident: string;
    navn: string;
    finnesPåForrigeBehandling: boolean;
}

const filterEksisterendeBarn = (barnTilRevurdering: BarnTilRevurderingResponse) =>
    barnTilRevurdering.barn.filter((b) => b.finnesPåForrigeBehandling);

const filterValgbareBarn = (barnTilRevurdering: BarnTilRevurderingResponse) =>
    barnTilRevurdering.barn.filter((b) => !b.finnesPåForrigeBehandling);

const BarnTilRevurdering: React.FC<{
    fagsakId: string;
    barnTilRevurdering: Ressurs<BarnTilRevurderingResponse>;
    settBarnTilRevurdering: React.Dispatch<
        React.SetStateAction<Ressurs<BarnTilRevurderingResponse>>
    >;
    settValgteBarn: (identer: string[]) => void;
}> = ({ fagsakId, barnTilRevurdering, settBarnTilRevurdering, settValgteBarn }) => {
    const { request } = useApp();

    const hentBarnTilRevurdering = (fagsakId: string) => {
        settBarnTilRevurdering(byggHenterRessurs());
        request<BarnTilRevurderingResponse, null>(
            `/api/sak/behandling/barn-til-revurdering/${fagsakId}`
        ).then(settBarnTilRevurdering);
    };

    useEffect(() => {
        hentBarnTilRevurdering(fagsakId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fagsakId]);

    return (
        <DataViewer response={{ barnTilRevurdering }}>
            {({ barnTilRevurdering }) => {
                const eksisterendeBarn = filterEksisterendeBarn(barnTilRevurdering);
                const valgbareBarn = filterValgbareBarn(barnTilRevurdering);
                return (
                    <>
                        {eksisterendeBarn.length > 0 ? (
                            <List
                                title={'Barn det er søkt om tilleggsstønad for tilsyn barn for før'}
                                size={'small'}
                            >
                                {eksisterendeBarn.map(({ ident, navn }) => (
                                    <List.Item key={ident}>
                                        {ident} - {navn}
                                    </List.Item>
                                ))}
                            </List>
                        ) : (
                            <BodyShort>Finnes ingen barn på forrige behandling</BodyShort>
                        )}

                        {valgbareBarn.length > 0 && (
                            <CheckboxGroup
                                legend={'Velg eventuelle nye barn det søkes stønad for'}
                                onChange={settValgteBarn}
                            >
                                {valgbareBarn.map(({ ident, navn }) => (
                                    <Checkbox key={ident} value={ident}>
                                        {ident} - {navn}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default BarnTilRevurdering;
