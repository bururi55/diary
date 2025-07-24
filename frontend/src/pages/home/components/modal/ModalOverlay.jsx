import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: linear-gradient(
    to right,
    rgba(165, 231, 233, 1),
    rgba(251, 243, 174, 1)
  );
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  height: 650px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.6);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
