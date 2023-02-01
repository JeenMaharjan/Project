const express = require("express")
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUsersDetails, updatePassword, updateUser, getAllUsers, getUser, updateUserRole, deleteUserRole } = require("../controllers/userController")
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")


const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route('/logout').post(logout)
router.route('/me').get(isAuthenticatedUser, getUsersDetails)
router.route('/password/update').put(isAuthenticatedUser, updatePassword)
router.route('/me/update').put(isAuthenticatedUser, updateUser)
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles("admin"), getUser).put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUserRole)
module.exports = router