import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { useAuth } from "../../contexts/auth.context";
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import EditPostDialog from './EditPostDialog';

export const PostCard = ({ post, onDelete, onUpdate }) => {
  const getImageUrl = () => {
    if (!post.image_url) return null;
    return `${import.meta.env.VITE_API_BASE_URL || ''}${post.image_url}`;
  };

  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isOwner = user?.id === post.user_id;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await onDelete(post.id);
    }
  };

  const handleUpdate = async (updatedData) => {
    await onUpdate(post.id, updatedData);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="w-full border border-gray-200 rounded-2xl p-5 shadow-md bg-white transition hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              src={post.profile_picture
                ? `${import.meta.env.VITE_API_BASE_URL || ''}${post.profile_picture}`
                : undefined}
            />
            <AvatarFallback>
              {post.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-800">{post.username}</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <DotsVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <p className="mb-4 text-gray-700 leading-relaxed whitespace-pre-line">
        {post.content}
      </p>

      {post.image_url && (
        <div className="mb-4 overflow-hidden rounded-xl border border-gray-200">
          <img
            src={getImageUrl()}
            alt="Post content"
            className="w-full max-h-[450px] object-cover"
          />
        </div>
      )}

      {isOwner && (
        <EditPostDialog
          post={post}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};
