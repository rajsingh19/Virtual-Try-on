// COMMENTED OUT - Comments feature temporarily disabled
/*
"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { submitComment, getComments, deleteComment, type Comment } from "@/lib/firebase/userActivity";
import { toast } from "react-hot-toast";

interface CommentsSectionProps {
  productId?: number | null;
  productName?: string | null;
}

export default function CommentsSection({ productId = null, productName = null }: CommentsSectionProps) {
  const { user, userProfile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [productId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const fetchedComments = await getComments(productId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to post a comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const userName = userProfile 
        ? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() || user.email?.split("@")[0] || "User"
        : user.email?.split("@")[0] || "User";

      await submitComment(
        user.uid,
        userName,
        user.email || "",
        {
          comment: newComment.trim(),
          productId: productId || null,
          productName: productName || null,
        }
      );

      toast.success("Comment posted successfully!");
      setNewComment("");
      await loadComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string, commentUserId: string) => {
    if (!user) return;
    
    if (user.uid !== commentUserId) {
      toast.error("You can only delete your own comments");
      return;
    }

    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setDeletingId(commentId);
    try {
      await deleteComment(commentId);
      toast.success("Comment deleted successfully!");
      await loadComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Just now";
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      
      return date.toLocaleDateString();
    } catch {
      return "Just now";
    }
  };

  return (
    <div className="w-full bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Post Comment
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center text-gray-600">
          <p>Please login to post a comment</p>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">
                      {comment.userName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.timestamp)}
                    </span>
                    {comment.productName && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {comment.productName}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.comment}
                  </p>
                </div>
                {user && user.uid === comment.userId && (
                  <button
                    onClick={() => handleDelete(comment.id, comment.userId)}
                    disabled={deletingId === comment.id}
                    className="p-1 text-gray-400 hover:text-red-500 transition disabled:opacity-50"
                    title="Delete comment"
                  >
                    {deletingId === comment.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
*/

