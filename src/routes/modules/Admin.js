import Router from 'koa-router'
import AdminController from '@/api/AdminController'
const router = new Router()
router.prefix('/Admin')
router.get('/getlist', AdminController.getMenu)
router.get('/getRolse', AdminController.getRoles)
router.get('/getRoleName', AdminController.getRoleName)
router.post('/addMenu', AdminController.addMenu)
router.post('/addRolse', AdminController.addRole)
router.post('/updMenu', AdminController.updateMenu)
router.post('/updRolse', AdminController.updateRoles)

export default router
