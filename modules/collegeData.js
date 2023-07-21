const fs = require("fs");

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/courses.json", "utf8", (err, courseData) => {
      if (err) {
        reject("unable to load courses");
        return;
      }

      fs.readFile("./data/students.json", "utf8", (err, studentData) => {
        if (err) {
          reject("unable to load students");
          return;
        }

        dataCollection = new Data(
          JSON.parse(studentData),
          JSON.parse(courseData)
        );
        resolve();
      });
    });
  });
};

module.exports.getAllStudents = function () {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length === 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(dataCollection.students);
  });
};

module.exports.getTAs = function () {
  return new Promise((resolve, reject) => {
    const filteredStudents = dataCollection.students.filter(
      (student) => student.TA === true
    );

    if (filteredStudents.length === 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(filteredStudents);
  });
};

module.exports.getCourses = function () {
  return new Promise((resolve, reject) => {
    if (dataCollection.courses.length === 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(dataCollection.courses);
  });
};

module.exports.getStudentsByCourse = function (courseId) {
  return new Promise((resolve, reject) => {
    const filteredStudents = dataCollection.students.filter(
      (student) => student.course === parseInt(courseId)
    );

    if (filteredStudents.length === 0) {
      reject("No results returned");
      return;
    }

    resolve(filteredStudents);
  });
};

module.exports.getStudentByNum = function (studentId) {
  return new Promise((resolve, reject) => {
    const foundStudent = dataCollection.students.find((student) => student.studentNum === parseInt(studentId));

    if (foundStudent) {
      resolve(foundStudent);
    } else {
      reject("No student found");
    }
  });
};

module.exports.addStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    if (!studentData.TA) {
      studentData.TA = false;
    } else {
      studentData.TA = true;
    }

    studentData.studentNum = dataCollection.students.length + 1;

    dataCollection.students.push(studentData);

    studentRealTimeUpdate()

    resolve();
  });
};

function studentRealTimeUpdate() {
  const studentsData = JSON.stringify(dataCollection.students, null, 2);

  fs.writeFile("./data/students.json", studentsData, (err) => {
    if (err) {
      console.error("Error", err);
    } else {
      console.log("Students data successfully updated");
    }
  });
}



//getting '/students'
module.exports.getStudents = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/students.json', 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const students = JSON.parse(data);
        const studentNames = students.map((student) => ({
          studentNum: student.studentNum,
          firstName: student.firstName,
          lastName: student.lastName,
        
        }
        
        
        ));


        studentRealTimeUpdate();

        resolve(studentNames);
      } catch (error) {
        reject(error);
      }
    });
  });
};

// getting '/courses/:id'
module.exports.getCourseById = function (courseId) {
  return new Promise((resolve, reject) => {
    const foundCourse = dataCollection.courses.find((course) => course.courseId === parseInt(courseId));

    if (foundCourse) {
      resolve(foundCourse);
    } else {
      reject("No course found with the given courseId");
    }
  });
};


// Update student details



module.exports.updateStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    const studentIndex = dataCollection.students.findIndex(
      (student) => student.studentNum === parseInt(studentData.studentNum, 10)
    );
    if (studentIndex !== -1) {
      dataCollection.students[studentIndex].studentNum = parseInt(studentData.studentNum, 10);
      dataCollection.students[studentIndex].firstName = studentData.firstName;
      dataCollection.students[studentIndex].lastName = studentData.lastName;
      dataCollection.students[studentIndex].email = studentData.email;
      dataCollection.students[studentIndex].addressStreet = studentData.addressStreet;
      dataCollection.students[studentIndex].addressCity = studentData.addressCity;
      dataCollection.students[studentIndex].addressProvince = studentData.addressProvince;
      dataCollection.students[studentIndex].TA = studentData.TA === 'true';
      dataCollection.students[studentIndex].status = studentData.status;
      dataCollection.students[studentIndex].course = parseInt(studentData.course, 10);

      studentRealTimeUpdate();

      resolve();
    } else {
      reject("No student found with the given studentNum");
    }
  });
};


// Delete student details

module.exports.deleteStudent = function (studentNum) {
  return new Promise((resolve, reject) => {
    const studentIndex = dataCollection.students.findIndex((student) => student.studentNum === parseInt(studentNum, 10));
    if (studentIndex !== -1) {
      dataCollection.students.splice(studentIndex, 1);

      studentRealTimeUpdate();

      resolve();
    } else {
      reject("No student found with the given studentNum");
    }
  });
};

  module.exports.getAllStudentsWithPromise = function () {
    return new Promise((resolve, reject) => {
      if (dataCollection.students.length == 0) {
        reject("query returned 0 results");
        return;
      }
      resolve(dataCollection.students);
    });
  };
  
  function saveStudentsToFile() {
    fs.writeFile("./data/students.json", JSON.stringify(dataCollection.students, null, 2), (err) => {
      if (err) {
        console.error("Error saving students data to file:", err);
      } else {
        console.log("Students data saved to file successfully.");
      }
    });
  }

  module.exports.saveStudentsToFile = saveStudentsToFile; 

