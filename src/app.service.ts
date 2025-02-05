import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { POST_QUEUE } from './constants';

@Injectable()
export class AppService {
  constructor(@InjectQueue(POST_QUEUE) private readonly postQueue: Queue) {}

  getHello(): string {
    return 'Hello World!';
  }

  async processPost(postId: string, deadline: Date) {
    const delay = deadline.getTime() - Date.now();

    await this.postQueue.add(
      'publishPost',
      { postId, deadline },
      { delay, attempts: 3 },
    );

    console.log(
      `Post ${postId} agregado a la cola para ser publicado en ${deadline}`,
    );
  }
}
