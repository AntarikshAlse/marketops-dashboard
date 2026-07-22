import { Component, useEffect, type ErrorInfo, type ReactNode } from 'react';
import { ErrorBoundary, getErrorMessage } from "react-error-boundary";

interface Props {
  children: ReactNode;
}

export default function ChartErrorBoundary({ children }: Props) {
  useEffect(() => {
    throw new Error("test")
  },[])
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
           <div role="alert">
             <p>Something went wrong:</p>
             <pre>{getErrorMessage(error)}</pre>
             <button onClick={resetErrorBoundary}>Try again</button>
           </div>
         )}
         onError={(error, info) => {
           // Log the error to your error reporting service
             console.error('Chart crashed', error, info);
         }}
         onReset={() => {
           // Reset any state that may have caused the error
         }}
       >
        {children}
       </ErrorBoundary>
  )

}
