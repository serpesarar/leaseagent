'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Camera, 
  X, 
  RotateCcw, 
  Download, 
  Upload, 
  Image as ImageIcon,
  Trash2,
  ZoomIn,
  ZoomOut,
  FlashOff,
  Flash
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TouchButton } from './touch-optimized-ui'

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onClose: () => void
  maxPhotos?: number
  quality?: number
}

export function CameraCapture({ 
  onCapture, 
  onClose, 
  maxPhotos = 5,
  quality = 0.8 
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [hasFlash, setHasFlash] = useState(false)
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off')
  const [zoom, setZoom] = useState(1)
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device')
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsActive(true)

        // Check for flash capability
        const track = stream.getVideoTracks()[0]
        const capabilities = track.getCapabilities()
        setHasFlash(!!capabilities.torch)
      }
    } catch (err) {
      console.error('Camera access error:', err)
      setError(err instanceof Error ? err.message : 'Failed to access camera')
    }
  }, [facingMode])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsActive(false)
  }, [])

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Apply flash effect if enabled
    if (flashMode === 'on' && hasFlash) {
      try {
        const track = streamRef.current?.getVideoTracks()[0]
        if (track) {
          await track.applyConstraints({
            advanced: [{ torch: true } as any]
          })
          
          // Flash for 100ms
          setTimeout(async () => {
            await track.applyConstraints({
              advanced: [{ torch: false } as any]
            })
          }, 100)
        }
      } catch (err) {
        console.warn('Flash not supported:', err)
      }
    }

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to blob and create file
    canvas.toBlob(async (blob) => {
      if (blob && capturedPhotos.length < maxPhotos) {
        const file = new File([blob], `photo-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        })

        // Create preview URL
        const previewUrl = URL.createObjectURL(blob)
        setCapturedPhotos(prev => [...prev, previewUrl])

        // Trigger haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(50)
        }

        onCapture(file)
      }
    }, 'image/jpeg', quality)
  }, [flashMode, hasFlash, quality, capturedPhotos.length, maxPhotos, onCapture])

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
    stopCamera()
    setTimeout(startCamera, 100)
  }, [startCamera, stopCamera])

  const toggleFlash = useCallback(() => {
    setFlashMode(prev => prev === 'off' ? 'on' : 'off')
  }, [])

  const adjustZoom = useCallback((direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? Math.min(prev + 0.5, 3) : Math.max(prev - 0.5, 1)
      
      // Apply zoom to video track
      if (streamRef.current) {
        const track = streamRef.current.getVideoTracks()[0]
        const capabilities = track.getCapabilities()
        
        if (capabilities.zoom) {
          track.applyConstraints({
            advanced: [{ zoom: newZoom } as any]
          }).catch(console.warn)
        }
      }
      
      return newZoom
    })
  }, [])

  const removePhoto = useCallback((index: number) => {
    setCapturedPhotos(prev => {
      const newPhotos = [...prev]
      URL.revokeObjectURL(newPhotos[index]) // Clean up memory
      newPhotos.splice(index, 1)
      return newPhotos
    })
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
      // Clean up preview URLs
      capturedPhotos.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Camera View */}
      <div className="relative w-full h-full">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <Card className="m-4">
              <CardHeader>
                <CardTitle className="text-red-600">Camera Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{error}</p>
                <div className="space-y-2">
                  <TouchButton onClick={startCamera} className="w-full">
                    Try Again
                  </TouchButton>
                  <TouchButton onClick={onClose} variant="outline" className="w-full">
                    Cancel
                  </TouchButton>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Video Stream */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />

            {/* Hidden Canvas for Capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
              <div className="flex items-center justify-between">
                <TouchButton
                  onClick={onClose}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-6 w-6" />
                </TouchButton>

                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    {capturedPhotos.length}/{maxPhotos}
                  </Badge>
                  {zoom > 1 && (
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      {zoom}x
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {hasFlash && (
                    <TouchButton
                      onClick={toggleFlash}
                      variant="ghost"
                      className={cn(
                        "text-white hover:bg-white/20",
                        flashMode === 'on' && "bg-yellow-500/20"
                      )}
                    >
                      {flashMode === 'on' ? (
                        <Flash className="h-5 w-5" />
                      ) : (
                        <FlashOff className="h-5 w-5" />
                      )}
                    </TouchButton>
                  )}
                </div>
              </div>
            </div>

            {/* Side Controls */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 space-y-4">
              <TouchButton
                onClick={switchCamera}
                variant="ghost"
                className="text-white hover:bg-white/20 w-12 h-12 p-0"
              >
                <RotateCcw className="h-5 w-5" />
              </TouchButton>

              <TouchButton
                onClick={() => adjustZoom('in')}
                variant="ghost"
                className="text-white hover:bg-white/20 w-12 h-12 p-0"
                disabled={zoom >= 3}
              >
                <ZoomIn className="h-5 w-5" />
              </TouchButton>

              <TouchButton
                onClick={() => adjustZoom('out')}
                variant="ghost"
                className="text-white hover:bg-white/20 w-12 h-12 p-0"
                disabled={zoom <= 1}
              >
                <ZoomOut className="h-5 w-5" />
              </TouchButton>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
              {/* Photo Thumbnails */}
              {capturedPhotos.length > 0 && (
                <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                  {capturedPhotos.map((photo, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      <img
                        src={photo}
                        alt={`Captured photo ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-white"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Capture Button */}
              <div className="flex items-center justify-center">
                <TouchButton
                  onClick={capturePhoto}
                  disabled={!isActive || capturedPhotos.length >= maxPhotos}
                  className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                >
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-400" />
                </TouchButton>
              </div>

              {/* Instructions */}
              <div className="text-center mt-4">
                <p className="text-white text-sm">
                  {capturedPhotos.length === 0 
                    ? "Tap to capture photo" 
                    : `${capturedPhotos.length} photo${capturedPhotos.length !== 1 ? 's' : ''} captured`
                  }
                </p>
                {capturedPhotos.length >= maxPhotos && (
                  <p className="text-yellow-400 text-xs mt-1">
                    Maximum photos reached
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// File upload component with camera option
interface PhotoUploadProps {
  onPhotosSelected: (files: File[]) => void
  maxPhotos?: number
  existingPhotos?: string[]
  className?: string
}

export function PhotoUpload({ 
  onPhotosSelected, 
  maxPhotos = 5, 
  existingPhotos = [],
  className 
}: PhotoUploadProps) {
  const [showCamera, setShowCamera] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCameraCapture = useCallback((file: File) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev, file]
      onPhotosSelected(newFiles)
      return newFiles
    })
  }, [onPhotosSelected])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newFiles = [...selectedFiles, ...files].slice(0, maxPhotos)
    setSelectedFiles(newFiles)
    onPhotosSelected(newFiles)
  }, [selectedFiles, maxPhotos, onPhotosSelected])

  const removeFile = useCallback((index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onPhotosSelected(newFiles)
  }, [selectedFiles, onPhotosSelected])

  const totalPhotos = existingPhotos.length + selectedFiles.length

  return (
    <div className={className}>
      {/* Photo Grid */}
      {(existingPhotos.length > 0 || selectedFiles.length > 0) && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {existingPhotos.map((photo, index) => (
            <div key={`existing-${index}`} className="relative aspect-square">
              <img
                src={photo}
                alt={`Existing photo ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <Badge className="absolute top-1 right-1 text-xs">
                Existing
              </Badge>
            </div>
          ))}
          {selectedFiles.map((file, index) => (
            <div key={`new-${index}`} className="relative aspect-square">
              <img
                src={URL.createObjectURL(file)}
                alt={`New photo ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Controls */}
      {totalPhotos < maxPhotos && (
        <div className="space-y-2">
          <TouchButton
            onClick={() => setShowCamera(true)}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Camera className="mr-2 h-5 w-5" />
            Take Photo
          </TouchButton>

          <TouchButton
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload from Gallery
          </TouchButton>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <p className="text-xs text-gray-500 text-center">
            {totalPhotos}/{maxPhotos} photos selected
          </p>
        </div>
      )}

      {/* Camera Component */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
          maxPhotos={maxPhotos - totalPhotos}
        />
      )}
    </div>
  )
}

