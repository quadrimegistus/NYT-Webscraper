const noteModels = require('../models');

module.exports = {
    findAll(req: { query: any },
        res: { json: (arg0: any) => void; status: (arg0: number) => { json: (arg0: any) => void } }) {
        noteModels.Note.find(req.query)
          .sort({ date: -1 })
          .then((dbModel: any) => res.json(dbModel))
          .catch((err: any) => res.status(422).json(err));
    },
    findById(req: { params: { id: any } },
        res: { json: (arg0: any) => void; status: (arg0: number) => { json: (arg0: any) => void } }) {
        noteModels.Note.findById(req.params.id)
          .then((dbModel: any) => res.json(dbModel))
          .catch((err: any) => res.status(422).json(err));
    },
    create(req: { body: any },
        res: { json: (arg0: any) => void; status: (arg0: number) => { json: (arg0: any) => void } }) {
        noteModels.Note.create(req.body)
          .then((dbModel: any) => res.json(dbModel))
          .catch((err: any) => res.status(422).json(err));
    },
    update(req: { params: { id: any }; body: any },
        res: { json: (arg0: any) => void; status: (arg0: number) => { json: (arg0: any) => void } }) {
        noteModels.Note.findOneAndUpdate({ _id: req.params.id }, req.body)
          .then((dbModel: any) => res.json(dbModel))
          .catch((err: any) => res.status(422).json(err));
    },
    remove(req: { params: { id: any } },
        res: { json: (arg0: any) => void; status: (arg0: number) => { json: (arg0: any) => void } }) {
        noteModels.Note.findById({ _id: req.params.id })
          .then((dbModel: { remove: () => void }) => dbModel.remove())
          .then((dbModel: any) => res.json(dbModel))
          .catch((err: any) => res.status(422).json(err));
    }
};
