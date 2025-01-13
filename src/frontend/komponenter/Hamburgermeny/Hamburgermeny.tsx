import React, { FC, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import { MenuHamburgerIcon } from '@navikt/aksel-icons';

interface HamburgerMenyInnholdProps {
    $åpen: boolean;
}

const HamburgerMenyIkon = styled(MenuHamburgerIcon)`
    margin: 1rem 1rem 0 1rem;

    &:hover {
        cursor: pointer;
    }
`;

const HamburgerWrapper = styled.div`
    position: relative;
`;

const HamburgerMenyInnhold = styled.div<HamburgerMenyInnholdProps>`
    display: ${(props) => (props.$åpen ? 'block' : 'none')};

    position: fixed;

    background-color: white;

    right: 1rem;

    border: 1px solid grey;

    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
    -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);

    white-space: nowrap;

    ul,
    li {
        margin: 0;
        padding: 0;
    }

    li {
        padding: 0.5rem;

        list-style-type: none;
    }

    li:hover {
        background-color: #0166c5;
        color: white;
        cursor: pointer;
    }
`;

const Knapp = styled.button`
    height: 100%;
    width: 100%;

    text-align: left;
`;

export interface MenyItem {
    tekst: string;
    onClick: () => void;
}

export interface Props {
    items: MenyItem[];
    className?: string;
}

export const Hamburgermeny: FC<Props> = ({ className, items }) => {
    const ref = useRef(null);
    const [åpenHamburgerMeny, settÅpenHamburgerMeny] = useState<boolean>(false);

    useEffect(() => {
        const håndterKlikkUtenforKomponent = (event: { target: never }) => {
            // @ts-expect-error ref mangler type
            if (åpenHamburgerMeny && ref.current && !ref.current.contains(event.target)) {
                settÅpenHamburgerMeny(false);
            }
        };

        // @ts-expect-error Mangler type
        document.addEventListener('click', håndterKlikkUtenforKomponent, true);

        return () => {
            // @ts-expect-error Mangler type
            document.removeEventListener('click', håndterKlikkUtenforKomponent, true);
        };
    }, [åpenHamburgerMeny]);

    return (
        <HamburgerWrapper className={className} ref={ref}>
            <HamburgerMenyIkon
                fontSize="1.5rem"
                onClick={() => {
                    settÅpenHamburgerMeny(!åpenHamburgerMeny);
                }}
            />
            <HamburgerMenyInnhold $åpen={åpenHamburgerMeny}>
                <ul>
                    {items.map((p) => (
                        <li key={p.tekst}>
                            <Knapp
                                onClick={() => {
                                    settÅpenHamburgerMeny(false);
                                    p.onClick();
                                }}
                            >
                                {p.tekst}
                            </Knapp>
                        </li>
                    ))}
                </ul>
            </HamburgerMenyInnhold>
        </HamburgerWrapper>
    );
};
