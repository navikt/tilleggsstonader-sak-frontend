import React from 'react';

import { FritekstAvsnitt } from '../typer';

interface Props {
    avsnitt?: FritekstAvsnitt[];
}

export const FritekstSerializer: React.FC<Props> = ({ avsnitt }) => {
    return (
        <div>
            {avsnitt &&
                avsnitt.map((avsnitt, index) => (
                    <p key={index}>
                        {avsnitt.deloverskrift && <strong>{avsnitt.deloverskrift} </strong>}
                        {avsnitt.deloverskrift && <br />}
                        {avsnitt.innhold && (
                            <span style={{ whiteSpace: 'pre-wrap' }}>{avsnitt.innhold}</span>
                        )}
                    </p>
                ))}
        </div>
    );
};
