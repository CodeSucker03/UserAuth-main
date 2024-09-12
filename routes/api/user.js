const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const Roles_list = require('../../config/userRole')
const verifyRoles = require('../../middleware/verifyRoles')
const verifyJWT = require('../../middleware/verifyJWT')
router.route('/')
    .get(verifyRoles(Roles_list.Admin),userController.getAllUser)
    .delete(verifyRoles(Roles_list.Admin), userController.deleteUser)
    .put(verifyRoles(Roles_list.Admin), userController.updateUser)
router.route('/:id')
    .get(verifyRoles(Roles_list.Admin), userController.getUser);

module.exports = router;