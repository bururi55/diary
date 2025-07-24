import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Header, Footer, H2, Icon, Pagination } from '../../components';
import { setProducts } from '../../actions';
import { selectProducts, selectUserRole } from '../../selectors';
import { debounce, request } from '../../utils';
import { ROLE, PAGINATION_LIMIT } from '../../constants';
import { Modal } from './components';
import searchIcon from '/src/assets/icons/search-icon.png';
import addIcon from '/src/assets/icons/add-icon.png';
import saveIcon from '/src/assets/icons/save-icon.png';
import editProductIcon from '/src/assets/icons/edit-product-icon.png';
import deleteProductIcon from '/src/assets/icons/delete-product-icon.png';
import styled from 'styled-components';

const ProductsPageContainer = ({ className }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const userRole = useSelector(selectUserRole);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [shouldSearch, setShouldSearch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [editProductData, setEditProductData] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await request(
          `/products?search=${searchPhrase}&page=${page}&limit=${PAGINATION_LIMIT}`
        );
        if (response.data) {
          dispatch(setProducts(response.data.products));
          setLastPage(response.data.lastPage);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [page, shouldSearch, dispatch]);

  const startDelayedSearch = useMemo(() => debounce(setShouldSearch, 2000), []);

  const onSearch = ({ target }) => {
    setSearchPhrase(target.value);
    startDelayedSearch(!shouldSearch);
  };

  const handleAddProduct = async (product) => {
    try {
      const response = await request('/products', 'POST', product);
      if (response.data) {
        const updatedResponse = await request(
          `/products?search=${searchPhrase}&page=${page}&limit=${PAGINATION_LIMIT}`
        );
        if (updatedResponse.data) {
          dispatch(setProducts(updatedResponse.data.products));
        }
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
    setIsModalOpen(false);
  };

  const handleEdit = (product) => {
    setEditProductId(product.id);
    setEditProductData({ ...product });
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setEditProductData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (productId) => {
    try {
      const response = await request(
        `/products/${productId}`,
        'PATCH',
        editProductData
      );
      if (response.data) {
        const updatedResponse = await request(
          `/products?search=${searchPhrase}&page=${page}&limit=${PAGINATION_LIMIT}`
        );
        if (updatedResponse.data) {
          dispatch(setProducts(updatedResponse.data.products));
        }
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
    setEditProductId(null);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await request(`/products/${productId}`, 'DELETE');
      if (response.data) {
        const updatedResponse = await request(
          `/products?search=${searchPhrase}&page=${page}&limit=${PAGINATION_LIMIT}`
        );
        if (updatedResponse.data) {
          dispatch(setProducts(updatedResponse.data.products));
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className={className}>
      <Header />
      <H2>Продукты</H2>
      <SearchContainer>
        <input
          value={searchPhrase}
          placeholder="Поиск по продуктам..."
          onChange={onSearch}
        />
        <Icon
          inactive={true}
          src={searchIcon}
          fontSize="35px"
          margin="0px 0px 0px 5px"
        />
        {userRole === ROLE.ADMIN && (
          <Icon
            src={addIcon}
            fontSize="38px"
            margin="0px 0px 0px 10px"
            onClick={() => setIsModalOpen(true)}
          />
        )}
      </SearchContainer>
      <ProductsTable>
        <thead>
          <tr>
            <th className="Name">Название</th>
            <th>Углеводы</th>
            <th>Белки</th>
            <th>Жиры</th>
            {userRole === ROLE.ADMIN && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                {editProductId === product.id ? (
                  <input
                    type="text"
                    value={editProductData.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                  />
                ) : (
                  product.name
                )}
              </td>
              <td>
                {editProductId === product.id ? (
                  <input
                    type="number"
                    value={editProductData.carbohydratesIn100Grams}
                    onChange={(e) =>
                      handleInputChange(e, 'carbohydratesIn100Grams')
                    }
                  />
                ) : (
                  product.carbohydratesIn100Grams
                )}
              </td>
              <td>
                {editProductId === product.id ? (
                  <input
                    type="number"
                    value={editProductData.proteins}
                    onChange={(e) => handleInputChange(e, 'proteins')}
                  />
                ) : (
                  product.proteins
                )}
              </td>
              <td>
                {editProductId === product.id ? (
                  <input
                    type="number"
                    value={editProductData.fats}
                    onChange={(e) => handleInputChange(e, 'fats')}
                  />
                ) : (
                  product.fats
                )}
              </td>
              {userRole === ROLE.ADMIN && (
                <td>
                  {editProductId === product.id ? (
                    <Icon
                      src={saveIcon}
                      fontSize="22px"
                      margin="0px 0px 0px 0px"
                      onClick={() => handleSave(product.id)}
                    >
                      Сохранить
                    </Icon>
                  ) : (
                    <>
                      <Icon
                        src={editProductIcon}
                        fontSize="28px"
                        margin="0px 0px 0px 10px"
                        onClick={() => handleEdit(product)}
                      >
                        Редактировать
                      </Icon>
                      <Icon
                        src={deleteProductIcon}
                        fontSize="28px"
                        margin="0px 0px 0px 10px"
                        onClick={() => handleDelete(product.id)}
                      >
                        Удалить
                      </Icon>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </ProductsTable>
      {lastPage > 1 && products.length > 0 && (
        <Pagination page={page} lastPage={lastPage} setPage={setPage} />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProduct}
      />
      <Footer />
    </div>
  );
};

const SearchContainer = styled.div`
  display: flex;
  position: relative;
  width: 340px;
  height: 40px;
  margin: 5px auto;
  & > input {
    padding: 10px 32px 10px 10px;
    background: linear-gradient(
      to left,
      rgba(165, 231, 233, 0.7),
      rgba(251, 243, 174, 0.8)
    );
    border-radius: 5px;
    width: 100%;
  }
`;

const ProductsTable = styled.table`
  width: 960px;
  border-collapse: separate;
  border-spacing: 0;
  margin: 20px auto;
  background: linear-gradient(
    to left,
    rgba(165, 231, 233, 0.7),
    rgba(251, 243, 174, 0.8)
  );
  border-radius: 2px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  th,
  td {
    border: 1px solid #000;
    padding: 4px;
    text-align: center;
    color: #000;
    width: 280px;
    height: 30px;
  }

  th {
    height: 40px;
  }

  thead tr {
    font-size: 1.3rem;
    font-weight: bold;
  }
  tbody tr:last-child {
    border-bottom: 4px solid #000;
  }
  tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  thead {
    background: linear-gradient(
      to right,
      rgba(165, 231, 233, 0.7),
      rgba(251, 243, 174, 0.8)
    );
  }
  .Name {
    width: 400px;
  }

  input {
    width: 120px;
    text-align: center;
  }
`;

export const ProductsPage = styled(ProductsPageContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  ${H2} {
    margin-top: 90px;
    text-align: center;
  }
`;
