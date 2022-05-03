
const authorModel = require("../Model/authorModel")
const jwt = require("jsonwebtoken");


//1.### Author APIs /authors


// const createAuther = async function (req, res) {
//   try {
//     // const data = req.body

//     // if (!data.firstName) return res.status(400).send({ status: false, msg: " firstName is not present" })

//     // if (!data.lastName) return res.status(400).send({ status: false, msg: " lastName is not present" })

//     // if (!data.title) return res.status(400).send({ status: false, msg: " title is not present" })

//     // if (!data.email) return res.status(400).send({ status: false, msg: " email is not present" })

//     // if (!data.password) return res.status(400).send({ status: false, msg: " password is not present" })

//     const result = await authorModel.create(data)

//     res.status(200).send({ data: result, status: true })
//   }
//   catch (error) {
//     console.log(error.message)
//     res.status(500).send({ msg: error.message });
//   }
// }

const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true;
}

const isValidTitle = function (title) {
  return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}
const isValidRequestBpody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}

const createAuthor = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!isValidRequestBpody(requestBody)) return res.status(400).send({ status: false, msg: 'invalid request parameters.Please provid author details ' })

    const { fName, lName, title, email, password } = requestBody;

    if (!isValid(fName)) return res.status(400).send({ status: false, msg: 'first name is required' })

    if (!isValid(lName)) return res.status(400).send({ status: false, msg: 'last name is required' })

    if (!isValid(title)) return res.status(400).send({ status: false, msg: 'title is required' })

    if (!isValidTitle(title)) return res.status(400).send({ status: false, msg: 'title should be among Mr,Mrs,Miss' })

    if (!isValid(email)) return res.status(400).send({ status: false, msg: 'email is required' })

    if (!isValid(password)) return res.status(400).send({ status: false, msg: 'password is required' })

    const isEmailuse = await authorModel.findOne({ email });
    if (isEmailuse) return res.status(400).send({ status: false, msg: 'email is already registered' })

    const authorData = { fName, lName, title, email, password }
    const newAuthor = await authorModel.create(authorData)
    res.status(200).send({ status: true, msg: 'Author is created successfully' });
  }
  catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
}



//### POST /login
// const loginUser = async function (req, res) {
//   try {
//     let userName = req.body.email;
//     let password = req.body.password;

//     if (!userName) return res.status(400).send({ status: false, msg: "please enter the emailId" })

//     if (!password) return res.status(400).send({ status: false, msg: "please enter the password" })

//     let author = await authorModel.findOne({ emailId: userName, password: password });

//     if (!author) return res.status(400).send({ status: false, msg: "username or the password is not correct" });

//     let token = jwt.sign(
//       {
//         autherId: author._id.toString(),
//         batch: "uranium",
//         organisation: "FUnctionUp",
//       },
//       "functionup-uranium"
//     );

//     res.status(200).send({ status: true, data: token });
//   }
//   catch (error) {
//     console.log(error.message)
//     res.status(500).send({ msg: error.message });
//   }

// };

const loginAuthor = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!isValidRequestBpody(requestBody)) return res.status(400).send({ status: false, msg: 'invalid request parameters.Please provid author details ' })

    const { email, password } = requestBody;
    if (!isValid(email)) return res.status(400).send({ status: false, msg: 'email is required' })

    if (!isValid(password)) return res.status(400).send({ status: false, msg: 'password is required' })

    let author = await authorModel.findOne({ email, password });
    if (!author) return res.status(400).send({ status: false, msg: "email or the password is not correct" });

    let token = jwt.sign(
      {
        autherId: author._id.toString(),
        batch: "uranium",
        organisation: "FUnctionUp",
      },
      "functionup-uranium"
    );
    req.header('x-api-key', token);
    res.status(200).send({ status: true, msg: 'Author login successfully', data: token });
  }
  catch (error) {
    console.log(error.message)
    res.status(500).send({ status: false, msg: error.message });
  }
}




module.exports.createAuthor = createAuthor

module.exports.loginAuthor = loginAuthor