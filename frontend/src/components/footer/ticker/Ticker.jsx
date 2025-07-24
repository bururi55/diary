import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAdvices } from '../../../actions';
import { request } from '../../../utils';
import styled, { keyframes } from 'styled-components';

const tickerAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const TickerContainer = ({ className }) => {
  const advices = useSelector((state) => state.advices.advices);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedAdvices = localStorage.getItem('advices');
    if (savedAdvices) {
      dispatch(setAdvices(JSON.parse(savedAdvices)));
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchAdvices = async () => {
      const response = await request('/recommendations', 'GET');
      if (response.data) {
        const shuffledAdvices = response.data.sort(() => 0.5 - Math.random());
        dispatch(setAdvices(shuffledAdvices));
        localStorage.setItem('advices', JSON.stringify(shuffledAdvices));
      }
    };

    if (advices.length === 0) {
      fetchAdvices();
    }
  }, [dispatch, advices.length]);

  return (
    <div className={className}>
      <div className="ticker-content">
        {[...advices, ...advices].map((advice, index) => (
          <span className="ticker-item" key={index}>
            {advice.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export const Ticker = styled(TickerContainer)`
  width: 100%;
  overflow: hidden;
  background-image: linear-gradient(
    to right,
    rgb(161, 245, 248),
    rgb(240, 230, 140)
  );
  padding: 10px 0;

  .ticker-content {
    display: inline-block;
    white-space: nowrap;
    animation: ${tickerAnimation} 850s linear infinite;
    animation-delay: 0s;
    font-size: 0.93rem;
  }

  .ticker-item {
    display: inline-block;
    padding-right: 300px;
  }
`;
