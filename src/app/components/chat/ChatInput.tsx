import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, Square, X } from "lucide-react";

interface ChatInputProps {
    onSend: (msg: string, file?: File) => void;
    disabled: boolean;
    isGenerating?: boolean;
    onStop?: () => void;
}

export const ChatInput = ({
    onSend,
    disabled,
    isGenerating = false,
    onStop
}: ChatInputProps) => {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // NEW: Voice Recorder States
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // NEW: Recorder Refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<number | null>(null);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, []);

    const submit = () => {
        if ((!value.trim() && !selectedFile && !audioBlob) || disabled || isGenerating) return;

        // Send audio file if it exists, otherwise send standard file/text
        const fileToSend = audioBlob
            ? new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: audioBlob.type })
            : selectedFile || undefined;

        onSend(value.trim(), fileToSend);

        setValue("");
        setSelectedFile(null);
        setAudioBlob(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };

    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
        }
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // --- Voice Recording Logic ---
    const toggleRecording = async () => {
        if (isRecording) {
            stopRecording();
        } else {
            await startRecording();
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                setAudioBlob(audioBlob);
                // Stop all audio tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            timerIntervalRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Unable to access microphone. Please check browser permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };

    const handleRemoveAudio = () => {
        setAudioBlob(null);
    };

    // Helper to format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="border-t border-border bg-background/95 px-4 py-3">
            <div className="max-w-3xl mx-auto">
                <div
                    className={`rounded-2xl border transition-all duration-200 ${focused ? "border-foreground/50 shadow-lg" : "border-border"
                        }`}
                    style={{ background: "var(--card)" }}
                >

                    {/* --- FILE & AUDIO PREVIEW SECTION --- */}
                    {(selectedFile || audioBlob) && (
                        <div className="flex items-center justify-between px-4 pt-3 pb-1 border-b border-border/50">
                            <div className="flex items-center gap-2 text-sm text-foreground truncate max-w-[90%]">
                                {selectedFile ? (
                                    <>
                                        <span className="text-muted-foreground">📎</span>
                                        <span className="truncate">{selectedFile.name}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-muted-foreground">🎤</span>
                                        <span className="truncate">Voice Note ({formatTime(recordingTime || 0)})</span>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={selectedFile ? handleRemoveFile : handleRemoveAudio}
                                className="p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                title="Remove file"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    {/* ------------------------------------ */}

                    {/* --- RECORDING ACTIVE INDICATOR --- */}
                    {isRecording && (
                        <div className="flex items-center gap-2 px-4 pt-3 pb-1 text-sm text-red-500 animate-pulse">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            Recording... {formatTime(recordingTime)}
                        </div>
                    )}
                    {/* ----------------------------------- */}

                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={e => {
                            setValue(e.target.value);
                            handleInput();
                        }}
                        onKeyDown={handleKey}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="Message Shrija AI..."
                        rows={1}
                        className="w-full bg-transparent px-4 pt-3.5 pb-1 text-sm text-foreground placeholder-muted-foreground resize-none outline-none"
                        style={{ minHeight: 44, maxHeight: 160 }}
                        disabled={disabled || isRecording}
                    />

                    <div className="flex items-center justify-between px-3 pb-2.5">
                        <div className="flex items-center gap-1">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={disabled}
                            />
                            <button
                                onClick={handleAttachClick}
                                title="Attach file"
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                            >
                                <Paperclip size={14} />
                            </button>

                            {/* --- CHANGED: Mic Button Logic --- */}
                            <button
                                onClick={toggleRecording}
                                title={isRecording ? "Stop recording" : "Voice input"}
                                className={`p-1.5 rounded-lg transition-all ${isRecording
                                        ? "text-red-500 bg-red-500/10 animate-pulse"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                    }`}
                            >
                                {isRecording ? <Square size={14} className="fill-current" /> : <Mic size={14} />}
                            </button>
                            {/* --------------------------------- */}
                        </div>
                        <div className="flex items-center gap-2">
                            {isGenerating && onStop && (
                                <button
                                    onClick={onStop}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all text-sm"
                                >
                                    <Square size={14} className="fill-current" />
                                    Stop
                                </button>
                            )}
                            <button
                                onClick={submit}
                                disabled={(!value.trim() && !selectedFile && !audioBlob) || disabled || isGenerating}
                                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${(value.trim() || selectedFile || audioBlob) && !disabled && !isGenerating
                                        ? "bg-foreground text-background hover:opacity-80"
                                        : "bg-secondary text-muted-foreground cursor-not-allowed"
                                    }`}
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>
                <p className="text-center text-[10px] text-muted-foreground mt-2">
                    Shrija AI can make mistakes. Review important information.
                </p>
            </div>
        </div>
    );
};