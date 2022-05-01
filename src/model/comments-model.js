import {generateComment} from '../mock/comment.js';

export default class CommentModel {
  comments = Array.from({length: 20}, generateComment);

  getComments() {
    return this.comments;
  }
}
