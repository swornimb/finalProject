

module.exports.stringToArray = (res) => {
  var data;
  data = res[0].replaceAll("'", "");
  data = data.replaceAll(" ", "");
  data = data.replaceAll(",", "");
  data = data.replace("[", "");
  data = data.replace("]", "");

  return data;
};
