export const InsulinCalculator = ({
  currentSugarLevel,
  totalBreadUnits,
  userSettings,
}) => {
  if (
    !userSettings ||
    !userSettings.targetSugar ||
    !userSettings.compensationCoefficient ||
    !userSettings.insulinCoefficient
  ) {
    throw new Error(
      'У вас не заполнены необходимые поля на странице Настройки.'
    );
  }

  const compensation =
    (currentSugarLevel - userSettings.targetSugar) /
    userSettings.compensationCoefficient;
  const insulinForFood = totalBreadUnits * userSettings.insulinCoefficient;
  let insulinDoseToBeAdministered = insulinForFood + compensation;

  if (userSettings.rounding === 'К большему') {
    insulinDoseToBeAdministered = Math.ceil(insulinDoseToBeAdministered);
  } else if (userSettings.rounding === 'К меньшему') {
    insulinDoseToBeAdministered = Math.floor(insulinDoseToBeAdministered);
  }

  return insulinDoseToBeAdministered;
};
