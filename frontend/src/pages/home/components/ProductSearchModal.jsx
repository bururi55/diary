import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ModalOverlay, ModalContent, GramsInputModal } from './modal';
import { request, debounce } from '../../../utils';
import { Icon } from '../../../components';
import { BreadUnitsCalculator } from './calculator';
import styled from 'styled-components';
import searchIcon from '/src/assets/icons/search-icon.png';

const ProductSearchModalContainer = ({ className, onNext, onCancel }) => {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shouldSearch, setShouldSearch] = useState(false);
  const [isGramsModalOpen, setIsGramsModalOpen] = useState(false);

  const startDelayedSearch = useMemo(() => debounce(setShouldSearch, 2000), []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await request(
          `/products?search=${searchPhrase}&page=1&limit=10`
        );
        if (response.data) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [shouldSearch]);

  const onSearch = ({ target }) => {
    setSearchPhrase(target.value);
    startDelayedSearch(!shouldSearch);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setIsGramsModalOpen(true);
  };

  const handleAddProduct = (productWithGrams) => {
    setSelectedProducts([...selectedProducts, productWithGrams]);
    setIsGramsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCancelProductSelection = () => {
    setSelectedProduct(null);
    setIsGramsModalOpen(false);
  };

  const selectedProductsWithBreadUnits = BreadUnitsCalculator({
    selectedProducts,
  });

  const totalBreadUnits = selectedProductsWithBreadUnits.reduce(
    (total, product) => total + parseFloat(product.breadUnits || 0),
    0
  );

  const handleNext = () => {
    onNext(selectedProductsWithBreadUnits, totalBreadUnits);
  };

  return (
    <ModalOverlay>
      <ModalContent className={className}>
        <h2>Поиск и выбор продуктов</h2>
        <SearchContainer>
          <StyledInput
            value={searchPhrase}
            placeholder="Поиск по продуктам..."
            onChange={onSearch}
          />
          <Icon
            src={searchIcon}
            fontSize="35px"
            margin="0px 0px 0px 5px"
            inactive={true}
          />
        </SearchContainer>
        <ProductsList>
          {products.map((product) => (
            <ProductItem
              key={product.id}
              onClick={() => handleProductSelect(product)}
            >
              <div className="product-name">{product.name}</div>
              <div className="product-carbs">
                {product.carbohydratesIn100Grams} г углеводов
              </div>
            </ProductItem>
          ))}
        </ProductsList>
        <SelectedProducts>
          <h3>Выбранные продукты</h3>
          <SelectedProductsHeader>
            <div>Название</div>
            <div>Граммы</div>
            <div>ХЕ</div>
          </SelectedProductsHeader>
          {selectedProductsWithBreadUnits.map((product, index) => (
            <SelectedProductItem key={index}>
              <div className="product-name">{product.name}</div>
              <div className="product-grams">{product.grams} г</div>
              <div className="product-bread-units">{product.breadUnits} ХЕ</div>
            </SelectedProductItem>
          ))}
        </SelectedProducts>
        <ModalActions>
          <StyledButton type="button" onClick={onCancel}>
            Отмена
          </StyledButton>
          <StyledButton type="button" onClick={handleNext}>
            Далее
          </StyledButton>
        </ModalActions>
      </ModalContent>
      {isGramsModalOpen && selectedProduct && (
        <GramsInputModal
          product={selectedProduct}
          onAdd={handleAddProduct}
          onCancel={handleCancelProductSelection}
        />
      )}
    </ModalOverlay>
  );
};

const SearchContainer = styled.div`
  display: flex;
  position: relative;
  width: 300px;
  height: 40px;
  margin: 5px auto;
`;

const StyledInput = styled.input`
  padding: 10px 32px 10px 10px;
  background: linear-gradient(
    to left,
    rgba(165, 231, 233, 0.7),
    rgba(251, 243, 174, 0.8)
  );
  border-radius: 5px;
  width: 100%;
`;

const ProductsList = styled.div`
  max-height: 120px;
  overflow-y: auto;
  margin: 10px auto;
  width: 200px;
`;

const ProductItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
`;

const SelectedProducts = styled.div`
  margin: 10px auto;
  width: 350px;
  text-align: center;
`;

const SelectedProductsHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  font-weight: bold;
  margin-bottom: 10px;
`;

const SelectedProductItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-top: 10px;
  border-bottom: 1px solid #ccc;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0px 0px 0px;
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  background: linear-gradient(
    to right,
    rgb(58 115 229 / 70%),
    rgb(239 85 83 / 70%)
  );
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  &:hover {
    background: linear-gradient(
      to right,
      rgb(58 115 229 / 100%),
      rgb(239 85 83 / 100%)
    );
  }
`;

export const ProductSearchModal = styled(ProductSearchModalContainer)``;

ProductSearchModalContainer.propTypes = {
  onNext: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
