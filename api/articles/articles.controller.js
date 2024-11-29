const articlesService = require("./articles.service");

class ArticleController {
  async create(req, res, next) {
    try {
      const articleData = {
        ...req.body,
        userId: req.user._id,
      };
      const article = await articlesService.create(articleData);
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new ForbiddenError(
          "Vous n'avez pas les droits pour modifier cet article"
        );
      }
      const id = req.params.id;
      const data = req.body;
      const articleModified = await articlesService.update(id, data);
      req.io.emit("article:update", articleModified);
      res.json(articleModified);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new ForbiddenError(
          "Vous n'avez pas les droits pour modifier cet article"
        );
      }
      const id = req.params.id;
      await articlesService.delete(id);
      req.io.emit("article:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticleController();
