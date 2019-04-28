const router = require('express').Router();
const axios = require('axios');
const cheerio = require('cheerio');
const aC = require('../controllers/articleController');
const nC = require('../controllers/noteController');

//* GET route for scraping information source:
router.route('/scrape', (_req: any, res: { send: (arg0: string) => void }, _next: any) => {
    axios.get('https://www.realtor.com/news/real-estate-news/').then((response: { data: any }) => {
        console.log(response);
        const $ = cheerio.load(response.data);
        $('.post .item').each((_index: any, element: any) => {
            const result = {
                title: $(element)
                  .children('a')
                  .children('.headline')
                  .children('h4')
                  .text(),
                link: $(element)
                  .children('.overlay-link')
                  .attr('href'),
                image: $(element)
                  .children('.thumbnail')
                  .children('.wp-post-image')
                  .attr('src')
            };
            aC.Article.create(result);
        });
        res.send('Scrape Complete!');
    });
});

//* DELETE route for all articles currently in the DB:
router.route('/clear').delete(aC.removeAll);

//* GET route for all articles from DB:
router.route('/articles/').get(aC.findAll);

//* GET route for only saved articles:
router.route('/saved/').get(aC.findSaved);

//* POST route for updating an article in the DB to saved:
router.post('/save/:id',
    (req: { params: { id: any } },
        res: { send: { (arg0: any): void; (arg0: any): void } },
        _next: any) => {
        const aToUpdate = {
            _id: mongojs.ObjectId(req.params.id),
            $set: {
                saved: true
            }
        };
        aC.Article.update(aToUpdate);
    });

//* POST route for updating an article in the DB to unsaved:
router.post('/unsave/:id',
    (req: { params: { id: any } },
        res: { send: { (arg0: any): void; (arg0: any): void } },
        _next: any) => {
        const aToUpdate = {
            _id: mongojs.ObjectId(req.params.id),
            $set: {
                saved: false
            }
        };
        aC.Article.update(aToUpdate);
    });

//* GET route for a single note by ID:
router.get('/notes/:id',
    (req: { params: { id: any } },
        res: { json: { (arg0: any): void; (arg0: any): void } },
        _next: any) => {
        const singleNote = req.params.id;
        nC.Note.findById(singleNote);
    });

//* POST route for creating a new note:
router.post('/note/:id',
    (req: { body: any; params: { id: any } },
        res: { json: { (arg0: any): void; (arg0: any): void } },
        _next: any) => {
        const noteContent = req.body;
        nC.Note.create(noteContent);
    });

module.exports = router;
