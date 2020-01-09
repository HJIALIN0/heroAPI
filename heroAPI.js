//导入项目需要的第三方包
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

//导入 nodeJS内置模块
const path = require("path");
const fs = require("fs");

//创建express服务器
const app = express();

// 利用 multer 第三方包 multer，初始化一个用于上传 form-data 图片的 函数，函数名叫 upload。
const upload = multer({
  dest: path.join(__dirname, "/public/uploads/")
}).single("icon");

//使用第三方中间件 cors 实现跨域
app.use(cors());

// 解析 application/json
app.use(bodyParser.json());
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

//服务器在 3001 端口启动
app.listen(3001, () => {
  console.log("服务器开启: http://127.0.0.1:3001");
  // console.log(path.join(__dirname, "aaa"));
});

/**
 * 函数封装：根据路径，获取数据。
 * @param {*} file          文件路径
 * @param {*} defaultData   默认返回数据
 */
//读
function getFileData(file = "./json/user.json") {
  //同步写法可能会出现失败的情况
  try {
    //通过 path 拼接绝对路径
    const filePath = path.join(__dirname, file);
    //把获取到的数据转换成JS对象
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    //如果读取失败
    //读取失败返回一个空数组
    return [];
  }
}
//写
function WriteFile(file = "./json/user.json", data) {
  fs.writeFileSync(path.join(__dirname, file), JSON.stringify(data));
}

// 1.用户登录
app.post("/login", (req, res) => {
  console.log("req", req);
  console.log("res", res);
  //调用封装好的函数，获取文件信息，保存到data中
  const data = getFileData("./json/user.json");
  //从res.body对象中解构出 username 和 password
  const { username, password } = req.body;
  // 调用数组 find 方法，获取数组中某个用户名的信息
  const user = data.find(item => item.username === username);
  // 如果能获取到信息，验证用户名和密码
  if (user) {
    //判断用户名和密码是否都和本地的用户名密码相同
    if (username === user.username && password === user.password) {
      res.send({
        code: 200,
        msg: "登录成功"
      });
    }
    //如果不相同，提示错误
    else {
      res.send({
        code: 400,
        msg: "用户名或密码错误"
      });
    }
  }
  //如果通过find方法找不到用户就执行else
  else {
    res.send({
      code: 400,
      msg: "用户名不存在"
    });
  }
});

//2.英雄列表
app.get("/list", (req, res) => {
  //调用封装好的读取函数
  const data = getFileData("./json/hero.json");
  res.send({
    msg: "获取成功",
    code: 200,
    data
  });
});

//3.英雄新增
app.post("/add", (req, res) => {
  upload(req, res, function(err) {
    console.log("req", req);
    console.log("res", res);
    console.log("err", err);
    //调用封装好的函数，获取文件信息，保存到data中
    let data = getFileData("./json/hero.json");
    data = data.sort((a, b) => a.id - b.id);
    const maxId = data[data.length - 1].id;
    const newId = maxId + 1;

    //multer的错误
    if (err instanceof multer.MulterError) {
      // 发生错误
      res.send({
        code: 400,
        msg: `avatar 参数不对`
      });
    }
    //其他错误
    else if (err) {
      // 发生错误
      res.send({
        code: 400,
        msg: `发生其他错误`
      });
    }
    //其他情况
    else {
      // 一切都好
      //在请求对象 req.body 中获取文本信息
      //如果req.file、name、skill、icon都不为空
      const { name, skill, icon } = req.body;
      if (req.file && name && skill) {
        //在请求对象 res.file 中获取图片信息
        // const path1 = req.file.path;
        const { path: path1 } = req.file;
        //创建新的英雄对象用newHeroObj保存
        const newHeroObj = { id: newId, name, skill, icon: path1 };
        //新的数据内容
        const newData = [...data, newHeroObj];
        //写
        WriteFile("./json/hero.json", newData);
        res.send({
          code: 200,
          msg: "新增成功"
        });
      }
      //如果输入项有一项为空
      else {
        res.send({
          code: 400,
          msg: "参数错误，请重新输入数据"
        });
      }
    }
  });
});

//4.英雄删除
app.get("/delete", (req, res) => {
  console.log("req", req);
  console.log("res", res);
  const data = getFileData("./json/hero.json");
  const { id } = req.body;
  const index = data.findIndex(item => item.id == id);
  let flag = false;
  data.forEach(item => {
    if (item.id == id) flag = true;
  });
  if (flag) {
    data.splice(index, 1);
    //写
    WriteFile("./json/hero.json", data);
    res.send({
      msg: "删除成功",
      code: 200
    });
  } else {
    res.send({
      msg: "删除错误",
      code: 400
    });
  }
});

//5.英雄查询
app.get("/search", (req, res) => {
  console.log("req", req);
  console.log("res", res);
  const data = getFileData("./json/hero.json");
  const { id } = req.body;
  const index = data.findIndex(item => item.id == id);
  let flag = false;
  data.forEach(item => {
    if (item.id == id) flag = true;
  });
  if (flag) {
    const newData = data.slice(index, index + 1);
    res.send({
      msg: "查询成功",
      code: 200,
      data: newData
    });
  } else {
    res.send({
      msg: "参数错误",
      code: 400
    });
  }
});

//6.英雄编辑
app.post("/edit", (req, res) => {
  upload(req, res, function(err) {
    console.log("req", req);
    console.log("res", res);
    const data = getFileData("./json/hero.json");
    if (err instanceof multer.MulterError) {
      // 发生错误
      res.send({
        code: 400,
        msg: "icon参数错误"
      });
    } else if (err) {
      // 发生错误
      res.send({
        code: 400,
        msg: "参数错误"
      });
    } else {
      // 一切都好
      const { id, name, skill } = req.body;
      let flag = false;
      data.forEach(item => {
        if (item.id == id) flag = true;
      });

      //判断id值是否存在于数据文件中
      //如果存在并且其他数据都没有留空
      if (flag && name && skill && req.file) {
        const { path } = req.file;
        data.forEach(item => {
          if (item.id == id) {
            item.name = name;
            item.skill = skill;
            item.icon = path;
          }
        });
        //写
        WriteFile("./json/hero.json", data);
        res.send({
          code: 200,
          msg: "编辑成功"
        });
      } else {
        res.send({
          code: 400,
          msg: "参数错误，请重新输入数据"
        });
      }
    }
  });
});
