const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize connection
const sequelize = new Sequelize('srepurxj', 'srepurxj', 'lbbr7neBSA8a4fWmfs907_GqGzmEdBjk', {
  host: 'stampy.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
  query: { raw: true },
});

// Define Student data model
const Student = sequelize.define('Student', {
  studentNum: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  addressStreet: {
    type: DataTypes.STRING,
  },
  addressCity: {
    type: DataTypes.STRING,
  },
  addressProvince: {
    type: DataTypes.STRING,
  },
  TA: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.STRING,
  },
});


const Course = sequelize.define('Course', {
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: {
    type: DataTypes.STRING,
  },
  courseDescription: {
    type: DataTypes.STRING,
  },
});


Course.hasMany(Student, { foreignKey: 'course' });

// Synchronize the models with the database
module.exports.initialize = function () {
  return sequelize.sync().then(() => {
    console.log('Database synced successfully.');
  }).catch((err) => {
    console.error('Error syncing the database:', err);
    throw err;
  });
};



module.exports.getAllStudents = function () {
  return Student.findAll();
};

module.exports.getCourses = function () {
  return Course.findAll();
};

module.exports.getStudentsByCourse = function (courseId) {
  return Student.findAll({
    where: {
      course: courseId,
    },
  });
};

module.exports.getStudentByNum = function (studentNum) {
  return Student.findOne({
    where: {
      studentNum: studentNum,
    },
  });
};

module.exports.addStudent = function (studentData) {
  return Student.create(studentData);
};

module.exports.updateStudent = function (studentData) {
  console.log('Updating student with data:', studentData);

  return Student.update(studentData, {
    where: {
      studentNum: studentData.studentNum,
    },
  });
};

module.exports.deleteStudentByNum = function (studentNum) {
  return Student.destroy({
    where: {
      studentNum: studentNum,
    },
  });
<<<<<<< HEAD
};

module.exports.getCourseById = function (courseId) {
  return Course.findOne({
    where: {
      courseId: courseId,
    },
  });
};

module.exports.addCourse = function (courseData) {
  return Course.create(courseData);
};

module.exports.updateCourse = function (courseData) {
  return Course.update(courseData, {
    where: {
      courseId: courseData.courseId,
    },
    returning: true,
  });
};

module.exports.deleteCourseById = function (courseId) {
  return Course.destroy({
    where: {
      courseId: courseId,
    },
  });
};
=======
}



//get /students
module.exports.getStudents = () => {
  return new Promise((resolve, reject) => {
    if (!dataCollection || dataCollection.students.length === 0) {
      reject("No students data available");
      return;
    }

    const studentNames = dataCollection.students.map((student) => ({
      studentNum: student.studentNum,
      firstName: student.firstName,
      lastName: student.lastName,
    }));

    resolve(studentNames);
  });
};

// /courses/:id
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

      resolve(studentIndex);
    } else {
      reject("No student found with the given studentNum");
    }
  });
};


// Delete student details

/* module.exports.deleteStudent = function (studentNum) {
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
}; */


>>>>>>> a63038468427893cf9a26f04af9ea60f33a206fd
