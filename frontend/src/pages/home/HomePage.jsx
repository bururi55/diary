import { useState } from 'react';
import { Header, Footer } from '../../components';
import {
  AddEntryButton,
  SugarLevelModal,
  ProductSearchModal,
  InsulinInputModal,
  ConfirmationModal,
} from './components';
import { useSelector } from 'react-redux';
import { selectUserEmail } from '../../selectors';
import styled from 'styled-components';

const HomePageContainer = ({ className }) => {
  const [isSugarLevelModalOpen, setIsSugarLevelModalOpen] = useState(false);
  const [isProductSearchModalOpen, setIsProductSearchModalOpen] =
    useState(false);
  const [isInsulinInputModalOpen, setIsInsulinInputModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [sugarLevel, setSugarLevel] = useState(null);
  const [totalBreadUnits, setTotalBreadUnits] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [insulinData, setInsulinData] = useState(null);
  const userEmail = useSelector(selectUserEmail);

  const handleSugarLevelNext = (level) => {
    setSugarLevel(level);
    setIsSugarLevelModalOpen(false);
    setIsProductSearchModalOpen(true);
  };

  const handleProductSearchNext = (products, totalBreadUnits) => {
    setSelectedProducts(products);
    setTotalBreadUnits(totalBreadUnits);
    setIsProductSearchModalOpen(false);
    setIsInsulinInputModalOpen(true);
  };

  const handleInsulinInputNext = (data) => {
    setInsulinData(data);
    setIsInsulinInputModalOpen(false);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmationNext = (data) => {
    console.log('Confirmation Data:', data);
    setIsConfirmationModalOpen(false);
  };

  return (
    <div className={className}>
      <Header />
      <main>
        <AddEntryButton onClick={() => setIsSugarLevelModalOpen(true)} />
        {isSugarLevelModalOpen && (
          <SugarLevelModal
            onNext={handleSugarLevelNext}
            onCancel={() => setIsSugarLevelModalOpen(false)}
          />
        )}
        {isProductSearchModalOpen && (
          <ProductSearchModal
            onNext={handleProductSearchNext}
            onCancel={() => setIsProductSearchModalOpen(false)}
          />
        )}
        {isInsulinInputModalOpen && (
          <InsulinInputModal
            currentSugarLevel={sugarLevel}
            totalBreadUnits={totalBreadUnits}
            userEmail={userEmail}
            onNext={handleInsulinInputNext}
            onCancel={() => setIsInsulinInputModalOpen(false)}
          />
        )}
        {isConfirmationModalOpen && (
          <ConfirmationModal
            data={{
              sugarLevel,
              selectedProducts,
              shortInsulinValue: insulinData.shortInsulinValue,
              longInsulinValue: insulinData.longInsulinValue,
            }}
            onNext={handleConfirmationNext}
            onCancel={() => setIsConfirmationModalOpen(false)}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export const HomePage = styled(HomePageContainer)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
`;
