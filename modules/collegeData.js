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