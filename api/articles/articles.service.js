const Article = require("./articles.schema");

class ArticleService {
  create(data) {
    try {
      const article = new Article(data);
      return article.save();
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }
  delete(id) {
    return Article.deleteOne({ _id: id });
  }
  getUserArticles(userId) {
    return Article.find({ userId: userId }).populate({
      path: "user",
      select: "-password",
    });
  }
}

module.exports = new ArticleService();
