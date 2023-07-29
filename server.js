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
    // Home Page
    app.get("/", (req, res) => {
      res.render('home');
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
      collegeData.getAllStudents()
        .then((data) => {
          const updatedStudentNum = req.query.updatedStudentNum;
          res.render('students', { students: data, updatedStudentNum });
        })
        .catch((error) => {
          res.render('students', { message: 'no results' });
        });
    });

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
              } else {
                res.render('students', { message: 'Student not found' });
              }
            })
            .catch((error) => {
              console.log(error);
              res.render('students', { message: 'Error retrieving student' });
            });
        });
        
        

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
    

    // View Student Page
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
        .then(() => {
          res.redirect('/students');
        })
        .catch((error) => {
          console.log(error);
          res.redirect('/students');
        });
    });

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
