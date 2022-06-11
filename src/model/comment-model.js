export default class CommentModel extends Observable {
  #commentsApiService;

  constructor(commentsApiService, movieModel) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  getMovieComments = async (movieId) => {
    try {
      const comments = await this.#commentsApiService.getMovieComments(movieId);
      return comments.map(this.#adaptToClient);
    } catch(err) {
      return [];
    }
  };

  addCommentToMovie = async (updateType, movieId, comment) => {
    try {
      const response = await this.#commentsApiService.addCommentToMovie(movieId, comment);
      const update = this.#adaptToClient(response);
      const updatedComments = update.comments.map(this.#adaptToClient);
      this._notify(updateType, updatedComments);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteCommentFromMovie = async (updateType, commentId) => {
    try {
      await this.#commentsApiService.removeCommentFromMovie(commentId);
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };

  #adaptToClient = (comment) => {
    const adaptedComment = {...comment,
      'text': comment.comment,
    };

    delete adaptedComment.comment;

    return adaptedComment;
  };
}
