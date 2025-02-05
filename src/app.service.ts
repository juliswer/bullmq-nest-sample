import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { POST_QUEUE, PUBLISH_POST } from './constants';
import { Post } from './post';

@Injectable()
export class AppService {
  constructor(@InjectQueue(POST_QUEUE) private readonly postQueue: Queue) {}

  getHello(): string {
    return 'Hello World!';
  }

  async processPost(post: Post) {
    await this.addPostToQueue(post);

    return `Post ${post.message} being pushed to the queue to be published at ${post.deadline}`;
  }

  private async addPostToQueue(post: Post): Promise<void> {
    const delay = post.deadline.getTime() - Date.now();

    await this.postQueue.add(PUBLISH_POST, post, { delay, attempts: 3 });

    return;
  }
}
