
// Password = admin@adqore123
module.exports = {
    up: queryInterface => queryInterface.bulkInsert('users', [{
        first_name: "sajjad",
        last_name: "ali",
        email: 'sajjad@gmail.com',
        password: '47e6bfbfe7794f97c278f6c27c7f0356', // password is `sajjad734`
        created_at: new Date(),
        updated_at: new Date(),
    }], {}),

    down: queryInterface => queryInterface.bulkDelete('users', [{
        first_name: "sajjad",
        last_name: "ali",
        email: 'sajjad@gmail.com',
        password: '47e6bfbfe7794f97c278f6c27c7f0356',
        created_at: new Date(),
        updated_at: new Date(),
    }], {}),
};
