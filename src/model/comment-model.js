import { generateComment } from '../mock/comment.js';

export default class CommentModel {
  #comments = Array.from({length: 30}, generateComment);

  get comments() {
    return this.#comments;
  }

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
}
