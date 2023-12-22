import { useState, useEffect, useRef } from 'react'

const AudioPlayer = ({ src }: { src: string }) => {
    const [isPlaying, setIsPlaying] = useState(false)

    const audioRef = useRef(new Audio(src))

    useEffect(() => {
        const audio = audioRef.current
        audio.addEventListener('play', () => setIsPlaying(true))
        audio.addEventListener('pause', () => setIsPlaying(false))

        return () => {
            audio.removeEventListener('play', () => setIsPlaying(true))
            audio.removeEventListener('pause', () => setIsPlaying(false))
        }
    }, [])

    const togglePlayPause = () => {
        const audio = audioRef.current
        if (audio.paused) {
            audio.play()
        } else {
            audio.pause()
        }
    }

    return (
        <button
            onClick={() => togglePlayPause()}
            className="w-48 rounded-2xl border
             border-[#94a197] bg-transparent p-2 
             transition duration-150 ease-in-out hover:bg-gray-200
            active:bg-gray-300 "
            lang="ar"
        >
            {isPlaying ? 'إيقاف' : 'تشغيل'}
        </button>
    )
}

export default AudioPlayer
