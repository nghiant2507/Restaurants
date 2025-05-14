import { ImageLoaderProps } from 'next/image';

export default function supabaseLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/images/${src}?width=${width}&quality=${
    quality || 75
  }`;
}
