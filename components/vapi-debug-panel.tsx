"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { vapi } from "@/lib/vapi/sdk"

export function VapiDebugPanel() {
  const [diagnostics, setDiagnostics] = useState<any>({})
  const [isVisible, setIsVisible] = useState(false)

  const runDiagnostics = () => {
    const results = {
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: navigator.userAgent,
        isProduction: process.env.NODE_ENV === 'production',
        domain: window.location.hostname,
        protocol: window.location.protocol,
      },
      browser: {
        audioContextSupport: typeof window.AudioContext !== "undefined" || typeof window.webkitAudioContext !== "undefined",
        mediaDevicesSupport: !!navigator.mediaDevices,
        webSocketSupport: typeof WebSocket !== "undefined",
        webRTCSupport: !!window.RTCPeerConnection,
      },
      vapi: {
        publicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ? "✅ Set" : "❌ Missing",
        publicKeyValue: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "Not set",
        workflowId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID || "Not set",
        instance: !!vapi,
        methods: vapi ? Object.keys(vapi) : [],
      },
      audio: {
        audioContextState: vapi.audioContext?.state || "Unknown",
        audioPlaybackActive: vapi.isAudioPlaying || "Unknown",
      }
    }
    
    setDiagnostics(results)
  }

  const testMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log("🎤 Microphone test successful")
      stream.getTracks().forEach(track => track.stop())
      setDiagnostics(prev => ({
        ...prev,
        microphoneTest: "✅ Success"
      }))
    } catch (error) {
      console.error("🎤 Microphone test failed:", error)
      setDiagnostics(prev => ({
        ...prev,
        microphoneTest: `❌ Failed: ${error.message}`
      }))
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  if (!isVisible) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        🔧 Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 overflow-y-auto z-50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex justify-between items-center">
          Vapi.ai Debug Panel
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {/* Environment */}
        <div>
          <h4 className="font-medium mb-1">Environment</h4>
          <div className="space-y-1">
            <div>Domain: {diagnostics.environment?.domain}</div>
            <div>Protocol: {diagnostics.environment?.protocol}</div>
            <div>Production: {diagnostics.environment?.isProduction ? "Yes" : "No"}</div>
          </div>
        </div>

        {/* Browser Support */}
        <div>
          <h4 className="font-medium mb-1">Browser Support</h4>
          <div className="space-y-1">
            <div>Audio Context: {diagnostics.browser?.audioContextSupport ? "✅" : "❌"}</div>
            <div>Media Devices: {diagnostics.browser?.mediaDevicesSupport ? "✅" : "❌"}</div>
            <div>WebSocket: {diagnostics.browser?.webSocketSupport ? "✅" : "❌"}</div>
            <div>WebRTC: {diagnostics.browser?.webRTCSupport ? "✅" : "❌"}</div>
          </div>
        </div>

        {/* Vapi Configuration */}
        <div>
          <h4 className="font-medium mb-1">Vapi Configuration</h4>
          <div className="space-y-1">
            <div>Public Key: <Badge variant={diagnostics.vapi?.publicKey?.includes("✅") ? "default" : "destructive"}>{diagnostics.vapi?.publicKey}</Badge></div>
            {diagnostics.vapi?.publicKeyValue && (
              <div className="text-xs text-muted-foreground break-all">
                Key: {diagnostics.vapi.publicKeyValue.substring(0, 20)}...
              </div>
            )}
            <div>Instance: {diagnostics.vapi?.instance ? "✅" : "❌"}</div>
            <div>Methods: {diagnostics.vapi?.methods?.length || 0}</div>
          </div>
        </div>

        {/* Audio Status */}
        <div>
          <h4 className="font-medium mb-1">Audio Status</h4>
          <div className="space-y-1">
            <div>Context State: {diagnostics.audio?.audioContextState}</div>
            <div>Playback Active: {diagnostics.audio?.audioPlaybackActive}</div>
            {diagnostics.microphoneTest && (
              <div>Microphone: {diagnostics.microphoneTest}</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" onClick={runDiagnostics}>
            Refresh
          </Button>
          <Button size="sm" onClick={testMicrophone}>
            Test Mic
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date(diagnostics.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}