import React from 'react';
import styled from 'styled-components';

const BtnNext = ({ name = 'NEXT', autoFocus = false, size = 1 }) => {
    return (
        <StyledWrapper $size={size}>
            <div className="btn-container">
                <a className={`btn-content ${autoFocus ? 'auto-focused' : ''}`}>
                    <span className="btn-title">{name}</span>
                    <span className="icon-arrow">
                        <svg width="66px" height="43px" viewBox="0 0 66 43" xmlns="http://www.w3.org/2000/svg">
                            <g id="arrow" fill="none" fillRule="evenodd">
                                <path id="arrow-icon-one" d="M40.15,3.89 L43.98,0.14 C44.17,-0.05 44.48,-0.05 44.68,0.14 L65.69,20.78 C66.08,21.17 66.09,21.80 65.70,22.20 L44.68,42.86 C44.48,43.05 44.17,43.05 43.98,42.86 L40.15,39.11 C39.96,38.91 39.95,38.59 40.15,38.40 L56.99,21.86 C57.19,21.66 57.19,21.35 57.00,21.15 L40.15,4.61 C39.96,4.41 39.95,4.10 40.15,3.90 Z" fill="#FFFFFF" />
                                <path id="arrow-icon-two" d="M20.15,3.89 L23.98,0.14 C24.17,-0.05 24.48,-0.05 24.68,0.14 L45.69,20.78 C46.08,21.17 46.09,21.80 45.70,22.20 L24.68,42.86 C24.48,43.05 24.17,43.05 23.98,42.86 L20.15,39.11 C19.96,38.91 19.95,38.59 20.15,38.40 L36.99,21.86 C37.19,21.66 37.19,21.35 37.00,21.15 L20.15,4.61 C19.96,4.41 19.95,4.10 20.15,3.90 Z" fill="#FFFFFF" />
                                <path id="arrow-icon-three" d="M0.15,3.89 L3.98,0.14 C4.17,-0.05 4.48,-0.05 4.68,0.14 L25.69,20.78 C26.08,21.17 26.09,21.80 25.70,22.20 L4.68,42.86 C4.48,43.05 4.17,43.05 3.98,42.86 L0.15,39.11 C-0.04,38.91 -0.05,38.59 0.15,38.40 L16.99,21.86 C17.19,21.66 17.19,21.35 17.00,21.15 L0.15,4.61 C-0.04,4.41 -0.05,4.10 0.15,3.90 Z" fill="#FFFFFF" />
                            </g>
                        </svg>
                    </span>
                </a>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  ${({ $size }) => {
        const sizes = {
            1: {
                fontSize: 12,
                padding: '0px 13px',
                iconScale: 0.3,
                iconMarginLeft: 6,
                iconMarginRight: 8,
                iconWidth: 1,
                height: 25,
            },
            2: {
                fontSize: 14,
                padding: '6px 16px',
                iconScale: 0.5,
                iconMarginLeft: 10,
                iconMarginRight: 15,
                iconWidth: 16,
            },
            3: {
                fontSize: 20,
                padding: '8px 22px',
                iconScale: 0.55,
                iconMarginLeft: 12,
                iconMarginRight: 20,
                iconWidth: 18,
            },
            4: {
                fontSize: 30,
                padding: '10px 30px',
                iconScale: 0.6,
                iconMarginLeft: 15,
                iconMarginRight: 25,
                iconWidth: 20,
            },
        };

        const s = sizes[$size] || sizes[4];

        return `
      .btn-container {
        height: ${s.height}px;
        display: flex;
        justify-content: center;
        --color-text: #ffffff;
        --color-background: #ff135a;
        --color-outline: #ff145b80;
        --color-shadow: #00000080;
      }

      .btn-content {
        display: flex;
        align-items: center;
        padding: ${s.padding};
        text-decoration: none;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        font-size: ${s.fontSize}px;
        color: var(--color-text);
        background: var(--color-background);
        transition: 1s;
        border-radius: 100px;
        box-shadow: 0 0 0.2em 0 var(--color-background);
      }

      .btn-content:hover, .btn-content:focus, .btn-content.auto-focused {
        transition: 0.5s;
        -webkit-animation: btn-content 1s;
        animation: btn-content 1s;
        outline: 0.1em solid transparent;
        outline-offset: 0.2em;
        box-shadow: 0 0 0.4em 0 var(--color-background);
      }

      .btn-content .icon-arrow {
        transition: 0.5s;
        margin-right: 0px;
        transform: scale(${s.iconScale});
        width: ${s.iconWidth}px;
        margin-left: ${s.iconMarginLeft}px;
        position: relative;
      }

      .btn-content:hover .icon-arrow,
      .btn-content.auto-focused .icon-arrow {
        margin-right: ${s.iconMarginRight}px;
      }

      #arrow-icon-one {
        transition: 0.4s;
        transform: translateX(-60%);
      }

      #arrow-icon-two {
        transition: 0.5s;
        transform: translateX(-30%);
      }

      .btn-content:hover #arrow-icon-three,
      .btn-content.auto-focused #arrow-icon-three {
        animation: color_anim 1s infinite 0.2s;
      }

      .btn-content:hover #arrow-icon-one,
      .btn-content.auto-focused #arrow-icon-one {
        transform: translateX(0%);
        animation: color_anim 1s infinite 0.6s;
      }

      .btn-content:hover #arrow-icon-two,
      .btn-content.auto-focused #arrow-icon-two {
        transform: translateX(0%);
        animation: color_anim 1s infinite 0.4s;
      }

      @keyframes color_anim {
        0% { fill: white; }
        50% { fill: var(--color-background); }
        100% { fill: white; }
      }

      @-webkit-keyframes btn-content {
        0% {
          outline: 0.2em solid var(--color-background);
          outline-offset: 0;
        }
      }

      @keyframes btn-content {
        0% {
          outline: 0.2em solid var(--color-background);
          outline-offset: 0;
        }
      }
    `;
    }}
`;

export default BtnNext;
