import {generateComment} from '../mock/comment.js';

export default class CommentModel {
  comments = Array.from({length: 21}, generateComment);

  getComments() {
    return this.comments;
  }
}
