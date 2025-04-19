import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Mail, MessageSquare, Youtube, Twitter, Brain, FileText, Code2, Bot } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90">
      {/* Background gradient elements */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>

      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">MultiAgent AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/chat">
            <Button variant="outline">Go to Chat</Button>
          </Link>
          <Button>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4">AI-Powered Productivity</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Your Intelligent Multi-Agent Workspace</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Access multiple AI agents specialized in different tasks - from coding assistance to email management, all
            in one platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/chat">
              <Button size="lg" className="gap-2">
                Start Using AI <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Our AI Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* DevGenius Agent */}
          <Card className="glass-panel hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  Active
                </Badge>
                <Code2 className="h-8 w-8 text-blue-500" />
              </div>
              <CardTitle className="mt-4">DevGenius</CardTitle>
              <CardDescription>Coding assistant and developer productivity tool</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get help with coding, debugging, and learning new programming concepts. DevGenius can explain code,
                suggest improvements, and help you solve complex problems.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/chat" className="w-full">
                <Button className="w-full gap-2">
                  Chat with DevGenius <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* EmailMaster Agent */}
          <Card className="glass-panel hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Coming Soon
                </Badge>
                <Mail className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="mt-4">EmailMaster</CardTitle>
              <CardDescription>Email management and communication assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Summarize emails, draft responses, categorize messages, and manage your inbox efficiently. EmailMaster
                helps you stay on top of your communication.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardFooter>
          </Card>

          {/* ContentGenius Agent */}
          <Card className="glass-panel hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                  Coming Soon
                </Badge>
                <Youtube className="h-8 w-8 text-purple-500" />
              </div>
              <CardTitle className="mt-4">ContentGenius</CardTitle>
              <CardDescription>Social media and content creation assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get summaries of YouTube videos, analyze social media trends, and generate content ideas. ContentGenius
                helps you stay informed and creative.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardFooter>
          </Card>

          {/* ScheduleMaster Agent */}
          <Card className="glass-panel hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                  Coming Soon
                </Badge>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
              <CardTitle className="mt-4">ScheduleMaster</CardTitle>
              <CardDescription>Calendar and planning assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage your calendar, schedule meetings, and plan your day efficiently. ScheduleMaster helps you
                optimize your time and stay organized.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardFooter>
          </Card>

          {/* SocialInsight Agent */}
          <Card className="glass-panel hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500/20">
                  Coming Soon
                </Badge>
                <Twitter className="h-8 w-8 text-pink-500" />
              </div>
              <CardTitle className="mt-4">SocialInsight</CardTitle>
              <CardDescription>Social media analytics and engagement assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analyze social media trends, track engagement, and get content recommendations. SocialInsight helps you
                grow your online presence.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardFooter>
          </Card>

          {/* DocumentAI Agent */}
          <Card className="glass-panel hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20">
                  Coming Soon
                </Badge>
                <FileText className="h-8 w-8 text-cyan-500" />
              </div>
              <CardTitle className="mt-4">DocumentAI</CardTitle>
              <CardDescription>Document analysis and summarization assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analyze and summarize documents, extract key information, and generate insights. DocumentAI helps you
                process information efficiently.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-4 bg-muted/30 rounded-xl backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-12 text-center">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multiple Specialized Agents</h3>
            <p className="text-muted-foreground">
              Access different AI agents specialized in various domains, from coding to content creation.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Conversations</h3>
            <p className="text-muted-foreground">
              Engage in natural conversations with AI agents to get help, advice, and insights.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Code Editor Integration</h3>
            <p className="text-muted-foreground">
              Edit, run, and share code directly within the platform with syntax highlighting.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Boost Your Productivity?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start using our AI agents today and transform the way you work.
          </p>
          <Link href="/chat">
            <Button size="lg" className="gap-2">
              Get Started Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto py-8 px-4 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-semibold">MultiAgent AI</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MultiAgent AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
