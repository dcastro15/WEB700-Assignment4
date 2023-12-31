<<<<<<< HEAD
=======
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


>>>>>>> a63038468427893cf9a26f04af9ea60f33a206fd
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
    // Home Page
    app.get("/", (req, res) => {
      res.render('home');
<<<<<<< HEAD
=======
    });

    app.get("/home", (req, res) => {
      res.render('home');
>>>>>>> a63038468427893cf9a26f04af9ea60f33a206fd
    });

    // About Page
    app.get("/about", (req, res) => {
      res.render('about');
    });

    // HTML Demo Page
    app.get("/htmlDemo", (req, res) => {
      res.render('htmlDemo');
    });

    // Theme CSS
    app.get("/theme.css", (req, res) => {
      res.sendFile(path.join(__dirname, "/css/theme.css"));
    });

    // Student List Page
    app.get("/students", (req, res) => {
<<<<<<< HEAD
      collegeData.getAllStudents()
        .then((data) => {
          const updatedStudentNum = req.query.updatedStudentNum;
          res.render('students', { students: data, updatedStudentNum });
=======
      collegeData.getStudents()
        .then((data) => {
          if (data.length > 0) {
            res.render('students', { students: data });
          } else {
            res.render('students', { message: 'no results' });
          }
>>>>>>> a63038468427893cf9a26f04af9ea60f33a206fd
        })
        .catch((error) => {
          res.render('students', { message: 'no results' });
        });
    });
<<<<<<< HEAD

    // Teaching Assistants Page
    app.get("/tas", (req, res) => {
      collegeData.getTAs()
        .then((tas) => {
          res.send(tas);
        })
        .catch(() => {
          res.send({ message: "no results" });
        });
    });

    // Courses Page
    app.get("/courses", (req, res) => {
      collegeData.getCourses()
        .then((data) => {
          const updatedCourseId = req.query.updatedCourseId;
          res.render('courses', { courses: data, updatedCourseId });
        })
        .catch((error) => {
          res.render('courses', { message: 'no results' });
        });
    });

    // Single Course Page
    app.get('/courses/update/:courseId', (req, res) => {
      const courseId = req.params.courseId;
      collegeData.getCourseById(courseId)
        .then((course) => {
          if (course) {
            res.render('updateCourse', { course });
          } else {
            res.render('courses', { message: 'Course not found' });
          }
        })
        .catch((error) => {
          console.log(error);
          res.render('courses', { message: 'Error retrieving course' });
        });
    });

        // Add Student Page
    app.get('/students/add', (req, res) => {
      collegeData.getCourses()
        .then((courses) => {
          res.render('addStudent', { courses });
            })
        .catch((error) => {
          console.log(error);
          res.render('students', { message: 'Error retrieving courses' });
            });
        });

    // Add Student
    app.post('/students/add', (req, res) => {
      const studentData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        addressStreet: req.body.addressStreet,
        addressCity: req.body.addressCity,
        addressProvince: req.body.addressProvince,
        TA: req.body.TA,
        status: req.body.status,
      };
    
      collegeData.addStudent(studentData)
        .then((newStudent) => {
          res.redirect(`/students/update2/${newStudent.studentNum}`);
        })
        .catch((error) => {
          console.log(error);
          res.send('Error adding student');
        });
    });
    
        // Add page for course Student Page
        app.get('/students/update2/:studentNum', (req, res) => {
          const studentNum = req.params.studentNum;
          collegeData.getStudentByNum(studentNum)
            .then((student) => {
              if (student) {
                collegeData.getCourses()
                  .then((courses) => {
                    res.render('studentUpdate2', { student, courses });
                  })
                  .catch((error) => {
                    console.log(error);
                    res.render('students', { message: 'Error retrieving courses' });
                  });
=======
      
        /* if (courseNumber) {
          collegeData.getStudentsByCourse(courseNumber)
            .then((students) => {
              if (students.length > 0) {
                res.send(students);
>>>>>>> a63038468427893cf9a26f04af9ea60f33a206fd
              } else {
                res.render('students', { message: 'Student not found' });
              }
            })
            .catch((error) => {
              console.log(error);
              res.render('students', { message: 'Error retrieving student' });
            });
<<<<<<< HEAD
        });
        
        
=======
        } else {
          collegeData.getAllStudents()
            .then((students) => {
              res.send(students);
            })
            .catch(() => {
              res.send({ message: "Error" });
            });
        } */
      
      
>>>>>>> a63038468427893cf9a26f04af9ea60f33a206fd

    // Update Student Page
    app.get('/students/update/:studentNum', (req, res) => {
      const studentNum = req.params.studentNum;
      collegeData.getStudentByNum(studentNum)
        .then((student) => {
          if (student) {
            collegeData.getCourses()
              .then((courses) => {
                res.render('studentUpdate', { student, courses });
              })
              .catch((error) => {
                console.log(error);
                res.render('students', { message: 'Error retrieving courses' });
              });
          } else {
            res.render('students', { message: 'Student not found' });
          }
        })
        .catch((error) => {
          console.log(error);
          res.render('students', { message: 'Error retrieving student' });
        });
    });
    

<<<<<<< HEAD
    // View Student Page
    app.get('/students/view/:studentNum', (req, res) => {
      const studentNum = req.params.studentNum;
=======
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
    
>>>>>>> a63038468427893cf9a26f04af9ea60f33a206fd
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

<<<<<<< HEAD
    // Update Student Information
    app.post('/students/update', (req, res) => {
      const studentData = req.body;
      collegeData.updateStudent(studentData)
        .then(() => {
          return collegeData.getStudentByNum(studentData.studentNum);
        })
        .then((updatedStudent) => {
          if (updatedStudent) {
            console.log('Updated student:', updatedStudent.dataValues);
            res.redirect(`/students?updatedStudentNum=${updatedStudent.studentNum}`);
          } else {
            console.log('Student not found for update:', studentData.studentNum);
            res.status(404).json({ error: 'Student not found for update' });
          }
        })
        .then(() => {
          console.log('After updating student:', studentData.studentNum);
        })
        .catch((error) => {
          console.log(error);
          res.redirect('/students');
        });
    });

    // Delete Student
    app.post('/students/delete/:studentNum', (req, res) => {
      const studentNum = req.params.studentNum;
      collegeData.deleteStudentByNum(studentNum)
=======
    app.post('/students/delete/:studentNum', (req, res) => {
      const studentNum = req.params.studentNum;
    
      collegeData.deleteStudent(studentNum)
>>>>>>> a63038468427893cf9a26f04af9ea60f33a206fd
        .then(() => {
          res.redirect('/students');
        })
        .catch((error) => {
          console.log(error);
          res.redirect('/students');
        });
    });
<<<<<<< HEAD

    // Add Course Page
    app.get('/courses/add', (req, res) => {
      res.render('addCourse');
    });

    // Add Course
    app.post('/courses/add', (req, res) => {
      collegeData.addCourse(req.body)
        .then(() => {
          const response = `
            <script>
              setTimeout(function() {
                alert("Congratulations! Course Added successfully.");
                window.location.href = '/courses';
              }, 100);
            </script>`;
          res.send(response);
        })
        .catch((error) => {
          res.send('Error: ' + error);
        });
    });

    // Update Course
    app.post('/courses/update', (req, res) => {
      const courseData = req.body;
      collegeData.updateCourse(courseData)
        .then(([rowsUpdated, updatedCourses]) => {
          if (rowsUpdated > 0 && updatedCourses.length > 0) {
            console.log('Updated course:', updatedCourses[0].dataValues);
    

            res.redirect(`/courses?updatedCourseId=${updatedCourses[0].courseId}`);
          } else {
            console.log('Course not found for update:', courseData.courseId);
            res.status(404).json({ error: 'Course not found for update' });
          }
        })
        .catch((error) => {
          console.log('Error updating course:', error);
          res.status(500).json({ error: 'Error updating course' });
        });
    });

    // Delete Course
    app.post('/courses/delete/:courseId', (req, res) => {
      const courseId = req.params.courseId;
      collegeData.deleteCourseById(courseId)
        .then(() => {
          res.redirect('/courses');
        })
        .catch((error) => {
          console.log(error);
          res.redirect('/courses');
        });
    });

    // Handle 404 Page Not Found
=======
    

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

    

  
>>>>>>> a63038468427893cf9a26f04af9ea60f33a206fd
    app.use((req, res) => {
      res.status(404).send("Page Not Found");
    });

    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port: " + HTTP_PORT);
    });
    })
<<<<<<< HEAD
    .catch((err) => {
      console.log(err);
    });
=======
      .catch((err) => {
      console.log(err);
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
>>>>>>> a63038468427893cf9a26f04af9ea60f33a206fd
