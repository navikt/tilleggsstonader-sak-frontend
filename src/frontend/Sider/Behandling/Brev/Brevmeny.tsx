import React from 'react';

import Delmal from './Delmal';
import { MalStruktur } from './typer';

interface Props {
    mal: MalStruktur;
}

const Brevmeny: React.FC<Props> = ({ mal }) => {
    return (
        <>
            {mal.delmaler.map((delmal) => (
                <Delmal delmal={delmal} key={delmal._id} />
            ))}
        </>
    );
};

export default Brevmeny;
