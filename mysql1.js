//引入mysql第三方包
var mysql = require("mysql");

//创建mysql数据库连接
var connection = mysql.createConnection({
  //数据库地址
  host: "localhost",
  //用户名
  user: "root",
  //密码
  password: "root",
  //数据库名
  database: "gzqd42"
});

connection.connect();

//查询数据库数据
// insert into hero (name,skill,icon) values ('李清照','作词','sssss')
// delete from hero where name='李清照'
// connection.query("select * from hero", function(error, results) {
//   if (error) throw error;
//   console.log("结果为 ", results);
// });

// 封装增删改查
module.exports = {
  //1.增
  add({ name, skill, icon, success = () => {}, fail = () => {} }) {
    connection.query(
      `insert into hero (name,skill,icon) values ('${name}','${skill}','${icon}')`,
      (error, results) => {
        if (error) throw error;
        const { affectedRows } = results;
        if (
          affectedRows >= 1 &&
          name !== undefined &&
          skill !== undefined &&
          icon !== undefined
        ) {
          success(results);
        } else {
          fail(error);
        }
      }
    );
  },
  //2.删
  delete({ id, success = () => {}, fail = () => {} }) {
    connection.query(`delete from hero where id=${id}`, function(
      error,
      results
    ) {
      if (error) throw error;
      const { affectedRows } = results;
      if (affectedRows >= 1 && id !== undefined) {
        success(results);
      } else {
        fail(error);
      }
    });
  },
  //3.改
  edit({ id, name, skill, icon, success = () => {}, fail = () => {} }) {
    connection.query(
      `update hero set name="${name}",skill="${skill}",icon="${icon}" where id=${id}`,
      function(error, results) {
        if (error) throw error;
        const { affectedRows } = results;
        if (
          affectedRows >= 1 &&
          id !== undefined &&
          name !== undefined &&
          skill !== undefined &&
          icon !== undefined
        ) {
          success(results);
        } else {
          fail(error);
        }
      }
    );
  },
  //4.查
  search({ id, success = () => {}, fail = () => {} }) {
    connection.query(`select * from hero where id=${id}`, function(
      error,
      results
    ) {
      if (error) throw error;
      const [data] = results;
      if (data) {
        success(results);
      } else {
        fail(error);
      }
    });
  },
  //5.查找所有
  get({ success = () => {}, fail = () => {} }) {
    connection.query(`select * from hero `, function(error, results) {
      if (error) throw error;
      const [data] = results;
      if (data) {
        success(results);
      } else {
        fail(error);
      }
    });
  }
};

// 1.增
// db.add({
//   name: "李清照",
//   skill: "作词",
//   icon: "liqingzhao",
//   success: res => {
//     console.log("新增成功", res);
//   },
//   fail: err => {
//     console.log("新增失败");
//   }
// });

//2.删
// db.delete({
//   id: 16,
//   success: res => {
//     console.log("删除成功");
//   },
//   fail: err => {
//     console.log("删除失败");
//   }
// });

//3.改
// db.edit({
//   id: 10,
//   name: "李sss白",
//   skill: "喝酒",
//   icon: "sssssssbai",
//   success: res => {
//     console.log("编辑成功");
//   },
//   fail: err => {
//     console.log("编辑失败");
//   }
// });

//4.查
// db.search({
//   id: 1,
//   success: res => {
//     console.log("查询成功", res);
//   },
//   fail: err => {
//     console.log("查询失败", err);
//   }
// });

//5.查所有
// db.get({
//   success: res => {
//     console.log("查询成功", res);
//   },
//   fail: err => {
//     console.log("查询失败", err);
//   }
// });
