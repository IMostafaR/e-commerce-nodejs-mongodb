/**
 * Class to create new error
 */
export class AppError extends Error {
  /**
   * Error details
   * @param {string} message
   * @param {number} statusCode
   */
  constructor(message, statusCode) {
    /**
     * @property {string} message
     */
    super(message);
    /**
     * @property {number} statusCode
     */
    this.statusCode = statusCode;
  }
}
