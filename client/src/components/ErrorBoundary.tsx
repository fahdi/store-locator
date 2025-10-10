import { Component, ErrorInfo, ReactNode } from 'react'
import toast from 'react-hot-toast'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Show toast notification for the error
    toast.error('Something went wrong. The page has been reset.')
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-50">
          <div className="text-center p-6 max-w-md">
            <div className="text-red-600 text-lg font-medium mb-2">
              Something went wrong
            </div>
            <div className="text-gray-600 text-sm mb-4">
              An unexpected error occurred while loading this component.
            </div>
            {this.state.error && (
              <details className="text-xs text-gray-500 mb-4 text-left bg-gray-100 p-2 rounded">
                <summary className="cursor-pointer font-medium mb-2">
                  Technical Details
                </summary>
                <code className="whitespace-pre-wrap break-all">
                  {this.state.error.message}
                  {this.state.error.stack && (
                    <>
                      {'\n\n'}
                      {this.state.error.stack}
                    </>
                  )}
                </code>
              </details>
            )}
            <div className="flex gap-2 justify-center">
              <button 
                onClick={this.handleReset}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Try Again
              </button>
              <button 
                onClick={this.handleReload}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}