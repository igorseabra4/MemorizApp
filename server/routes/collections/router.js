const express = require('express')
const router = express.Router()

router.use(require('../users/middleware/auth'))

router.route('/collections/')
    .post(require('./actions/collectionPost'))
    .get(require('./actions/collectionsGet'))

router.route('/collections/:collectionId')
    .get(require('./actions/collectionGet'))
    .put(require('./actions/collectionPut'))
    .delete(require('./actions/collectionDelete'))

router.route('/collections/:collectionId/study')
    .get(require('./actions/collectionGetStudy'))

router.route('/collections/:collectionId/lessons')
    .post(require('./actions/lessonPost'))

router.route('/collections/:collectionId/lessons/reorder')
    .put(require('./actions/lessonsReorder'))

router.route('/collections/:collectionId/lessons/:lessonId')
    .put(require('./actions/lessonPut'))
    .delete(require('./actions/lessonDelete'))

router.route('/collections/:collectionId/lessons/:lessonId/cards')
    .post(require('./actions/cardPost'))

router.route('/collections/:collectionId/lessons/:lessonId/cards/reorder')
    .put(require('./actions/cardsReorder'))

router.route('/collections/:collectionId/lessons/:lessonId/cards/:cardId')
    .put(require('./actions/cardPut'))
    .delete(require('./actions/cardDelete'))

router.route('/collections/:collectionId/lessons/:lessonId/cards/:cardId/bury')
    .put(require('./actions/cardBury'))

router.route('/collections/:collectionId/lessons/:lessonId/begin')
    .post(require('./actions/beginLesson'))

router.route('/collections/:collectionId/pending')
    .get(require('./actions/cardGetPending'))

router.route('/collections/:collectionId/cards/:cardId/answer')
    .post(require('./actions/cardAnswer'))

module.exports = router