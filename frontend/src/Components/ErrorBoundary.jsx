import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    backgroundColor: '#f8f9fa',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>
                        Oops! Something went wrong
                    </h1>
                    <p style={{ color: '#6c757d', marginBottom: '30px', maxWidth: '500px' }}>
                        We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: '#1877f2',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            marginBottom: '20px'
                        }}
                    >
                        Refresh Page
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <details style={{ marginTop: '20px', textAlign: 'left' }}>
                            <summary style={{ cursor: 'pointer', color: '#6c757d' }}>
                                Error Details (Development Mode)
                            </summary>
                            <pre style={{ 
                                backgroundColor: '#f1f3f4', 
                                padding: '15px', 
                                borderRadius: '4px',
                                overflow: 'auto',
                                fontSize: '12px',
                                color: '#dc3545'
                            }}>
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
