import { useState, useEffect } from 'react'

export const useWindowSize = () => {
    const [size, setSize] = useState(window.innerHeight)
    useEffect(() => {
        const handleResize = () => {
            setSize(window.innerHeight)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])
    return size
}