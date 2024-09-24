// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
    
//     return queryInterface.bulkInsert('ReferenceNumbers', [{
//       label: "hospitalId",
//       value: 1000
//     }])
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//   }
// };




'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Hash the password for the user
    const hashedPassword = await bcrypt.hash('yourpassword', 10); // Replace 'yourpassword' with the desired password

    // Insert reference number and user data
    await queryInterface.bulkInsert('ReferenceNumbers', [{
      label: "hospitalId",
      value: 1000
    }]);

    return queryInterface.bulkInsert('Users', [{
      firstName: 'Yahampath',
      lastName: 'Chandika',
      email: 'yhmpth@gmail.com',
      contactNo: '779817119',
      username: 'admin',
      password: hashedPassword,
      speciality: 'Administrator',
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    // Delete the users and reference numbers in reverse order
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('ReferenceNumbers', null, {});
  }
};
