import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { POST_QUEUE, PUBLISH_POST } from './constants';

@Processor(POST_QUEUE)
export class PostConsumer {
  @Process(PUBLISH_POST)
  async handlePublishPost(job: Job) {
    try {
      const data: { postId: string; deadline: Date } = job.data;
      console.log(`Publish post ${data.postId} - ${data.deadline}`);
    } catch (error) {
      console.log('Error al ejecutar el trabajo:', error.message);
      throw error;
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`Job Completed #${job.id}`);
  }

  @OnQueueFailed()
  async handleFailed(job: Job, error: Error) {
    console.warn(`⚠️ JobFalló el trabajo del post ID: ${job.data.postId}`);
    console.warn(`Error: ${error.message}`);

    // Verificar si aún hay intentos restantes
    if (job.attemptsMade <= job.opts.attempts - 1) {
      console.log(
        `\n\n🔄 Reintentando... intento #${job.attemptsMade + 1} \n \n`,
      );
    } else {
      console.log(
        `❌ Sin más reintentos disponibles para el post ID: ${job.data.postId}`,
      );
    }
  }
}
