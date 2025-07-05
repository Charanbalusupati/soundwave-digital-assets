
import React, { useState } from 'react';
import { Upload, X, FileImage, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAssets } from '@/hooks/useAssets';

interface AssetUploadFormProps {
  onUploadComplete?: () => void;
}

const AssetUploadForm: React.FC<AssetUploadFormProps> = ({ onUploadComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    is_published: false
  });
  const [uploading, setUploading] = useState(false);
  
  const { uploadAsset } = useAssets();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('audio/')) {
      alert('Please select an image or audio file');
      return;
    }

    setFile(selectedFile);
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    // Auto-fill title from filename
    if (!formData.title) {
      const fileName = selectedFile.name.split('.')[0];
      setFormData(prev => ({ ...prev, title: fileName }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      await uploadAsset(file, {
        title: formData.title,
        description: formData.description || null,
        category: formData.category || null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null,
        file_type: file.type,
        is_published: formData.is_published
      });

      // Reset form
      setFile(null);
      setPreview(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        tags: '',
        is_published: false
      });

      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-8">Upload New Asset</h3>
        
        {/* Drag & Drop Area */}
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-gray-50/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="space-y-4">
              {preview ? (
                <img src={preview} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded-lg" />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
                  <Music className="w-16 h-16 text-white" />
                </div>
              )}
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg font-medium text-gray-700">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                Drop files here or click to browse
              </h4>
              <p className="text-gray-500 mb-6">
                Support for audio files (MP3, WAV, FLAC) and images (JPG, PNG, WebP)
              </p>
              <Button
                type="button"
                onClick={() => document.getElementById('file-input')?.click()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-200"
              >
                Select Files
              </Button>
              <input
                id="file-input"
                type="file"
                accept="image/*,audio/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </>
          )}
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter asset title..."
                required
                className="bg-white/60 backdrop-blur-sm border border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="bg-white/60 backdrop-blur-sm border border-white/20">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="audio-electronic">Audio - Electronic</SelectItem>
                  <SelectItem value="audio-ambient">Audio - Ambient</SelectItem>
                  <SelectItem value="audio-cinematic">Audio - Cinematic</SelectItem>
                  <SelectItem value="audio-rock">Audio - Rock</SelectItem>
                  <SelectItem value="image-abstract">Image - Abstract</SelectItem>
                  <SelectItem value="image-nature">Image - Nature</SelectItem>
                  <SelectItem value="image-technology">Image - Technology</SelectItem>
                  <SelectItem value="image-photography">Image - Photography</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="Enter tags separated by commas..."
              className="bg-white/60 backdrop-blur-sm border border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter asset description..."
              className="bg-white/60 backdrop-blur-sm border border-white/20"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="publish"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
              />
              <Label htmlFor="publish">Publish immediately</Label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!file || !formData.title || uploading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-full font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload Asset'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AssetUploadForm;
