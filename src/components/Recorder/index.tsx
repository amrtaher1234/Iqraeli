import { useState } from 'react'
import './styles.css'
import { navigate } from 'astro:transitions/client'
import Button from '../Button'

const RecordButton = () => {
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
                // Handle the error appropriately
            }
        } else {
            console.error('getUserMedia not supported on your browser!')
            // Notify user that their browser does not support this feature
        }
    }
    const sendAudio = () => {
        setDisableRecorder(true)
        debugger
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' })
        const formData = new FormData()
        formData.append('audio', audioBlob, 'recording.mp3')
        fetch('/audio', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then(({ surahNumber, ayaNumber }) => {
                if (!surahNumber || !ayaNumber) {
                    alert('error')
                    return
                }
                navigate(`/surah/${surahNumber}/${ayaNumber}`)
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
        <div className="flex flex-row gap-2">
            <Button
                disabled={disableRecorder}
                onClick={() => {
                    toggleRecording()
                }}
                className="relative flex min-w-24 justify-center self-center"
            >
                {isRecording && <span className="flash-light"></span>}
                {isRecording ? 'stop' : 'سجل قرأتك'}
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
    )
}

export default RecordButton
