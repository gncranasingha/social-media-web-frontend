import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth.context';
import { PostCard } from '../../components/posts/PostCard';
import { CreatePost } from '../../components/posts/CreatePost';
import { getPostsByUser, deletePost, updatePost } from '../../services/api';
import { Skeleton } from "@/components/ui/skeleton";

export const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
 

  const fetchPosts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const postsData = await getPostsByUser(user.id);
      setPosts(postsData);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError('Failed to delete post. Please try again.');
    }
  };

  const handleUpdate = async (postId, formData) => {
    try {
      const updatedPost = await updatePost(postId, formData);
      setPosts(posts.map(post =>
        post.id === postId ? updatedPost : post
      ));
    } catch (err) {
      console.error('Failed to update post:', err);
      throw err;
    }
  };

  
  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-xl">
        Please log in to view your feed.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
     
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      
        <div className="mx-auto space-y-8">
        
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Your Feed</h1>
            <div className="flex items-center gap-4">
              <CreatePost onPostCreated={fetchPosts} />
            </div>
          </div>

        
          {error && (
            <div className="p-4 rounded-md bg-red-100 text-red-700 border border-red-200">
              {error}
            </div>
          )}

        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border rounded-2xl p-5 shadow-sm bg-white animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <Skeleton className="h-60 w-full rounded-xl" />
                </div>
              ))
            ) : posts.length === 0 ? (
              <div className="text-center py-20 text-gray-400 text-lg">
                No posts yet. Create your first post!
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};