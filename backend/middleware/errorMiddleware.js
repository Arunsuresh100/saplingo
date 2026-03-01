// This middleware will run if any of the routes throw an error.

// Handles routes that are not found (404)
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Handles all other errors (500)
const errorHandler = (err, req, res, next) => {
    // Sometimes an error might come in with a 200 status code, we want to default to 500
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Mongoose-specific error for bad ObjectIds
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    res.status(statusCode).json({
        message: message,
        // We only want the stack trace if we are not in production
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };