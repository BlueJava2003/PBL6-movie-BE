import { HttpException, HttpStatus } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0); // Set time to beginning of the day

          const inputDate = new Date(value);
          inputDate.setHours(0, 0, 0, 0); // Set time to beginning of the day

          return inputDate >= currentDate;
        },
        defaultMessage(args: ValidationArguments) {
          throw new HttpException(
            `${args.property} must be today or a future date`,
            HttpStatus.BAD_REQUEST,
          );
        },
      },
    });
  };
}
