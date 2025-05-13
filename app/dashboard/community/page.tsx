"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  ArrowUp,
  AtSign,
  Eye,
  Filter,
  Heart,
  MessageCircle,
  MoreHorizontal,
  PenLine,
  Pin,
  Search,
  Share2,
  ThumbsUp,
  TrendingUpIcon as Trending,
  User,
  Newspaper,
  Microscope,
  Stethoscope,
  BookOpen,
  Calendar,
  ExternalLink,
} from "lucide-react"
import Avatar from "boring-avatars"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { SimpleEditor } from "@/components/editor/simple-editor"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Sample data for community posts
const samplePosts = [
  {
    id: 1,
    title: "My journey with Basal Cell Carcinoma treatment",
    content:
      "I was diagnosed with basal cell carcinoma last year and wanted to share my experience with the community. The early detection made all the difference in my treatment outcome...",
    author: {
      id: 101,
      name: "Sarah Johnson",
      avatar: null,
    },
    date: new Date(2023, 5, 15),
    likes: 42,
    likedBy: [102, 103, 104], // User IDs who liked this post
    comments: 8,
    isPinned: true,
    isTrending: true,
    isAnonymous: false,
    tags: ["basal-cell-carcinoma", "treatment", "early-detection"],
  },
  {
    id: 2,
    title: "Question about Squamous Cell Carcinoma medication side effects",
    content:
      "I've been prescribed a new medication for my squamous cell carcinoma. Has anyone experienced significant side effects? I'm particularly concerned about...",
    author: {
      id: 102,
      name: "Anonymous User",
      avatar: null,
    },
    date: new Date(2023, 6, 20),
    likes: 18,
    likedBy: [101, 105], // User IDs who liked this post
    comments: 15,
    isPinned: false,
    isTrending: true,
    isAnonymous: true,
    tags: ["squamous-cell-carcinoma", "medication", "side-effects"],
  },
  {
    id: 3,
    title: "Melanoma scarring - what worked for you?",
    content:
      "After my melanoma removal surgery, I've been dealing with significant scarring. I've tried various treatments with mixed results. I'd love to hear what worked for others...",
    author: {
      id: 103,
      name: "Michael Chen",
      avatar: null,
    },
    date: new Date(2023, 7, 5),
    likes: 35,
    likedBy: [101, 102, 104, 106], // User IDs who liked this post
    comments: 22,
    isPinned: false,
    isTrending: false,
    isAnonymous: false,
    tags: ["melanoma", "scarring", "post-surgery"],
  },
  {
    id: 4,
    title: "Oncologist recommendations in Mumbai?",
    content:
      "I recently moved to Mumbai and I'm looking for a good oncologist who specializes in skin cancer treatment. Any recommendations would be greatly appreciated!",
    author: {
      id: 104,
      name: "Priya Sharma",
      avatar: null,
    },
    date: new Date(2023, 7, 12),
    likes: 8,
    likedBy: [103], // User IDs who liked this post
    comments: 12,
    isPinned: false,
    isTrending: false,
    isAnonymous: false,
    tags: ["oncologist", "mumbai", "recommendations"],
  },
  {
    id: 5,
    title: "My experience with immunotherapy for advanced melanoma",
    content:
      "I was diagnosed with stage III melanoma last year and have been undergoing immunotherapy. The journey has been challenging but with some positive results. I wanted to share my experience and some coping strategies that helped me...",
    author: {
      id: 105,
      name: "Anonymous User",
      avatar: null,
    },
    date: new Date(2023, 7, 18),
    likes: 27,
    likedBy: [101, 102, 103, 104], // User IDs who liked this post
    comments: 6,
    isPinned: false,
    isTrending: false,
    isAnonymous: true,
    tags: ["melanoma", "immunotherapy", "treatment"],
  },
]

// Sample comments
const sampleComments = [
  {
    id: 101,
    postId: 1,
    author: {
      id: 106,
      name: "David Wilson",
      avatar: null,
    },
    content:
      "Thank you for sharing your experience! Early detection is indeed crucial. Did you notice any particular symptoms that prompted you to get checked?",
    date: new Date(2023, 5, 16),
    likes: 5,
    likedBy: [101, 103], // User IDs who liked this comment
    isAnonymous: false,
  },
  {
    id: 102,
    postId: 1,
    author: {
      id: 107,
      name: "Anonymous User",
      avatar: null,
    },
    content:
      "I'm about to start my treatment next week. Your post gives me hope. Did you experience any side effects from the treatment?",
    date: new Date(2023, 5, 17),
    likes: 3,
    likedBy: [101], // User IDs who liked this comment
    isAnonymous: true,
  },
]

// Sample news articles
const sampleNewsArticles = [
  {
    id: 1,
    title: "New Immunotherapy Breakthrough for Advanced Melanoma",
    description:
      "A groundbreaking clinical trial has shown significant improvement in patients with advanced melanoma using a novel combination immunotherapy approach. The study, published in the Journal of Clinical Oncology, followed 300 patients over a three-year period and found that 65% experienced a reduction in tumor size of at least 50%. This new approach combines traditional checkpoint inhibitors with targeted therapies to enhance the immune system's ability to recognize and attack cancer cells. Researchers are optimistic that this treatment protocol could become a new standard of care for patients with stage III and IV melanoma.",
    url: "https://example.com/melanoma-breakthrough",
    image: "/placeholder.svg?height=200&width=300",
    published_at: new Date(2023, 8, 15).toISOString(),
    source: "Journal of Clinical Oncology",
    category: "research",
  },
  {
    id: 2,
    title: "AI Tool Developed to Improve Early Detection of Skin Cancer",
    description:
      "Researchers at Stanford University have developed a new artificial intelligence system that can detect skin cancer with greater accuracy than dermatologists. The AI model was trained on over 150,000 skin lesion images and can identify melanoma, basal cell carcinoma, and squamous cell carcinoma with 95% accuracy. In validation studies against board-certified dermatologists, the AI outperformed human experts in both sensitivity and specificity. The technology is being developed as a smartphone application that could allow patients to perform preliminary screenings at home, potentially leading to earlier detection and improved survival rates.",
    url: "https://example.com/ai-skin-cancer",
    image: "/placeholder.svg?height=200&width=300",
    published_at: new Date(2023, 8, 10).toISOString(),
    source: "Digital Health Technology",
    category: "technology",
  },
  {
    id: 3,
    title: "UV Exposure in Childhood Linked to Higher Skin Cancer Risk",
    description:
      "A long-term epidemiological study has found that excessive sun exposure during childhood significantly increases the risk of developing skin cancer later in life. The research, which followed over 10,000 individuals from childhood to adulthood over 30 years, found that those who experienced five or more severe sunburns before age 15 had a threefold increased risk of melanoma compared to those who never experienced severe sunburns. The study emphasizes the importance of sun protection measures for children, including regular sunscreen use, protective clothing, and limiting outdoor activities during peak UV hours. Public health experts are calling for enhanced education programs targeting parents and schools.",
    url: "https://example.com/childhood-uv-exposure",
    image: "/placeholder.svg?height=200&width=300",
    published_at: new Date(2023, 7, 28).toISOString(),
    source: "Preventive Medicine Journal",
    category: "research",
  },
  {
    id: 4,
    title: "New Topical Treatment Shows Promise for Actinic Keratosis",
    description:
      "A novel topical treatment has shown promising results in treating actinic keratosis, a precancerous skin condition that can develop into squamous cell carcinoma. The treatment, which combines a photosensitizing agent with a specialized light therapy, demonstrated a 90% clearance rate in clinical trials involving 500 patients. Unlike current treatments that often cause significant irritation and discomfort, this new approach resulted in minimal side effects and required fewer applications. Dermatologists are optimistic that this treatment could provide a more effective and patient-friendly option for managing actinic keratosis and preventing its progression to invasive skin cancer.",
    url: "https://example.com/actinic-keratosis-treatment",
    image: "/placeholder.svg?height=200&width=300",
    published_at: new Date(2023, 7, 20).toISOString(),
    source: "Dermatology Therapeutics",
    category: "treatment",
  },
  {
    id: 5,
    title: "Genetic Testing Improves Risk Assessment for Melanoma Patients",
    description:
      "A comprehensive genetic testing panel has been developed that can more accurately predict melanoma recurrence risk and guide treatment decisions. The test analyzes 31 genes associated with melanoma progression and metastasis, providing oncologists with valuable information about which patients might benefit from more aggressive treatment approaches. In a validation study of 450 melanoma patients, the genetic test correctly identified high-risk individuals with 85% accuracy, significantly outperforming traditional staging methods alone. This personalized medicine approach could help avoid unnecessary treatments for low-risk patients while ensuring those at higher risk receive appropriate interventions.",
    url: "https://example.com/melanoma-genetic-testing",
    image: "/placeholder.svg?height=200&width=300",
    published_at: new Date(2023, 7, 15).toISOString(),
    source: "Precision Oncology",
    category: "diagnosis",
  },
]

export default function CommunityPage() {
  const [posts, setPosts] = useState(samplePosts)
  const [comments, setComments] = useState(sampleComments)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [newCommentContent, setNewCommentContent] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  // Define type for news article
  type NewsArticle = {
    id: number;
    title: string;
    description: string;
    url: string;
    image: string;
    published_at: string;
    source: string;
    category: string;
  }
  
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [news] = useState(sampleNewsArticles)

  // Current user ID (simulated)
  const currentUserId = 101

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter posts based on search query and active tab
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "trending") return matchesSearch && post.isTrending
    if (activeTab === "pinned") return matchesSearch && post.isPinned
    if (activeTab === "my-posts") return matchesSearch && post.author.id === currentUserId

    return matchesSearch
  })

  // Sort posts: pinned first, then by date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.date.getTime() - a.date.getTime()
  })

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both a title and content for your post.",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newPost = {
        id: posts.length + 1,
        title: newPostTitle,
        content: newPostContent,
        author: {
          id: currentUserId, // Current user id
          name: isAnonymous ? "Anonymous User" : "Current User",
          avatar: null,
        },
        date: new Date(),
        likes: 0,
        likedBy: [], // Initialize empty array of users who liked
        comments: 0,
        isPinned: false,
        isTrending: false,
        isAnonymous,
        tags: extractTags(newPostContent),
      }

      setPosts([newPost, ...posts])
      setNewPostTitle("")
      setNewPostContent("")
      setIsAnonymous(false)
      setIsSubmitting(false)

      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      })
    }, 1000)
  }

  const handleAddComment = (postId: number) => {
    if (!newCommentContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide content for your comment.",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newComment = {
        id: comments.length + 1,
        postId,
        author: {
          id: currentUserId, // Current user id
          name: isAnonymous ? "Anonymous User" : "Current User",
          avatar: null,
        },
        content: newCommentContent,
        date: new Date(),
        likes: 0,
        likedBy: [], // Initialize empty array of users who liked
        isAnonymous,
      }

      setComments([...comments, newComment])
      setNewCommentContent("")

      // Update comment count on post
      setPosts(posts.map((post) => (post.id === postId ? { ...post, comments: post.comments + 1 } : post)))

      setIsSubmitting(false)

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })
    }, 500)
  }

  const handleLikePost = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          // Check if user already liked this post
          const alreadyLiked = post.likedBy.includes(currentUserId)

          if (alreadyLiked) {
            // Unlike: remove user from likedBy and decrease count
            return {
              ...post,
              likes: post.likes - 1,
              likedBy: post.likedBy.filter((id) => id !== currentUserId),
            }
          } else {
            // Like: add user to likedBy and increase count
            return {
              ...post,
              likes: post.likes + 1,
              likedBy: [...post.likedBy, currentUserId],
            }
          }
        }
        return post
      }),
    )

    toast({
      title: "Post interaction",
      description: posts.find((p) => p.id === postId)?.likedBy.includes(currentUserId)
        ? "You unliked this post."
        : "You liked this post.",
    })
  }

  const handleLikeComment = (commentId: number) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          // Check if user already liked this comment
          const alreadyLiked = comment.likedBy.includes(currentUserId)

          if (alreadyLiked) {
            // Unlike: remove user from likedBy and decrease count
            return {
              ...comment,
              likes: comment.likes - 1,
              likedBy: comment.likedBy.filter((id) => id !== currentUserId),
            }
          } else {
            // Like: add user to likedBy and increase count
            return {
              ...comment,
              likes: comment.likes + 1,
              likedBy: [...comment.likedBy, currentUserId],
            }
          }
        }
        return comment
      }),
    )

    toast({
      title: "Comment interaction",
      description: comments.find((c) => c.id === commentId)?.likedBy.includes(currentUserId)
        ? "You unliked this comment."
        : "You liked this comment.",
    })
  }

  const handleSharePost = (postId: number) => {
    const post = posts.find((p) => p.id === postId)
    if (!post) return

    const shareText = `Check out this post on Carcino AI Community: "${post.title}"`
    const shareUrl = `${window.location.origin}/dashboard/community?post=${postId}`

    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: shareText,
          url: shareUrl,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
        })
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      toast({
        title: "Link copied",
        description: "Post link copied to clipboard.",
      })
    }
  }

  const handleReportPost = (postId: number) => {
    toast({
      title: "Post reported",
      description: `Thank you for reporting post #${postId}. Our moderators will review it.`,
    })
  }

  const handleReportComment = (commentId: number) => {
    toast({
      title: "Comment reported",
      description: `Thank you for reporting comment #${commentId}. Our moderators will review it.`,
    })
  }

  // Extract hashtags from content
  const extractTags = (content: string) => {
    const hashtagRegex = /#(\w+)/g
    const matches = content.match(hashtagRegex)

    if (!matches) return []

    return matches.map((tag) => tag.substring(1))
  }

  // Format content to highlight hashtags
  const formatContent = (content: string) => {
    return content.replace(/#(\w+)/g, '<span class="text-blue-500">#$1</span>')
  }

  // Get post comments
  const getPostComments = (postId: number) => {
    return comments.filter((comment) => comment.postId === postId)
  }

  // Check if current user has liked a post
  const hasLikedPost = (postId: number) => {
    const post = posts.find((p) => p.id === postId)
    return post ? post.likedBy.includes(currentUserId) : false
  }

  // Check if current user has liked a comment
  const hasLikedComment = (commentId: number) => {
    const comment = comments.find((c) => c.id === commentId)
    return comment ? comment.likedBy.includes(currentUserId) : false
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Carcino AI Community</h1>
        <p className="text-muted-foreground">
          Connect with others, share experiences, and learn from the skin cancer community
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="flex w-full space-x-4 overflow-x-auto p-0">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-1">
                <Trending className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="pinned" className="flex items-center gap-1">
                <Pin className="h-4 w-4" />
                Pinned
              </TabsTrigger>
              <TabsTrigger value="my-posts" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                My Posts
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Posts */}
          <div className="space-y-4">
            {sortedPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <Search className="h-8 w-8 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No posts found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try a different search term or clear your filters"
                    : "Be the first to create a post in this community"}
                </p>
              </div>
            ) : (
              sortedPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={post.isPinned ? "border-primary" : ""}>
                    <CardHeader className="relative pb-2">
                      {post.isPinned && (
                        <div className="absolute right-6 top-6 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                          <Pin className="mr-1 inline-block h-3 w-3" />
                          Pinned
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        {post.isAnonymous ? (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                            <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                          </div>
                        ) : (
                          <Avatar
                            size={40}
                            name={post.author.name}
                            variant="beam"
                            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                          />
                        )}
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <CardDescription>
                            {post.isAnonymous ? (
                              <span className="flex items-center gap-1">
                                <AtSign className="h-3 w-3" />
                                Anonymous
                              </span>
                            ) : (
                              post.author.name
                            )}{" "}
                            • {format(post.date, "MMM d, yyyy")}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                      />
                      {post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="flex gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex items-center gap-1 ${hasLikedPost(post.id) ? "text-blue-500" : "text-muted-foreground"}`}
                          onClick={() => handleLikePost(post.id)}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          {post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 text-muted-foreground"
                          onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          {post.comments}
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => handleSharePost(post.id)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleReportPost(post.id)}>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardFooter>

                    {/* Comments Section */}
                    {selectedPost === post.id && (
                      <div className="border-t px-6 py-4">
                        <h4 className="mb-4 font-medium">Comments</h4>
                        <div className="space-y-4">
                          {getPostComments(post.id).length === 0 ? (
                            <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
                          ) : (
                            getPostComments(post.id).map((comment) => (
                              <div key={comment.id} className="rounded-lg bg-secondary/50 p-3">
                                <div className="flex items-center gap-2">
                                  {comment.isAnonymous ? (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                      <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                  ) : (
                                    <Avatar
                                      size={32}
                                      name={comment.author.name}
                                      variant="beam"
                                      colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                                    />
                                  )}
                                  <div>
                                    <p className="text-sm font-medium">
                                      {comment.isAnonymous ? "Anonymous" : comment.author.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {format(comment.date, "MMM d, yyyy")}
                                    </p>
                                  </div>
                                </div>
                                <p className="mt-2 text-sm">{comment.content}</p>
                                <div className="mt-2 flex justify-between">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`flex items-center gap-1 text-xs ${hasLikedComment(comment.id) ? "text-blue-500" : "text-muted-foreground"}`}
                                    onClick={() => handleLikeComment(comment.id)}
                                  >
                                    <Heart className="h-3 w-3" />
                                    {comment.likes}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-muted-foreground"
                                    onClick={() => handleReportComment(comment.id)}
                                  >
                                    <AlertTriangle className="h-3 w-3" />
                                    Report
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}

                          {/* Add Comment Form */}
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <Avatar
                                size={32}
                                name="Current User"
                                variant="beam"
                                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                              />
                              <p className="text-sm font-medium">{isAnonymous ? "Anonymous" : "Current User"}</p>
                            </div>
                            <Textarea
                              placeholder="Write a comment..."
                              value={newCommentContent}
                              onChange={(e) => setNewCommentContent(e.target.value)}
                              rows={2}
                            />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Switch id="anonymous-comment" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                                <Label htmlFor="anonymous-comment" className="text-sm">
                                  Post anonymously
                                </Label>
                              </div>
                              <Button size="sm" onClick={() => handleAddComment(post.id)} disabled={isSubmitting}>
                                {isSubmitting ? "Posting..." : "Post Comment"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Medical News Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Newspaper className="h-6 w-6" />
              Skin Cancer Research & News
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {news.map((article) => (
                <Card key={article.id} className="overflow-hidden flex flex-col">
                  <div className="aspect-video w-full overflow-hidden h-[180px]">
                    {article.image ? (
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <Newspaper className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-2 text-lg hover:text-primary">
                      <button onClick={() => setSelectedArticle(article)}>{article.title}</button>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(article.published_at), "MMM d, yyyy")}
                      <span className="mx-1">•</span>
                      {article.source}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-1">
                    <p className="line-clamp-3 text-sm text-muted-foreground">{article.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 mt-auto">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedArticle(article)}>
                      Read More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Community Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Be respectful and supportive of others</p>
              <p>• Do not share personal medical information that could identify you</p>
              <p>• Avoid medical advice that contradicts professional guidance</p>
              <p>• Report inappropriate content</p>
              <p>• Use #hashtags to categorize your posts</p>
              <p>• Remember that shared experiences are not medical advice</p>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trending className="h-5 w-5" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  "melanoma",
                  "basal-cell-carcinoma",
                  "squamous-cell-carcinoma",
                  "immunotherapy",
                  "mohs-surgery",
                  "early-detection",
                  "sun-protection",
                  "treatment-options",
                  "clinical-trials",
                  "support-groups",
                ].map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setSearchQuery(tag)}
                  >
                    #{tag}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Create Post */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenLine className="h-5 w-5" />
                Create Post
              </CardTitle>
              <CardDescription>Share your thoughts with the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="post-title">Title</Label>
                <Input
                  id="post-title"
                  placeholder="Enter a title for your post"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-content">Content</Label>
                {mounted && (
                  <SimpleEditor
                    value={newPostContent}
                    onChange={setNewPostContent}
                    placeholder="Write your post here... Use #hashtags for topics"
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch id="anonymous-post" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                <Label htmlFor="anonymous-post">Post anonymously</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCreatePost} disabled={isSubmitting}>
                {isSubmitting ? "Creating Post..." : "Create Post"}
              </Button>
            </CardFooter>
          </Card>

          {/* Active Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Active Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Sarah Johnson", "Michael Chen", "Priya Sharma", "David Wilson", "Emma Thompson"].map(
                  (name, index) => (
                    <div key={name} className="flex items-center gap-2">
                      <Avatar
                        size={32}
                        name={name}
                        variant="beam"
                        colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                      />
                      <div>
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-xs text-muted-foreground">
                          {["Oncologist", "Survivor", "Patient", "Caregiver", "Researcher"][index]}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        <ArrowUp className="h-4 w-4" />
                        Follow
                      </Button>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Skin Cancer Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Early Detection Guide</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Learn the ABCDE method for identifying suspicious moles
                </p>
                <Button variant="link" size="sm" className="mt-1 h-auto p-0">
                  Learn more
                </Button>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Treatment Options</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Comprehensive guide to skin cancer treatments</p>
                <Button variant="link" size="sm" className="mt-1 h-auto p-0">
                  Learn more
                </Button>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Clinical Trials</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Find ongoing clinical trials for skin cancer treatments
                </p>
                <Button variant="link" size="sm" className="mt-1 h-auto p-0">
                  Find trials
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Article Detail Dialog */}
      <Dialog
        open={!!selectedArticle}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedArticle(null)
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          {selectedArticle && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedArticle.title}</DialogTitle>
                <div className="text-sm text-muted-foreground flex items-center justify-between">
                  <span>
                    {selectedArticle.source} • {format(new Date(selectedArticle.published_at), "MMMM d, yyyy")}
                  </span>
                </div>
              </DialogHeader>

              {selectedArticle.image && (
                <div className="max-h-[300px] overflow-hidden rounded-md">
                  <img
                    src={selectedArticle.image || "/placeholder.svg"}
                    alt={selectedArticle.title}
                    className="w-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="text-sm leading-relaxed">
                  {/* Split description into paragraphs for better readability */}
                  {selectedArticle.description.split(". ").reduce((acc: React.ReactNode[], sentence, i, arr) => {
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

                <Button className="w-full" variant="outline" onClick={() => window.open(selectedArticle.url, "_blank")}>
                  Read Full Article <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

