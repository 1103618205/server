import Router from 'koa-router'
import loginController from '@/api/LoginController'
import UserController from '@/api/UserController'
const router = new Router()

router.prefix('/login')

router.post('/forget', loginController.forget)
router.post('/login', loginController.login)
router.post('/reg', loginController.reg)
router.post('/email', UserController.updateUsername)

export default router
