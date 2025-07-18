import { useEffect, useState } from 'react';
import { useAuth } from "../../contexts/auth.context"
import { PostCard } from '../../components/posts/PostCard';
import { getPostsByUser } from '../../services/api';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { EditProfileDialog } from '../../components/users/EditProfileDialog';
import { Skeleton } from '../../components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUserPosts = async () => {
    setIsLoading(true);
    try {
      const postsData = await getPostsByUser(user?.id);
      setPosts(Array.isArray(postsData) ? postsData : []); // Ensure it's always an array
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

   const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      fetchUserPosts(); // Refresh the posts after deletion
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserPosts();
    }
  }, [user?.id]);

  if (!user) {
    return <div className="flex justify-center p-8">Loading user data...</div>;
  }

   const getProfilePictureUrl = () => {
    if (!user?.profile_picture) return undefined;
    if (user.profile_picture.startsWith('http')) return user.profile_picture;
    return `${import.meta.env.VITE_API_BASE_URL || ''}${
      user.profile_picture.startsWith('/') ? '' : '/'
    }${user.profile_picture}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="relative">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage 
              src={getProfilePictureUrl()}
              onError={(e) => {
                e.currentTarget.src = ''; // Clear the erroring src
              }}
            />
            <AvatarFallback className="text-2xl">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold">{user?.username || 'User'}</h1>
          <p className="text-gray-600 mb-4">{user?.email || ''}</p>
          
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              <span className="font-medium">{posts?.length || 0}</span> posts
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={() => setIsEditDialogOpen(true)}
            className="w-full md:w-auto"
          >
            Edit Profile
          </Button>
        </div>
      </div>

     <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">You haven't created any posts yet.</p>
            <Button 
              variant="link" 
              className="mt-2"
              onClick={() => navigate('/create-post')}
            >
              Create your first post
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post}
                onDelete={handleDeletePost}
                onUpdate={() => fetchUserPosts()}
              />
            ))}
          </div>
        )}
      </div>

      <EditProfileDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onProfileUpdated={fetchUserPosts}
      />
    </div>
  );
};