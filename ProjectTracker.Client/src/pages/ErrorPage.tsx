import { useRouteError, isRouteErrorResponse } from "react-router-dom";


const ErrorPage = () => {
    const error = useRouteError();

    const getErrorMessage = () => {
        if (isRouteErrorResponse(error)) {
            return `${error.status}: ${error.statusText}`;
        }
        else if (error instanceof Error) {
            return error.message;
        }
        else {
            return "Unknown error";
        }
    };

    return(
        <div>
            <span className="text-2xl">Oops!</span>
            <p>An unexpected error occurred:</p>
            <p>{getErrorMessage()}</p>
        </div>
    );
}

export default ErrorPage;