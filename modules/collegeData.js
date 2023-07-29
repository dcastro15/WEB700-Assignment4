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
