export class ValidationError extends Error {
  constructor(
    public errors: string[],
    message: string = 'Validation failed'
  ) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
