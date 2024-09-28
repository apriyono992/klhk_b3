import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException, ValidationError } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof HttpException ? exception.getResponse() : 'Internal server error',
    };

    console.error('Exception caught by filter:', errorResponse);

    response.status(status).json(errorResponse);
  }
}

@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
      const groupedErrors = this.groupValidationErrors(exceptionResponse.message);
      return response.status(status).json({
        statusCode: status,
        message: groupedErrors,
        error: 'Bad Request',
      });
    }

    response.status(status).json(exceptionResponse);
  }

  // Function to group errors by property based on the array of messages
  private groupValidationErrors(messages: string[]): Record<string, string> {
    const errorMap: Record<string, string[]> = {};

    messages.forEach((message) => {
      // Extract the property name from the message (first part before the space)
      const property = message.split(' ')[0];

      // Group errors by property name
      if (!errorMap[property]) {
        errorMap[property] = [];
      }
      errorMap[property].push(message);
    });

    // Reduce grouped errors to a single message per property (combine multiple errors)
    const groupedErrors: Record<string, string> = {};
    for (const property in errorMap) {
      groupedErrors[property] = errorMap[property].join(', ');  // Combine errors for the property
    }

    return groupedErrors;
  }
}