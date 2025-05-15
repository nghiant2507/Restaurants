import { Image as ImageIcon, XCircle } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

import { AlertDescription } from '~/core/components/ui/alert';
import { Input } from '~/core/components/ui/input';
import { Skeleton } from '~/core/components/ui/skeleton';
import { getSupabaseImageUrl } from '~/core/utils';

type Props = {
  value?: string;
  onChange: (url: string) => void;
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_SIZE_MB = 6;

const UpdateImage: React.FC<Props> = ({ value, onChange }) => {
  const [preview, setPreview] = useState<string | undefined>(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(undefined);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Chỉ hỗ trợ ảnh jpg, jpeg, png, webp.');
      return;
    }
    if (file.size / 1024 / 1024 > MAX_SIZE_MB) {
      setError('Ảnh tối đa 6MB.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || 'Lỗi upload ảnh');
        setLoading(false);
        return;
      }
      setPreview(data.url);
      onChange(data.url);
    } catch (err: any) { //eslint-disable-line
      setError('Lỗi upload ảnh');
    }
    setLoading(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(undefined);
    onChange('');
    setError(undefined);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="size-25 rounded-lg border flex items-center justify-center bg-muted relative overflow-hidden cursor-pointer hover:bg-muted/80 transition-colors"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Chọn ảnh"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
      >
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : preview ? (
          <Image
            src={getSupabaseImageUrl(preview) ?? ''}
            alt="Preview"
            width={100}
            height={100}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Chọn ảnh</span>
          </div>
        )}
        {preview && !loading && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white"
            aria-label="Xóa ảnh"
            tabIndex={0}
          >
            <XCircle className="w-5 h-5 text-destructive" />
          </button>
        )}
      </div>
      <Input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Chọn ảnh"
      />
      {error && (
        <AlertDescription className="text-red-500 font-medium">
          {error}
        </AlertDescription>
      )}
    </div>
  );
};

export default UpdateImage;
