import Router from 'koa-router'
import publicController from '@/api/PublicController'
import ContentController from '@/api/ContentController'

const router = new Router()

router.prefix('/public')

router.get('/getCaptcha', publicController.getCaptcha)
router.get('/getlist', ContentController.getPostList)
router.get('/tips', ContentController.getTips)
router.get('/links', ContentController.getLinks)
router.post('/uploade', publicController.uploadFile)
export default router
