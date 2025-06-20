import React from 'react';
import styled from 'styled-components';

const Toggle = ({ value }) => {
  return (
    <StyledWrapper>
      <label><input checked={value} name="dummy" type="checkbox" className="bubble" /></label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  label, .bubble {
    display: block;
    -webkit-tap-highlight-color: transparent;
  }

  label {
    animation: float74 4s ease-in-out infinite;
  }

  .bubble, .bubble:before, .bubble:after {
    transition-duration: 0.2s;
  }

  .bubble, .bubble:after {
    border-radius: 50%;
  }

  .bubble {
    background-image: radial-gradient(8% 8% at 22% 28%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
  		radial-gradient(8% 8% at 23% 27%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
  		radial-gradient(8% 8% at 24% 26%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
  		radial-gradient(8% 8% at 25% 25%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
  		radial-gradient(8% 8% at 26% 24%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
  		radial-gradient(8% 8% at 27% 23%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
  		radial-gradient(8% 8% at 28% 22%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%);
    box-shadow: 0 -0.06em 0.1em hsl(120,90%,100%) inset,
  		0 -0.15em 0.4em hsl(120,90%,45%) inset,
  		0 0.05em 0.05em hsl(120,90%,45%) inset,
  		0.05em 0 0.1em hsl(120,90%,100%) inset,
  		-0.05em 0 0.1em hsl(120,90%,100%) inset,
  		0 0.1em 0.4em hsl(120,90%,60%) inset;
    cursor: pointer;
    position: relative;
    width: 1.3em;
    height: 1.3em;
    transform-style: preserve-3d;
    transition-property: box-shadow, transform, width, height;
    transition-timing-function: ease-in-out, ease-in-out, var(--bubbleTiming), var(--bubbleTiming);
    will-change: transform;
    -webkit-appearance: none;
    appearance: none;
    z-index: 0;
  }

  .bubble:before, .bubble:after {
    content: "";
    display: block;
    position: absolute;
    transition-timing-function: var(--bubbleTiming);
  }

  .bubble:before {
    border-radius: 0.975em;
    box-shadow: 0 0 0 0.65em hsl(0,0%,100%) inset;
    filter: drop-shadow(0.78em 0.78em 4px hsla(0,0%,0%,0.2));
    top: 50%;
    left: 50%;
    width: 0.65em;
    height: 0.65em;
    transform: translate3d(-50%,-50%,-1px);
    z-index: -1;
  }

  .bubble:after {
    background: radial-gradient(100% 100% at center,hsla(0,0%,0%,0) 35%,hsla(0,0%,0%,0.2) 48%,hsla(0,0%,0%,0) 50%);
    filter: blur(4px);
    top: 0.26em;
    left: 0.26em;
    width: 100%;
    height: 100%;
    transform: translate3d(0,0,-1px);
    z-index: -2;
  }

  .bubble:focus, .bubble:hover {
    transform: scale(1); // Giữ nguyên kích thước
    outline: none;
  }

  .bubble:focus:active, .bubble:hover:active {
    width: 1.3em; // Giữ nguyên kích thước
    height: 1.3em; // Giữ nguyên kích thước
  }

  .bubble:focus:before, .bubble:hover:before {
    filter: drop-shadow(0.78em 0.78em 4px hsla(0,0%,0%,0.2));
  }

  .bubble:focus:after, .bubble:hover:after {
    transform: translate3d(0,0,-1px);
  }

  .bubble:checked {
    box-shadow: 0 -0.06em 0.1em hsl(0,90%,100%) inset,
  		0 -0.15em 0.4em hsl(0,90%,45%) inset,
  		0 0.05em 0.05em hsl(0,90%,45%) inset,
  		0.05em 0 0.1em hsl(0,90%,100%) inset,
  		-0.05em 0 0.1em hsl(0,90%,100%) inset,
  		0 0.1em 0.4em hsl(0,90%,60%) inset;
  }

  .bubble:checked:before {
    border-radius: 0.325em;
    width: 0.221em;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    label {
      animation: none;
    }

    .bubble, .bubble:before, .bubble:after {
      transition-duration: 0s;
    }

    .bubble:focus, .bubble:hover {
      transform: scale(1);
    }

    .bubble:focus:active, .bubble:hover:active {
      width: 1.3em; // Giữ nguyên kích thước
      height: 1.3em; // Giữ nguyên kích thước
    }

    .bubble:focus:before, .bubble:hover:before {
      filter: drop-shadow(0.78em 0.78em 4px hsla(0,0%,0%,0.2));
    }

    .bubble:focus:after, .bubble:hover:after {
      transform: translate3d(0,0,-1px);
    }
  }

  /* Animations */
  @keyframes float74 {
    from, to {
      transform: translate(0,3%);
    }

    25% {
      transform: translate(-3%,0);
    }

    50% {
      transform: translate(0,-3%);
    }

    75% {
      transform: translate(3%,0);
    }
  }
`;

export default Toggle;