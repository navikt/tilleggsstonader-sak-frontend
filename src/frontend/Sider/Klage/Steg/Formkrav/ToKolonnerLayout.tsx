import React from 'react';

import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    margin: 2rem;
    border-bottom: 3px solid #e9e7e7;

    @media (max-width: 1600px) {
        flex-direction: column;
    }
`;

const VenstreKolonne = styled.div`
    padding: 1.5rem 0;
    width: 50%;
    max-width: 50rem;

    @media (max-width: 1600px) {
        width: 100%;
    }
`;

const HøyreKolonne = styled.div`
    padding: 1.5rem 0;
    width: 50%;
    max-width: 50rem;

    @media (max-width: 1600px) {
        width: 100%;
    }
`;

interface Props {
    children: {
        venstre: React.ReactNode;
        høyre: React.ReactNode;
    };
}

export const ToKolonnerLayout: React.FC<Props> = ({ children: { venstre, høyre } }) => {
    return (
        <Container>
            <VenstreKolonne>{venstre}</VenstreKolonne>
            <HøyreKolonne>{høyre}</HøyreKolonne>
        </Container>
    );
};
