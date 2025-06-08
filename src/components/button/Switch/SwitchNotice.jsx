import React from 'react';
import styled from 'styled-components';

const SwitchNotice = ({ checked, onChange, id = 'checkboxInput' }) => {
  const checkboxId = `checkboxInput_${id}`;

  return (
    <StyledWrapper>
      <div>
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label className="toggleSwitch" htmlFor={checkboxId}>
          <div className="speaker">
            <svg viewBox="0 0 75 75" version={1.0} xmlns="http://www.w3.org/2000/svg">
              <path style={{ stroke: '#fff', strokeWidth: 5, strokeLinejoin: 'round', fill: '#fff' }} d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z" />
              <path style={{ fill: 'none', stroke: '#fff', strokeWidth: 5, strokeLinecap: 'round' }} d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6" />
            </svg>
          </div>
          <div className="mute-speaker">
            <svg strokeWidth={5} stroke="#fff" viewBox="0 0 75 75" version={1.0}>
              <path strokeLinejoin="round" fill="#fff" d="m39,14-17,15H6V48H22l17,15z" />
              <path strokeLinecap="round" fill="#fff" d="m49,26 20,24m0-24-20,24" />
            </svg>
          </div>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* The switch - the box around the speaker*/
  .toggleSwitch {
    width: 35px;
    height: 35px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-active);
    border-radius: 50%;
    cursor: pointer;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.13);
    overflow: hidden;
  }

  /* Hide default HTML checkbox */
  input[type="checkbox"] {
    display: none;
  }

  .bell {
    width: 18px;
  }

  .bell path {
    fill: white;
  }

  .speaker {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition-duration: 0.3s;
  }

  .speaker svg {
    width: 18px;
  }

  .mute-speaker {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    z-index: 3;
    transition-duration: 0.3s;
  }

  .mute-speaker svg {
    width: 18px;
  }

  input[type="checkbox"]:checked + .toggleSwitch .speaker {
    opacity: 0;
    transition-duration: 0.3s;
  }

  input[type="checkbox"]:checked + .toggleSwitch .mute-speaker {
    opacity: 1;
    transition-duration: 0.3s;
    background-color: red;
  }

  input[type="checkbox"]:active + .toggleSwitch {
    transform: scale(0.7);
  }

  input[type="checkbox"]:hover + .toggleSwitch {
    background-color: var(--color-primary);
  }`;

export default SwitchNotice;
