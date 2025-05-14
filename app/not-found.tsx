'use client';

import { HomeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '~/core/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900">
            Trang không tồn tại
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Quay lại
          </Button>
          <Button onClick={() => router.push('/')} className="w-full sm:w-auto">
            <HomeIcon className="mr-2 h-4 w-4" />
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
