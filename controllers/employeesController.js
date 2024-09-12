// const data = {
//     employees: require('../model/employees.json'),
//     setEmployees: function (data) { this.employees = data }
// }
// const fs = require('fs');
// const path = require('path');

const Employee = require("../model/Employee");

// Function to write the updated employees data to the JSON file
const saveEmployeesToFile = () => {
  fs.writeFileSync(
    path.join(__dirname, "..", "model", "employees.json"),
    JSON.stringify(data.employees, null, 2) // `null, 2` formats the JSON to be more readable
  );
};

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees) return res.status(204).json({ message: "No employee found" });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  // const newEmployee = {
  //     id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1,
  //     firstname: req.body.firstname,
  //     lastname: req.body.lastname
  // }
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "Please provide both firstname and lastname" });
  }
  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
  }

  //   if (!newEmployee.firstname || !newEmployee.lastname) {
  //     return res
  //       .status(400)
  //       .json({ message: "First and last names are required." });
  //   }

  //   data.setEmployees([...data.employees, newEmployee]);
  //   saveEmployeesToFile();

  //   res.status(201).json(data.employees);
};

const updateEmployee = async (req, res) => {
  //   const employee = data.employees.find(
  //     (emp) => emp.id === parseInt(req.body.id)
  //   );
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Please provide employee id" });
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;
  //   const filteredArray = data.employees.filter(
  //     (emp) => emp.id !== parseInt(req.body.id)
  //   );
  //   const unsortedArray = [...filteredArray, employee];
  //   data.setEmployees(
  //     unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  //   );
  const result = await employee.save();
  res.status(200).json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Please provide employee id" });
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }
  const result = await employee.deleteOne({ _id: req.body.id });
  res.status(200).json(result);
  //   const employee = data.employees.find(
  //     (emp) => emp.id === parseInt(req.body.id)
  //   );
  //   if (!employee) {
  //     return res
  //       .status(400)
  //       .json({ message: `Employee ID ${req.body.id} not found` });
  //   }
  //   const filteredArray = data.employees.filter(
  //     (emp) => emp.id !== parseInt(req.body.id)
  //   );
  //   data.setEmployees([...filteredArray]);
  //   res.json(data.employees);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Please provide employee id" });
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `Employee ID ${req.params.id} not found` });
  }
  res.status(200).json(employee);
  //   const employee = data.employees.find(
  //     (emp) => emp.id === parseInt(req.params.id)
  //   );
  //   if (!employee) {
  //     return res
  //       .status(400)
  //       .json({ message: `Employee ID ${req.params.id} not found` });
  //   }
  //   res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
