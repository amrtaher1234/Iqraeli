import { useRef } from 'react'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import './styles.css'
import { navigate } from 'astro/virtual-modules/transitions-router.js'
import type { SurahType } from '../../types/surah'
interface Props {
    surah: SurahType
    src: string
    ayaNumber: number
    surahNumber: number
}
const AudioPlayerComponent = ({
    src,
    surah,
    ayaNumber,
    surahNumber,
}: Props) => {
    const numberOfVerses = surah.surah.numberOfVerses

    const audioRef: React.Ref<AudioPlayer> = useRef(null)

    function nextAyah() {
        if (Number(ayaNumber) < numberOfVerses) {
            navigate(`/surah/${surahNumber}/${Number(ayaNumber) + 1}`)
        } else {
            navigate(`/surah/${Number(surahNumber) + 1}/1`)
        }
    }

    function previousAyah() {
        if (Number(ayaNumber) === 1) {
            navigate(`/surah/${Number(surahNumber) - 1}/1`)
        } else {
            navigate(`/surah/${Number(surahNumber)}/${Number(ayaNumber) - 1}`)
        }
    }
    return (
        <AudioPlayer
            showDownloadProgress={false}
            showFilledProgress={false}
            showFilledVolume={false}
            showSkipControls={true}
            showJumpControls={false}
            layout="stacked-reverse"
            ref={audioRef}
            className="audio-player"
            style={{
                direction: 'ltr',
            }}
            autoPlay
            src={src}
            onPlay={(e) => console.log('onPlay')}
            onClickNext={nextAyah}
            onClickPrevious={previousAyah}
        />
    )
}

export default AudioPlayerComponent
