"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Download, Share } from "lucide-react"

interface ProjectReviewProps {
  feedback: {
    technical: string[]
    clientReady: string[]
  } | null
}

export function ProjectReview({ feedback }: ProjectReviewProps) {
  const [activeTab, setActiveTab] = useState("technical")

  if (!feedback) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Project Review</CardTitle>
          <CardDescription>No feedback available yet</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">Feedback Pending</h3>
            <p className="text-muted-foreground">
              Your project is still being reviewed. Check back later for feedback.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Project Review</CardTitle>
            <CardDescription>AI-generated feedback on your submission</CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Reviewed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="technical">Technical Feedback</TabsTrigger>
            <TabsTrigger value="client">Client-Ready Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="technical" className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Technical Assessment</h3>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                This feedback focuses on technical aspects of your work, highlighting areas for improvement and
                technical excellence.
              </p>
            </div>

            <div className="space-y-3">
              {feedback.technical.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start">
                    {index < 2 ? (
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-3 text-amber-500 mt-0.5" />
                    )}
                    <p>{item}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="font-medium mb-2">Recommended Resources</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded mr-2">•</span>
                  <span>Module 3: "Advanced SEO Techniques for Content Writers"</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded mr-2">•</span>
                  <span>Article: "Writing Effective Calls-to-Action for Tourism Websites"</span>
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="client" className="space-y-4">
            <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
              <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Client-Ready Assessment</h3>
              <p className="text-green-700 dark:text-green-400 text-sm">
                This feedback is formatted in a way that can be shared directly with clients, focusing on the strengths
                of your work.
              </p>
            </div>

            <div className="space-y-3">
              {feedback.clientReady.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-500 mt-0.5" />
                    <p>{item}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="font-medium mb-2">Client Presentation Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded mr-2">•</span>
                  <span>Highlight the cultural authenticity of your content</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded mr-2">•</span>
                  <span>Emphasize how your content addresses the target audience's needs</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Feedback
          </Button>
          <Button className="flex-1">
            <Share className="h-4 w-4 mr-2" />
            Share with Client
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
