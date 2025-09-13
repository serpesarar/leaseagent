import { WifiOff, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="h-6 w-6 text-gray-600" />
          </div>
          <CardTitle>You're Offline</CardTitle>
          <CardDescription>
            No internet connection detected. Some features may be limited.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p className="mb-2">While offline, you can still:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>View cached property data</li>
              <li>Browse maintenance requests</li>
              <li>Access tenant information</li>
              <li>View payment history</li>
            </ul>
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="mb-2">When you're back online:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Data will sync automatically</li>
              <li>Pending actions will be processed</li>
              <li>Real-time features will resume</li>
            </ul>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={() => window.location.reload()} 
              className="flex-1"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

