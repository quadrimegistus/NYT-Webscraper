const articleModels = require('../models');

module.exports = {
    findAll(req: { query: any },
        res: { json: (arg0: any) => void; status: (arg0: number) => { json: (arg0: any) => void } }) {
        articleModels.Article.find(req.query)
          .sort({ date: -1 })
          .then((dbModel: any) => res.json(dbModel))
          .catch((err: any) => res.status(422).json(err));
    },
    findById(req: { params: { id: any } },
        res: { json: (arg0: any) => void; status: (arg0: number) => { json: (arg0: any) => void } }) {
        articleModels.Article.findById(req.params.id)
          .populate('notes')
          .then((dbModel: any) => res.json(dbModel))
          .catch((err: any) => res.status(422).json(err));
    },
    findSaved(_req: any,
        res: { json: (arg0: any) => void; status: (arg0: number) => { json: (arg0: any) => void } }) {
        const findSaved = { saved: true };
        articleModels.Article.findAll(findSaved)
          .populate('notes')
          .then((dbModel: any) => res.json(dbModel))
          .catch((err: any) => res.status(422).json(err));
    },
    create(req: { body: any },
        res: { json: (arg0: any) => void; status: (arg0: number) => { json: (arg0: any) => void } }) {
        articleModels.Article.create(req.body)
          .then((dbModel: any) => res.json(dbModel))
          .catch((err: any) => res.status(422).json(err));
    },
    update(req: { params: { id: any }; body: any },
        res: { json: (arg0: any) => void; status: (arg0: number) => { json: (arg0: any) => void } }) {
        articleModels.Article.findOneAndUpdate({ _id: req.params.id }, req.body)
          .then((dbModel: any) => res.json(dbModel))
          .catch((err: any) => res.status(422).json(err));
    },
    remove(req: { params: { id: any } },
        res: { json: (arg0: any) => void; status: (arg0: number) => { json: (arg0: any) => void } }) {
        articleModels.Article.findById({ _id: req.params.id })
          .then((dbModel: { remove: () => void }) => dbModel.remove())
          .then((dbModel: any) => res.json(dbModel))
          .catch((err: any) => res.status(422).json(err));
    },
    removeAll(req: { query: any },
        res: { status: (arg0: number) => { json: (arg0: any) => void } }) {
        articleModels.Article.find(req.query)
          .then((dbModel: { deleteMany: () => void }) => dbModel.deleteMany())
          .catch((err: any) => res.status(422).json(err));
    }
};
