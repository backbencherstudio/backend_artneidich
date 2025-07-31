import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    
    const responseBody = exception.getResponse();
    const message = typeof responseBody === 'string' ? responseBody : responseBody['message'];

    // Return custom error response format
    response.status(status).json({
      status: status,
      success: false,
      message: message || 'An error occurred',
    });
  }
}
