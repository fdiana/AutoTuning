const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
var ffprobe = require('ffprobe');
const childProcess = require("child_process");
//const fsProcess = require("fs");
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

//var obj = JSON.parse(fs.readFileSync('people.json', 'utf8'));
//  console.log(obj);


  //app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static(__dirname + '/public'));
  app.use('/uploads', express.static('uploads'));



  //  Read information about the video sent

  app.get("/",function(req, res){

     res.sendFile(__dirname + "/index.html");

        //res.send("<h1>index</h1>");
  });

  app.post('/', upload.single('profile-file'), function (req, res, next) {

  //app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    console.log(req.file.path)
    console.log(req.file.filename)
    //console.log(JSON.stringify(req.file))
    //let response = '<a href="/">Home</a><br>'
    //response += "Files uploaded successfully.<br>"

    //var obj = JSON.parse(fsProcess.readFileSync('people.json', 'utf8'));
    //console.log(obj);


    // (C) GENERATE TABLE for people.json

    //console.log(obj.length);
    //console.log(obj[0].id);
    //console.log(obj[0].firstName);
    //console.log(obj[0].lastName);

  /*  var table = "<table>";
    for (let key=0; key<obj.length; key++) {
        table += `<tr><td>${obj[key].id}</td><td>${obj[key].firstName}</td><td>${obj[key].lastName}</td></tr>`;
      }
    table += "</table>";
    response += `<div> ${table}   </div> <br> <br> <br>`*/

    //const pyprog = spawn('python', ['./bayesian-optimization2D.py']);
    //response  += "Python result";
    //var pyprog = spawn('python', ['./helloWorld.py']);
    //console.log(pyprog)
    //response += pyprog;

    //pyprog.stdout.on('data.res', (data) => {
    //  response +=data.toString()
    //  console.log(response)
      //res.send(data.toString());
      //console.log(data.toString())
  //})
  let runPy = new Promise(function(success, nosuccess) {

      //const pyprog = spawn('python', ['./bayesian-optimization2D.py']);
      //const pyprog = spawn('python', ['./helloWorld.py']);
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
  //res.write('welcome\n');

  runPy.then(function(fromRunpy) {
      console.log(fromRunpy.toString());
      writeFile(path, JSON.stringify(fromRunpy.toString(), null, 2), (error) => {
        if (error) {
          console.log('An error has occurred ', error);
          return;
        }
        console.log('Data written successfully to disk');
      });

      res.end(fromRunpy);
      //res.json({ msg: `The result is ${fromRunpy}`});
  });




/*  runPy.then(function(fromRunpy) {
      console.log(fromRunpy.toString());
      res.end(fromRunpy);
  });
*/
    //response += "After python.<hr>"
    //console.log(obj.length);
    //console.log(obj.streams);
    //console.log(obj.streams.width);
  //  console.log(obj.streams.height);

/*
    var table = "<table>";
    //for (let key=0; key<obj.length; key++) {
        table += `<tr><td>${obj.streams.width}</td><td>${obj.streams.height}</td></tr>`;
    //  }
    table += "</table>";
    response += `<div> ${table}   </div> <br> <br> <br>`
*/

    //response += `<div> "${document.getElementById("myData").innerHTML}" = "${obj.streams[1].width}";
    //            </div> <br> <br> <br>`

    //console.log(req.file.path);


    //console.log(__dirname);
    //let ffmpegExePath = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe";
    //let ffProbeExePath = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffProbe.exe";

    //let exeCommand = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffprobe.exe" + " -show_streams " +".\\"+ req.file.path;
    //let exeCommand = ffProbeExePath + " -i " + ".\\" + req.file.path + " -v quiet -print_format json -show_entries stream="+ widthFrameSize + "," + hightFrameSize + " -hide_banner > output.json"

    /*let exeCommandFrameSize = ffProbeExePath + " -i " + ".\\" + req.file.path + " -v quiet -print_format json -show_entries stream=width,height -hide_banner > output.txt > output.json"
    console.log(exeCommandFrameSize);
    childProcess.exec(exeCommandFrameSize, function(err, data) {
                        console.log(err);
                        console.log('data.toString = ',  data.toString());*/

   //let exeCommandInfoFile = ffProbeExePath + " -show_streams " + ".\\" + req.file.path + " > outputFileInfo.txt > outputFileInfo.json";
//   let exeCommandInfoFile = ffProbeExePath + " -v quiet -print_format json -show_format -show_streams " + ".\\" + req.file.path + " > outputFileInfo.txt > outputFileInfo.json";
   //var fileName = fsProcess.filename(req.file);
   //let exeCommandInfoFile = ffProbeExePath + " -show_streams " + ".\\" + req.file.path + " > " + req.file.substr[0, req.file.length - 4] + "outputFileInfo.txt";
//   console.log(exeCommandInfoFile);
/*   childProcess.exec(exeCommandInfoFile, function(err, data) {
                console.log(err);
                console.log('data.toString = ',  data.toString());
                    });

    response += `<video src="${req.file.path}" width="420" controls><br>`;*/
/*
    var obj = JSON.parse(fsProcess.readFileSync('people.json', 'utf8'));
    console.log(obj);
    response += `<div>  ${"obj"}
                </div> <br> <br> <br>`
*/
  //  response += `<div> ${"outputFileInfo"}  </div> <br> <br> <br>`;


  //return res.send(response)
  })


  app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on port 3000");
});
