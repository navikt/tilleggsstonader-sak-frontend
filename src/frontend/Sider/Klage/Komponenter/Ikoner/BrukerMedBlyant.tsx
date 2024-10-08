import * as React from 'react';

import { APurple500, AWhite } from '@navikt/ds-tokens/dist/tokens';

interface IBrukerMedBlyant {
    className?: string;
    heigth?: number;
    width?: number;
    backgroundColor?: string;
    frontColor?: string;
}

//Kopi av user-edit-2
const BrukerMedBlyant: React.FunctionComponent<IBrukerMedBlyant> = ({
    className,
    heigth,
    width,
    backgroundColor,
    frontColor,
}) => {
    return (
        <svg
            aria-labelledby={'Bruker'}
            className={className}
            height={heigth}
            width={width}
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title id={'brukerikon'}>Bruker ikon</title>
            <g>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                    fill={backgroundColor ? backgroundColor : APurple500}
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.9331 11.1025L11.236 13.799C11.2035 13.831 11.1805 13.8705 11.1677 13.9142L11.0669 14.2668H4.96614C4.8952 14.2668 4.82694 14.2385 4.77734 14.1884C4.72667 14.1377 4.69894 14.0689 4.69947 13.998L4.69957 13.9921C4.70139 13.8769 4.72289 12.5201 4.97947 11.7452C5.18427 11.1281 6.17414 10.8012 7.42854 10.3873L7.4412 10.3831L7.44122 10.3831L7.44124 10.3831C7.76952 10.2745 8.1074 10.1628 8.4328 10.0438V9.0497C8.17414 8.87636 7.6968 8.4321 7.6392 7.4881C7.4424 7.36596 7.31974 7.1009 7.31974 6.76223C7.31974 6.58036 7.35814 6.4065 7.42854 6.2721C7.47014 6.1921 7.524 6.12596 7.58587 6.07476C7.468 5.66836 7.27014 4.9473 7.62694 4.5601C7.77734 4.3969 7.9912 4.3233 8.2664 4.33823C8.5784 3.7985 9.44987 3.6001 10.1661 3.6001C10.9747 3.6001 11.9816 3.8529 12.1581 4.56436C12.3048 5.1521 12.0925 5.72436 11.9624 6.05236C12.1181 6.19316 12.2125 6.43903 12.2125 6.74303C12.2125 7.08916 12.0893 7.36116 11.8941 7.48596C11.8371 8.43156 11.3587 8.87636 11.0995 9.0497V10.0438C11.4296 10.1644 11.772 10.2774 12.1048 10.3873C12.8403 10.63 13.484 10.8433 13.9331 11.1025ZM11.8995 13.8897L14.3608 11.4289L14.4563 11.3329L16.1667 13.0433L13.6099 15.6001L11.8995 13.8897ZM11.1101 16.0605C11.0829 16.1538 11.1091 16.2541 11.1779 16.3224C11.228 16.373 11.2963 16.4002 11.3661 16.4002C11.3907 16.4002 11.4152 16.397 11.4392 16.3901L13.1555 15.9L11.6003 14.3448L11.1101 16.0605ZM16.0888 10.0781L17.4221 11.4114C17.4717 11.461 17.5 11.5287 17.5 11.5997C17.5 11.6706 17.4717 11.7383 17.4221 11.7885L16.5437 12.6663L14.8333 10.9559L15.7117 10.0781C15.8157 9.97407 15.9848 9.97407 16.0888 10.0781Z"
                    fill={frontColor ? frontColor : AWhite}
                />
            </g>
        </svg>
    );
};

export default BrukerMedBlyant;
