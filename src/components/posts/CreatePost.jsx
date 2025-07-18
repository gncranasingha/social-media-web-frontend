import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { createPost } from '../../services/api';

export const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB');
        return;
      }
      
      setImage(file);
      setError('');
      
     
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Post content is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      await createPost(formData);
      onPostCreated();
      setIsOpen(false);
      resetForm();
    } catch (err) {
      console.error('Failed to create post:', err);
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setContent('');
    setImage(null);
    setImagePreview(null);
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Post</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="content">What's on your mind?</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="image">Image (optional)</Label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-60 rounded-md object-contain"
                />
              </div>
            )}
          </div>
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? 'Posting...' : 'Post'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};