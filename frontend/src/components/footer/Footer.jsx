import { Ticker } from './ticker/Ticker';
import styled from 'styled-components';

const FooterContainer = ({ className }) => {
  return (
    <footer className={className}>
      <Ticker />
      <div>
        <p>
          &copy; {new Date().getFullYear()} BururikProd. Все права защищены.
        </p>
      </div>
    </footer>
  );
};

export const Footer = styled(FooterContainer)`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to right, rgb(161, 245, 248), rgb(240, 230, 140));
  padding: 10px;
  text-align: center;
  box-shadow: 0px 2px 17px #000;

  p {
    margin: 5px 0 0;
  }
`;
