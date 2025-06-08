import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useSkin from '../../utils/hooks/useSkin';

const SwitchTheme = () => {
  const { skin, changeSkinRedux } = useSkin()
  const [isChecked, setIsChecked] = useState(skin === 'dark');

  useEffect(() => {
    setIsChecked(skin === 'dark');
  }, [skin]);

  const handleChange = (e) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    changeSkinRedux(newChecked ? 'dark' : 'light');
  };

  return (
    <StyledWrapper className='flex'>
      <label className="switch">
        <span className="sun"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="#ffd43b"><circle r={5} cy={12} cx={12} /><path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z" /></g></svg></span>
        <span className="moon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" /></svg></span>
        <input
          checked={isChecked}
          type="checkbox"
          className="input"
          onChange={handleChange}
        />
        <span className="slider" />
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  --base-unit: 60px; /* Define a base unit */

  .switch {
    font-size: calc(var(--base-unit) / 3.5);
    position: relative;
    display: inline-block;
    width: calc(var(--base-unit) / 1.5);
    height: calc(var(--base-unit) / 3);
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #73C0FC;
    transition: .4s;
    border-radius: calc(var(--base-unit) / 3.2);
  }

  .slider:before {
    position: absolute;
    content: "";
    height: calc(var(--base-unit) / 3.2);
    width: calc(var(--base-unit) / 3.2);
    border-radius: calc(var(--base-unit) / 4.8);
    left: calc(var(--base-unit) / 48);
    bottom: calc(var(--base-unit) / 48);
    z-index: 2;
    background-color: #e8e8e8;
    transition: .4s;
  }

  .sun svg {
    position: absolute;
    top: calc(var(--base-unit) / 16);
    left: calc(var(--base-unit) / 2.67);
    z-index: 1;
    width: calc(var(--base-unit) / 4);
    height: calc(var(--base-unit) / 4);
  }

  .moon svg {
    fill: #ffe15f;
    position: absolute;
    top: calc(var(--base-unit) / 19.2);
    left: calc(var(--base-unit) / 19.2);
    z-index: 1;
    width: calc(var(--base-unit) / 4);
    height: calc(var(--base-unit) / 4);
  }

  /* .switch:hover */.sun svg {
    animation: rotate 15s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* .switch:hover */.moon svg {
    animation: tilt 5s linear infinite;
  }

  @keyframes tilt {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-10deg);
    }
    75% {
      transform: rotate(10deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  .input:checked + .slider {
    background-color: #26166B;
  }

  .input:focus + .slider {
    box-shadow: 0 0 1px #183153;
  }

  .input:checked + .slider:before {
    transform: translateX(calc(var(--base-unit) / 3.2));
  }
`;

export default SwitchTheme;