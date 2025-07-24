module.exports = function mapUser(user) {
  const formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    let hours = "" + d.getHours();
    let minutes = "" + d.getMinutes();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hours.length < 2) hours = "0" + hours;
    if (minutes.length < 2) minutes = "0" + minutes;

    return [year, month, day].join("-") + " " + [hours, minutes].join(":");
  };

  return {
    id: user.id,
    login: user.login,
    email: user.email,
    roleId: user.role,
    registeredAt: formatDate(user.createdAt),
  };
};
