import React, { useRef, useState } from 'react';

import { ChatElipsisIcon } from '@navikt/aksel-icons';
import { Button, Popover } from '@navikt/ds-react';

import { henlagtÅrsakTilTekst } from '../../../typer/behandling/behandlingÅrsak';
import { TabellBehandling } from '../../../utils/behandlingutil';

const HenlagtÅrsakOgBegrunnelse: React.FC<{ behandling: TabellBehandling }> = ({ behandling }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [erPopoverÅpen, settErPopoverÅpen] = useState(false);

    return (
        <>
            <Button
                icon={<ChatElipsisIcon title="Årsak og begrunnelse for opphør" />}
                ref={buttonRef}
                onClick={() => settErPopoverÅpen((prevState) => !prevState)}
                variant={'tertiary'}
                size={'xsmall'}
            />

            <Popover
                anchorEl={buttonRef.current}
                open={erPopoverÅpen}
                onClose={() => settErPopoverÅpen(false)}
            >
                <Popover.Content>
                    {`Årsak: ${behandling.henlagtÅrsak !== undefined && henlagtÅrsakTilTekst[behandling.henlagtÅrsak]}`}
                    <br />
                    {`Begrunnelse: ${behandling.henlagtBegrunnelse ?? ''}`}
                </Popover.Content>
            </Popover>
        </>
    );
};

export default HenlagtÅrsakOgBegrunnelse;
