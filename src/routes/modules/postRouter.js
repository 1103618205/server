import Router from 'koa-router'
import Content from '@/api/ContentController'
const router = new Router()
router.prefix('/post')
router.post('/add', Content.addPost)
router.get('/del', Content.delPost)
router.post('/update', Content.updatePost)
export default router
