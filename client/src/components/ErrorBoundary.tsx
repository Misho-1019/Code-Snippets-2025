import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught:', error, errorInfo)
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong</h1>
                    <p className="text-gray-600 mb-2">An unexpected error occurred.</p>
                    <p className="text-sm text-gray-400 mb-6 max-w-md text-center">
                        {this.state.error?.message}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                        Reload Page
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
