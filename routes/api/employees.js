const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');
const Roles_list = require('../../config/userRole')
const verifyRoles = require('../../middleware/verifyRoles')
const verifyJWT = require('../../middleware/verifyJWT')
router.route('/')
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(Roles_list.Admin, Roles_list.Editor), employeesController.createNewEmployee)
    // .post( employeesController.createNewEmployee)
    .put(verifyRoles(Roles_list.Admin, Roles_list.Editor), employeesController.updateEmployee)
    .delete(verifyRoles(Roles_list.Admin), employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;