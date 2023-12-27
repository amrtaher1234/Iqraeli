import { useState } from 'react'
import './styles.css'
import { navigate } from 'astro:transitions/client'
import Button from '../Button'

interface Match {
    metadata: {
        surah_name_arabic: string
        surah_number: number
        aya_number: number
    }
}
interface Props {
    onResults?: (matches: {
        metadata: {
            surah_name_arabic: string
            surah_number: number
            aya_number: number
        }[]
    }) => void
}
const RecordButton = ({ onResults }: Props) => {
    const [matches, setMatches] = useState<Match[]>([])
    const [isRecorded, setIsRecorded] = useState(false)
    const [disableRecorder, setDisableRecorder] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    )
    const [audioChunks, setAudioChunks] = useState<BlobPart[]>([])

    const startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                })
                const mediaRecorder = new MediaRecorder(stream)
                mediaRecorder.start()

                const chunks: any = []
                mediaRecorder.ondataavailable = function (event) {
                    chunks.push(event.data)
                }

                setMediaRecorder(mediaRecorder)
                setAudioChunks(chunks)
                setIsRecording(true)
            } catch (error) {
                console.error('Error accessing microphone:', error)
            }
        } else {
            console.error('getUserMedia not supported on your browser!')
        }
    }
    const sendAudio = () => {
        setDisableRecorder(true)
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' })
        const formData = new FormData()
        formData.append('audio', audioBlob, 'recording.mp3')
        fetch('/audio', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then(({ matches, text }) => {
                setMatches(matches)
                const mostSimilarOption = matches[0]
                const { aya_number, surah_number } = mostSimilarOption.metadata
                if (onResults) {
                    onResults(matches)
                }
                navigate(`/surah/${surah_number}/${aya_number}`, {
                    state: history.state,
                })
            })
            .catch((error) => console.error('Error:', error))
            .finally(() => {
                setDisableRecorder(false)
            })

        setAudioChunks([])
        setIsRecorded(false)
    }
    const stopRecording = () => {
        if (mediaRecorder) {
            // setDisableRecorder(true)
            mediaRecorder.stop()
            setIsRecording(false)
            mediaRecorder.onstop = async function () {
                setIsRecorded(true)
            }
        }
    }

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording()
        } else {
            startRecording()
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
                <Button
                    disabled={disableRecorder}
                    onClick={() => {
                        toggleRecording()
                    }}
                    className="relative flex min-w-24 justify-center self-center"
                >
                    {isRecording && <span className="flash-light"></span>}
                    {isRecording ? 'إيقاف التسجيل' : 'سجل قرأتك'}
                </Button>
                {isRecorded && (
                    <Button
                        disabled={disableRecorder}
                        onClick={() => {
                            sendAudio()
                        }}
                        className="min-w-24 self-center"
                    >
                        أرسل
                    </Button>
                )}
            </div>

            {matches && matches.length ? (
                <section className="prose">
                    <h4>النتائج الممكنة</h4>
                    <p>هذه النتائج هي نتائج ممكنة لسجلك مرتبة حسب التشابه</p>
                    <ol
                        style={{
                            'list-style': 'arabic-indic',
                        }}
                    >
                        {matches.map(
                            ({
                                metadata: {
                                    aya_number,
                                    surah_name_arabic,
                                    surah_number,
                                },
                            }) => (
                                <li>
                                    <span>
                                        رقم الآية:{' '}
                                        {Number(aya_number).toLocaleString(
                                            'ar'
                                        )}
                                    </span>
                                    {' - '}
                                    <a
                                        href={`/surah/${surah_number}/${aya_number}`}
                                    >
                                        {surah_name_arabic}
                                    </a>
                                </li>
                            )
                        )}
                    </ol>
                </section>
            ) : null}
        </div>
    )
}

export default RecordButton
