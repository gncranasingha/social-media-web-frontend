import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { useAuth } from "../../contexts/auth.context"
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import  EditPostDialog  from './EditPostDialog';

export const PostCard = ({ post, onDelete, onUpdate }) => {
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
    <div className="border rounded-lg p-4 mb-4 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage 
              src={post.profile_picture ? 
                `http://localhost:5000${post.profile_picture}` : 
                undefined} 
            />
            <AvatarFallback>
              {post.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.username}</p>
            <p className="text-xs text-gray-500">
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
              <DropdownMenuItem
                className="text-red-500"
                onClick={handleDelete}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <p className="mb-3 whitespace-pre-line">{post.content}</p>
      
      {post.image_url && (
        <div className="mb-3 rounded-lg overflow-hidden border">
          <img
            src={`http://localhost:5000${post.image_url}`}
            alt="Post content"
            className="w-full max-h-96 object-contain"
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