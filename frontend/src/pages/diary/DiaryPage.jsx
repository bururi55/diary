import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Header, Footer, Icon, H2, Pagination } from '../../components';
import { request } from '../../utils';
import { useSelector } from 'react-redux';
import { selectUserEmail, selectUserRole } from '../../selectors';
import * as XLSX from 'xlsx';
import { PAGINATION_LIMIT_DIARY } from '../../constants';
import { ROLE } from '../../constants';
import excelIcon from '/src/assets/icons/excel-icon.png';
import saveIcon from '/src/assets/icons/save-icon.png';
import editProductIcon from '/src/assets/icons/edit-product-icon.png';
import deleteProductIcon from '/src/assets/icons/delete-product-icon.png';

const DiaryPageContainer = ({ className }) => {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [editEntryId, setEditEntryId] = useState(null);
  const [editEntryData, setEditEntryData] = useState({});
  const userEmail = useSelector(selectUserEmail);
  const userRole = useSelector(selectUserRole);

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        const response = await request(
          `/diary?email=${userEmail}&page=${page}&limit=${PAGINATION_LIMIT_DIARY}`
        );
        if (response.data) {
          setEntries(response.data.entries || []);
          setLastPage(response.data.lastPage || 1);
        } else {
          setEntries([]);
          setLastPage(1);
        }
      } catch (error) {
        console.error('Error fetching diary entries:', error);
        setEntries([]);
        setLastPage(1);
      }
    };
    fetchDiaryEntries();
  }, [userEmail, page]);

  const handleEdit = (entry) => {
    setEditEntryId(entry._id);
    setEditEntryData({ ...entry });
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setEditEntryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (entryId) => {
    try {
      const response = await request(
        `/diary/${entryId}`,
        'PATCH',
        editEntryData
      );
      if (response.data) {
        const updatedResponse = await request(
          `/diary?email=${userEmail}&page=${page}&limit=${PAGINATION_LIMIT_DIARY}`
        );
        if (updatedResponse.data) {
          setEntries(updatedResponse.data.entries || []);
        }
      }
    } catch (error) {
      console.error('Error updating entry:', error);
    }
    setEditEntryId(null);
  };

  const handleDelete = async (entryId) => {
    try {
      const response = await request(`/diary/${entryId}`, 'DELETE');
      if (response.data) {
        const updatedResponse = await request(
          `/diary?email=${userEmail}&page=${page}&limit=${PAGINATION_LIMIT_DIARY}`
        );
        if (updatedResponse.data) {
          setEntries(updatedResponse.data.entries || []);
        }
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const exportToExcel = () => {
    if (!entries || entries.length === 0) {
      console.error('No entries to export');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      entries.map((entry) => ({
        Дата: new Date(entry.date).toLocaleString(),
        'Уровень сахара': entry.sugarLevel,
        'Общее количество ХЕ': parseFloat(entry.totalBreadUnits).toFixed(2),
        'Короткий инсулин': entry.shortInsulinValue,
        'Длинный инсулин': entry.longInsulinValue || 'Не указано',
        Комментарий: entry.comment || 'Нет комментария',
        Продукты: entry.products
          .map((p) => `${p.productId.name} - ${p.grams} г`)
          .join('; '),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Дневник');
    XLSX.writeFile(workbook, 'Дневник.xlsx');
  };

  return (
    <div className={className}>
      <Header />
      <H2>Дневник</H2>
      <div className="export-container">
        <Icon
          src={excelIcon}
          margin="0 5px -10px 0"
          onClick={exportToExcel}
          inactive={false}
          fontSize="32px"
        />
        Скачать
      </div>
      <DiaryTable>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Уровень сахара</th>
            <th>Общее количество ХЕ</th>
            <th>Короткий инсулин</th>
            <th>Длинный инсулин</th>
            <th>Комментарий</th>
            <th>Продукты</th>
            {userRole === ROLE.ADMIN && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {entries.length > 0 ? (
            entries.map((entry) => (
              <tr key={entry._id}>
                <td>
                  {editEntryId === entry._id ? (
                    <StyledInput
                      type="text"
                      value={editEntryData.date}
                      onChange={(e) => handleInputChange(e, 'date')}
                    />
                  ) : (
                    new Date(entry.date).toLocaleString()
                  )}
                </td>
                <td>
                  {editEntryId === entry._id ? (
                    <StyledInput
                      type="number"
                      value={editEntryData.sugarLevel}
                      onChange={(e) => handleInputChange(e, 'sugarLevel')}
                    />
                  ) : (
                    entry.sugarLevel
                  )}
                </td>
                <td>
                  {editEntryId === entry._id ? (
                    <StyledInput
                      type="number"
                      value={editEntryData.totalBreadUnits}
                      onChange={(e) => handleInputChange(e, 'totalBreadUnits')}
                    />
                  ) : (
                    parseFloat(entry.totalBreadUnits).toFixed(2)
                  )}
                </td>
                <td>
                  {editEntryId === entry._id ? (
                    <StyledInput
                      type="number"
                      value={editEntryData.shortInsulinValue}
                      onChange={(e) =>
                        handleInputChange(e, 'shortInsulinValue')
                      }
                    />
                  ) : (
                    entry.shortInsulinValue
                  )}
                </td>
                <td>
                  {editEntryId === entry._id ? (
                    <StyledInput
                      type="number"
                      value={editEntryData.longInsulinValue || ''}
                      onChange={(e) => handleInputChange(e, 'longInsulinValue')}
                    />
                  ) : (
                    entry.longInsulinValue || 'Не указано'
                  )}
                </td>
                <td className="comment-cell">
                  {editEntryId === entry._id ? (
                    <StyledInput
                      type="text"
                      value={editEntryData.comment || ''}
                      onChange={(e) => handleInputChange(e, 'comment')}
                    />
                  ) : (
                    entry.comment || 'Нет комментария'
                  )}
                </td>
                <td>
                  <ProductList>
                    {entry.products.map((product, productIndex) => (
                      <li key={productIndex}>
                        {product.productId.name} - {product.grams} г
                      </li>
                    ))}
                  </ProductList>
                </td>
                {userRole === ROLE.ADMIN && (
                  <td>
                    {editEntryId === entry._id ? (
                      <Icon
                        src={saveIcon}
                        fontSize="22px"
                        margin="0px 0px 0px 0px"
                        onClick={() => handleSave(entry._id)}
                      />
                    ) : (
                      <>
                        <Icon
                          src={editProductIcon}
                          fontSize="28px"
                          margin="0px 0px 0px 10px"
                          onClick={() => handleEdit(entry)}
                        />
                        <Icon
                          src={deleteProductIcon}
                          fontSize="28px"
                          margin="0px 0px 0px 10px"
                          onClick={() => handleDelete(entry._id)}
                        />
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Нет записей в дневнике.</td>
            </tr>
          )}
        </tbody>
      </DiaryTable>
      {lastPage > 1 && entries.length > 0 && (
        <Pagination page={page} lastPage={lastPage} setPage={setPage} />
      )}
      <Footer />
    </div>
  );
};

const StyledInput = styled.input`
  width: 90px;
  text-align: center;
`;

const DiaryTable = styled.table`
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
  }

  th {
    height: 40px;
  }

  tbody tr {
    height: 90px;
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

  thead tr {
    font-size: 1.3rem;
    font-weight: bold;
  }
`;

const ProductList = styled.ul`
  max-height: 80px;
  width: 280px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style-position: inside;
`;

export const DiaryPage = styled(DiaryPageContainer)`
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
