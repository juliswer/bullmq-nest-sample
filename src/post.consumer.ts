import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { POST_QUEUE, PUBLISH_POST } from './constants';
import { Post } from './post';

@Processor(POST_QUEUE)
export class PostConsumer {
  @Process(PUBLISH_POST)
  async handlePublishPost(job: Job<Post>) {
    try {
      console.log(`Publish post ${job.data.message} - ${job.data.deadline}`);
    } catch (error) {
      console.log('Error executing job:', error.message);
      throw error;
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job<Post>) {
    console.log(`Job Completed #${job.id}`);
  }

  @OnQueueFailed()
  async handleFailed(job: Job<Post>, error: Error) {
    console.warn(`⚠️ Job Failed | Post ID: ${job.data.message}`);
    console.warn(`Error: ${error.message}`);

    // Verify if there are remaining attempts
    if (job.attemptsMade <= job.opts.attempts - 1) {
      console.log(`\n\n🔄 Retrying... attempt #${job.attemptsMade + 1} \n \n`);
    } else {
      console.log(`❌ No remaining attempts for post ID: ${job.data.message}`);
    }
  }
}
