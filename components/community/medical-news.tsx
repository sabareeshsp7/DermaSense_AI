"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Newspaper, ExternalLink, Loader2, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { supportedLanguages, translateText } from "@/lib/translation"

// Mediastack API key
const MEDIASTACK_API_KEY = "7908d13d964b2f2cd7edc3344b90bc09"

interface NewsArticle {
  title: string
  description: string
  url: string
  image: string | null
  published_at: string
  source: string
  category: string
  language: string
}

export function MedicalNews() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [translatedArticle, setTranslatedArticle] = useState<Partial<NewsArticle> | null>(null)
  const [translationLanguage, setTranslationLanguage] = useState("en")
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)

      // Fetch news from Mediastack API
      const response = await fetch(
        `https://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&keywords=skin,dermatology,eczema,psoriasis&categories=health&languages=en&limit=10`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch news")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || "API Error")
      }

      // Transform the API response to match our NewsArticle interface
      const articles: NewsArticle[] = data.data.map((item: { 
        title?: string; 
        description?: string; 
        url?: string; 
        image?: string | null; 
        published_at?: string; 
        source?: string; 
        category?: string; 
        language?: string; 
      }) => ({
        title: item.title || "No title available",
        description: item.description || "No description available",
        url: item.url || "#",
        image: item.image || null,
        published_at: item.published_at || new Date().toISOString(),
        source: item.source || "Unknown source",
        category: item.category || "health",
        language: item.language || "en",
      }))

      setNews(articles)
      setError(null)
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error fetching news:", err.message)
      } else {
        console.error("Error fetching news:", err)
      }

      // Fallback to sample data if API fails
      const fallbackNews: NewsArticle[] = [
        {
          title: "New Treatment Shows Promise for Severe Eczema Patients",
          description:
            "A groundbreaking clinical trial has shown significant improvement in patients with severe eczema using a novel biologic therapy that targets specific inflammatory pathways. The study, published in the Journal of Dermatological Research, followed 250 patients over a two-year period and found that 78% experienced a reduction in symptoms of at least 75%.",
          url: "https://example.com/eczema-treatment",
          image: "/placeholder.svg?height=200&width=300",
          published_at: new Date().toISOString(),
          source: "Medical Journal Today",
          category: "health",
          language: "en",
        },
        {
          title: "Study Links Gut Microbiome to Psoriasis Severity",
          description:
            "Researchers have found a correlation between gut microbiome composition and psoriasis severity, suggesting potential new treatment approaches through dietary intervention. The study analyzed gut bacteria profiles from 150 psoriasis patients and compared them with healthy controls.",
          url: "https://example.com/psoriasis-study",
          image: "/placeholder.svg?height=200&width=300",
          published_at: new Date().toISOString(),
          source: "Dermatology Times",
          category: "health",
          language: "en",
        },
        {
          title: "Climate Change May Increase Skin Cancer Rates, Experts Warn",
          description:
            "Dermatologists are warning that rising temperatures and changing patterns of sun exposure due to climate change could lead to increased rates of skin cancer globally. A new report compiled by international skin cancer specialists projects a 10-15% increase in melanoma cases over the next decade if current climate trends continue.",
          url: "https://example.com/climate-skin-cancer",
          image: "/placeholder.svg?height=200&width=300",
          published_at: new Date().toISOString(),
          source: "Health Science News",
          category: "health",
          language: "en",
        },
      ]

      setNews(fallbackNews)
      setError("Could not fetch live news. Showing sample articles instead.")
    } finally {
      setLoading(false)
    }
  }

  const handleTranslate = async (language: string) => {
    if (!selectedArticle || language === "en") {
      setTranslatedArticle(null)
      setTranslationLanguage("en")
      return
    }

    try {
      setIsTranslating(true)
      setTranslationLanguage(language)

        // Translate title and description
        // const [translatedTitle, translatedDescription] = await Promise.all([
        //   translateText({
        //     source: "en",
        //     target: language,
        //     text: selectedArticle.title,
        //   }),
        //   translateText({
        //     source: "en",
        //     target: language,
        //     text: selectedArticle.description,
        //   }),
        // ])
      // Uncomment and fix the setTranslatedArticle call when translation logic is implemented
      // setTranslatedArticle({
      //   title: translatedTitle,
      //   description: translatedDescription,
      // })
    } catch (error) {
      console.error("Translation error:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Medical News
        </CardTitle>
        <CardDescription>Latest news and research on skin health</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-md bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error}
            <Button variant="outline" size="sm" className="mt-2" onClick={fetchNews}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {news.length === 0 ? (
              <p className="text-center text-muted-foreground">No news articles found</p>
            ) : (
              news.map((article, index) => (
                <div
                  key={index}
                  className="flex cursor-pointer gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50"
                  onClick={() => setSelectedArticle(article)}
                >
                  {article.image ? (
                    <img
                      src={article.image || "/placeholder.svg?height=80&width=80"}
                      alt={article.title}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                      <Newspaper className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {article.source} • {format(new Date(article.published_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={fetchNews} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Refresh News"
          )}
        </Button>
      </CardFooter>

      {/* Article Detail Dialog */}
      <Dialog
        open={!!selectedArticle}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedArticle(null)
            setTranslatedArticle(null)
            setTranslationLanguage("en")
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          {selectedArticle && (
            <>
              <DialogHeader>
                <DialogTitle>{translatedArticle?.title || selectedArticle.title}</DialogTitle>
                {/* Fix the hydration error by using a div instead of DialogDescription */}
                <div className="text-sm text-muted-foreground flex items-center justify-between">
                  <span>
                    {selectedArticle.source} • {format(new Date(selectedArticle.published_at), "MMMM d, yyyy")}
                  </span>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <Select value={translationLanguage} onValueChange={(value) => handleTranslate(value)}>
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      {/* <SelectContent>
                        {supportedLanguages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent> */}
                    </Select>
                  </div>
                </div>
              </DialogHeader>

              {selectedArticle.image && (
                <img
                  src={selectedArticle.image || "/placeholder.svg?height=300&width=600"}
                  alt={selectedArticle.title}
                  className="aspect-video w-full rounded-md object-cover max-h-[300px]"
                />
              )}

              <div className="space-y-4">
                {isTranslating ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Translating...</span>
                  </div>
                ) : (
                  <div className="text-sm leading-relaxed">
                    {/* Split description into paragraphs for better readability */}
                    {(translatedArticle?.description || selectedArticle.description)
                      .split(". ")
                      .reduce((acc: React.ReactNode[], sentence, i, arr) => {
                        // Group sentences into paragraphs (3-4 sentences per paragraph)
                        if (i % 3 === 0) {
                          const paragraph = arr.slice(i, i + 3).join(". ") + (i + 3 < arr.length ? "." : "")
                          acc.push(
                            <p key={i} className="mb-4">
                              {paragraph}
                            </p>,
                          )
                        }
                        return acc
                      }, [])}
                  </div>
                )}

                <Button className="w-full" variant="outline" onClick={() => window.open(selectedArticle.url, "_blank")}>
                  Read Full Article <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

