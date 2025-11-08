import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './common/middleware/request_logger.middleware';
import { CorrelationIdMiddleware } from './common/middleware/correlation_id.middleware';
import { HttpExceptionFilter } from './common/filters/http_exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['log', 'error', 'warn'],
    });
    app.use(cookieParser());

    const config = app.get(ConfigService);

    // Global validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Global serialization (untuk @Exclude, @Expose)
    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    // Global exception filter -> konsistenkan bentuk error payload
    app.useGlobalFilters(new HttpExceptionFilter());


    // Middleware (order matters)
    app.use(CorrelationIdMiddleware());
    app.use(LoggerMiddleware());

    // Prefix API, e.g. /api/v1
    app.setGlobalPrefix(process.env.NODE_ENV === 'production' ? 'api/v1' : 'api/dev/v1');

    const port = config.get('port', 3000);
    await app.listen(port);
    Logger.log(`App started on port ${port}`);
}
bootstrap();
