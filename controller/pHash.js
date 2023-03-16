const { PythonShell } = require("python-shell");
const { stringToArray } = require("./stringToArray");
var data;
async function pythonShellFunc(link) {
  return new Promise((resolve, reject) => {
    let options = {
      args: [link],
      scriptPath: "D:/sem7/final_project/final_project_backend/controller",
    };
    PythonShell.run("phash.py", options, (err, res) => {
      console.log(res);
      var data = stringToArray(res);
      resolve(data);
    });
  });
}
// function  pythonShellFunc(link){
//   let options = {
//     args: [link],
//     scriptPath:"D:/sem7/final_project/final_project_backend/controller",

//   };
//   var data
//   PythonShell.run("phash.py", options, (err, res) => {
//     data = stringToArray(res);
//   });
//   return data
// }
module.exports = { pythonShellFunc, data };
