import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { request } from '../../../../utils';

export const BreadUnitsCalculator = ({ selectedProducts }) => {
  const [userSettings, setUserSettings] = useState({
    carbohydratesIn1Unit: 10,
  });

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await request('/settings');
        if (response.data) {
          setUserSettings(response.data);
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };
    fetchUserSettings();
  }, []);

  const calculateBreadUnits = (grams, carbohydratesIn100Grams) => {
    return (
      (grams * carbohydratesIn100Grams) /
      100 /
      userSettings.carbohydratesIn1Unit
    );
  };

  return selectedProducts.map((product) => {
    const breadUnits = calculateBreadUnits(
      product.grams,
      product.carbohydratesIn100Grams
    );
    return {
      ...product,
      breadUnits: breadUnits.toFixed(2),
    };
  });
};

BreadUnitsCalculator.propTypes = {
  selectedProducts: PropTypes.arrayOf(
    PropTypes.shape({
      grams: PropTypes.number.isRequired,
      carbohydratesIn100Grams: PropTypes.number.isRequired,
    })
  ).isRequired,
};
