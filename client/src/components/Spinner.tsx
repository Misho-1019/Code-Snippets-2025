interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
    const sizeClass = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div className={`animate-spin rounded-full ${sizeClass} border-b-2 border-primary-600`} />
        </div>
    )
}
