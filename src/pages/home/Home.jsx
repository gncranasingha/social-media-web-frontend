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

    console.log(posts);
    

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Feed</h1>
        <CreatePost onPostCreated={fetchPosts} />
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-60 w-full rounded-md" />
            </div>
          ))
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No posts yet. Create your first post!</p>
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
  );
};