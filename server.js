/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Dennis Castro Student ID: 122875222 Date: July 5, 2023
*
*  Online (Cycliic) Link: https://dull-pink-fly-toga.cyclic.app/
*
********************************************************************************/ 


const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData");


const app = express();
const HTTP_PORT = process.env.PORT || 8080;
/*const IP_ADDRESS = '172.20.10.12';

const server = app.listen(HTTP_PORT, IP_ADDRESS, () => {
  console.log(`Server listening on ${IP_ADDRESS}:${HTTP_PORT}`);
});*/

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



collegeData.initialize()
  .then(() => {
    //home.html
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/home.html"));
    });

    //about.html
    app.get("/about", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/about.html"));
    });

    //htmlDemo.html
    app.get("/htmlDemo", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
    });

    app.get("/theme.css", (req, res) => {
      res.sendFile(path.join(__dirname, "/css/theme.css"));
    });

    //students.json

    app.get("/students", (req, res) => {
        const courseNumber = req.query.course;
      
        if (courseNumber) {
          collegeData.getStudentsByCourse(courseNumber)
            .then((students) => {
              if (students.length > 0) {
                res.send(students);
              } else {
                res.send({ message: "No results" });
              }
            })
            .catch(() => {
              res.send({ message: "Error" });
            });
        } else {
          collegeData.getAllStudents()
            .then((students) => {
              res.send(students);
            })
            .catch(() => {
              res.send({ message: "Error" });
            });
        }
      });
      

  app.get("/tas", (req, res) => {
    collegeData.getTAs()
      .then((tas) => {
        res.send(tas);
      })
      .catch(() => {
        res.send({ message: "no results" });
      });
  });
  

  app.get("/courses", (req, res) => {
    collegeData.getCourses()
      .then((courses) => {
        res.send(courses);
      })
      .catch(() => {
        res.send({ message: "no results" });
      });
  });
  
  
  app.get("/student/:studentId", (req, res) => {
    const studentId = req.params.studentId;
  
    collegeData.getStudentByNum(studentId)
      .then((student) => {
        if (student) {
          res.send(student);
        } else {
          res.status(404).send({ message: "No student record with the given studentNum" });
        }
      })
      .catch((error) => {
        console.log("Error retrieving student:", error);
        res.status(500).send({ message: "Error!" });
      });
  });
  
  


    // [ no matching route ]
    app.use((req, res) => {
      res.status(404).send("Page Not Found");
    });

    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });


  app.get('/students/add', (req, res) => {
    res.sendFile(__dirname + '/views/addStudent.html');
  });

  app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body)
      .then(() => {
        const response = `
        <script>
          setTimeout(function() {
            alert("Congratulations! Student Added successfully.");
            window.location.href = window.location.href;
          }, 100);
        </script>`;
        res.send(response);
      })
      .catch((error) => {
        res.send('Error: ' + error);
      });
  });
