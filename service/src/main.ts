import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CORSの設定
  // フロントエンドのURLを明示する必要がある
  app.enableCors({
    origin: 'http://localhost:3000', // フロントのURLを明示
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3900);
}
bootstrap();
