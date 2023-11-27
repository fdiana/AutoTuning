const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
var ffprobe = require('ffprobe');
const childProcess = require("child_process");
const spawn = require("child_process").spawn;

const fs = require('fs')

const app = express();
const port = 3000;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })
  app.use(express.static(__dirname + '/public'));
  app.use('/uploads', express.static('uploads'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));


  app.get('*',function(req, res){

     res.sendFile(__dirname + "/index.html");

  });

app.post('/', upload.single('profile-file'), function (req, res, next) {

    console.log(req.file.path)
    console.log(req.file.filename)

  let runPy = new Promise(function(success, nosuccess) {

      const pyprog = spawn('python', ['./gp_minimizeCSV_params.py', req.file.path]);


      pyprog.stdout.on('data', function(data) {

          success(data);
      });

      pyprog.stderr.on('data', (data) => {

          nosuccess(data);
      });
  });

  const path = './pythonRes.json';
  const { writeFile } = require('fs');

  runPy.then(function(fromRunpy) {
      console.log(fromRunpy.toString());
      writeFile(path, JSON.stringify(fromRunpy.toString(), null, 2), (error) => {
        if (error) {
          console.log('An error has occurred ', error);
          return;
        }
        console.log('Data written successfully to disk');
        console.log("fromRunpy=");
        console.log(`The result is ${fromRunpy}`);
      });

      res.end(fromRunpy);
  });

  app.post('/generateNumbers', (req, res) => {

    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync('./pythonRes.json', 'utf8'));
    console.log('obj = ')
    console.log(obj)
    console.log('obj.parameters_size = ')
    console.log(obj.parameters_size)
    //console.log(req.body)

      const { number } = obj.parameters_size;
      const row = obj.parameters_value;
      res.json({ row });

  });

  })



  app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on port 3000");
});
