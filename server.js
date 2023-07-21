/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Dennis Castro Student ID: 122875222 Date: July 19, 2023
*
*  Online (Cycliic) Link: https://dull-pink-fly-toga.cyclic.app
*
********************************************************************************/ 


const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData");
const exphbs = require('express-handlebars');
const session = require('express-session');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));


app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  next();
});


const navLinkHelper = function (url, options) {
  return `<li${url === app.locals.activeRoute ? ' class="nav-item active" ' : ' class="nav-item" '}><a class="nav-link" href="${url}">${options.fn(this)}</a></li>`;
};

const equalHelper = function (lvalue, rvalue, options) {
  if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
  if (lvalue != rvalue) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
};

// Register the helpers
app.engine(
  'hbs',
  exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
      navLink: navLinkHelper,
      equal: equalHelper,
    },
  })
);



collegeData.initialize()
  .then(() => {
    //home.html
    app.get("/", (req, res) => {
      res.render('home');
    });

    app.get("/home", (req, res) => {
      res.render('home');
    });

    //about.html
    app.get("/about", (req, res) => {
      res.render('about');
    });

    //htmlDemo.html
    app.get("/htmlDemo", (req, res) => {
      res.render('htmlDemo');
    });
    
    //theme.css
    app.get("/theme.css", (req, res) => {
      res.sendFile(path.join(__dirname, "/css/theme.css"));
    });

    //students.json

    app.get("/students", (req, res) => {
      collegeData.getStudents()
        .then((data) => {
          if (data.length > 0) {
            res.render('students', { students: data });
          } else {
            res.render('students', { message: 'no results' });
          }
        })
        .catch((error) => {
          res.render('students', { message: 'no results' });
        });
    });
      
        /* if (courseNumber) {
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
        } */
      
      

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
    .then((data) => {
      if (data.length > 0) {
        res.render('courses', { courses: data });
      } else {
        res.render('courses', { message: 'no results' });
      }
    })
    .catch((error) => {
      res.render('courses', { message: 'no results' });
    });
    /* collegeData.getCourses()
      .then((courses) => {
        res.send(courses);
      })
      .catch(() => {
        res.send({ message: "no results" });
      }); */
  });

  app.get('/courses/:id', (req, res) => {
    const courseId = req.params.id;
    collegeData.getCourseById(courseId)
      .then((course) => {
        res.render('course', { course });
      })
      .catch((error) => {
        res.render('courses', { message: 'no results' });
      });
  });
  
  
  
  
  /* app.get("/student/:studentId", (req, res) => {
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
  }); */

    app.post('/students/update', (req, res) => {
      const studentData = req.body;
    
      collegeData.updateStudent(studentData)
        .then(() => {
          return collegeData.getStudentByNum(studentData.studentNum);
        })
        .then((updatedStudent) => {
          req.session.updatedStudent = updatedStudent;
    
          res.redirect('/students/update');
        })
        .catch((error) => {
          console.log(error);
          res.redirect('/students');
        });
    });

    app.get('/students/update', (req, res) => {
      const updatedStudent = req.session.updatedStudent;
    
      res.render('studentUpdate', { student: updatedStudent });
    });

    app.get('/students/update/:studentNum', (req, res) => {
      const studentNum = req.params.studentNum;
    
      collegeData.getStudentByNum(studentNum)
        .then((student) => {
          if (student) {
            res.render('studentUpdate', { student });
          } else {
            res.render('students', { message: 'Student not found' });
          }
        })
        .catch((error) => {
          console.log(error);
          res.render('students', { message: 'Error retrieving student' });
        });
    });

    app.get('/students/view/:studentNum', (req, res) => {
      const studentNum = req.params.studentNum;
    
      collegeData.getStudentByNum(studentNum)
        .then((student) => {
          if (student) {
            res.render('viewStudent', { student });
          } else {
            res.render('students', { message: 'Student not found' });
          }
        })
        .catch((error) => {
          console.log(error);
          res.render('students', { message: 'Error retrieving student' });
        });
    });

    app.post('/students/delete/:studentNum', (req, res) => {
      const studentNum = req.params.studentNum;
    
      collegeData.deleteStudent(studentNum)
        .then(() => {
          res.redirect('/students');
        })
        .catch((error) => {
          console.log(error);
          res.redirect('/students');
        });
    });
    

    app.get('/students/:studentNum', (req, res) => {
      const studentNum = parseInt(req.params.studentNum);
      collegeData.getStudentByNum(studentNum)
        .then((data) => {
          res.render('student', { student: data });
        })
        .catch((error) => {
          res.render('students', { message: 'no results' });
        });
    });

    
    app.get('/students/add', (req, res) => {
      res.render('addStudent');
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

  app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });


  app.listen(HTTP_PORT, () => {
    console.log("Server listening on port: " + HTTP_PORT);
  });
  })
    .catch((err) => {
    console.log(err);
  });
