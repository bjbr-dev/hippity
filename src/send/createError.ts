/**
 * Create an Error with the specified message, config, error code, request and response.
 */
export function createError(
  message: string,
  details: Record<string, unknown>
): Error {
  return enhanceError(new Error(message), details)
}

export function enhanceError(
  error: Error,
  details: Record<string, unknown>
): Error {
  Object.assign(error, details, { isHippityError: true })
  ;((error as unknown) as Record<string, unknown>).toJSON = function (): Record<
    string,
    unknown
  > {
    return {
      // Standard
      message: this.message,
      name: this.name,

      // Microsoft
      description: this.description,
      number: this.number,

      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,

      // Hippity
      ...details,
    }
  }

  return error
}
