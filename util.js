
var getFileName = exports.getFileName = function() {
  return dt.getFullYear() + "" +
         ("0" + (dt.getMonth() + 1)).slice(-2) + "" +
         ("0" + dt.getDate()).slice(-2) + "-" +
         dt.getTime();
};