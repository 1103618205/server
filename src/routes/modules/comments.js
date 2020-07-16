import Router from 'koa-router'
import CommentConroller from '@/api/CommentsController'
const router = new Router()
router.prefix('/comments')
router.post('/getDetail', CommentConroller.tgetDetail)
router.get('/getComments', CommentConroller.getComments)
router.post('/addComments', CommentConroller.addComments)
router.post('/updateComments', CommentConroller.updateContent)
export default router
