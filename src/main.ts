import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PUERTO:string | number = process.env.PORT ?? 3000;

  app.enableCors();
  await app.listen(PUERTO, () => {
    console.log(`http://localhost:${PUERTO}`);

  });
}
bootstrap();
