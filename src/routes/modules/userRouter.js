import Router from 'koa-router'
import UserController from '@/api/UserController'
const router = new Router()
router.prefix('/user')
router.get('/fav', UserController.UserSign)
router.get('/getall', UserController.getall)
router.get('/del', UserController.del)
router.post('/upd', UserController.updateOne)
router.post('/add', UserController.addOne)
router.post('/base', UserController.updateUserInfo)
router.get('/get_info', UserController.getInfo)
export default router
