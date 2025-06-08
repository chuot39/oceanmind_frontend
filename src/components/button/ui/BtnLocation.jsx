import React from 'react';
import styled from 'styled-components';

const BtnLocation = () => {
    return (
        <StyledWrapper>
            <div className="loader" />
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .loader {
    width: 25.8px;
    height: 25.8px;
    position: relative;
    transform: rotate(45deg);
  }

  .loader:before,
  .loader:after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50% 50% 0 50%;
    background: #0000;
    background-image: radial-gradient(circle 5.5px at 50% 50%,#0000 94%, #ff4747);
  }

  .loader:after {
    animation: pulse-ytk0dhmd 1s infinite;
    transform: perspective(336px) translateZ(0px);
  }

  @keyframes pulse-ytk0dhmd {
    to {
      transform: perspective(336px) translateZ(168px);
      opacity: 0;
    }
  }`;

export default BtnLocation;
