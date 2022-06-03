export default class CommentModel {
  #commentsApiService;
  #comments;

  constructor(commentsApiService) {
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

  addComment = (update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];
  };

  deleteComment = (commentId) => {
    const index = this.#comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];
  };

  #adaptToClient = (comment) => {
    const adaptedComment = {...comment,
      text: comment.comment,
    };

    delete adaptedComment.comment;

    return adaptedComment;
  }

  #adaptToServer = (comment) => {
    const adaptedComment = {...comment,
      comment: comment.text,
    };

    delete adaptedComment.text;

    return adaptedComment;
  }
}
