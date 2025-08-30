'use client';

import { useRef, useEffect, useState } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{x: number; y: number} | null>(null);
  const [guess, setGuess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Function to set canvas size based on screen size
    const setCanvasSize = () => {
      // For mobile devices
      if (window.innerWidth <= 768) {
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerHeight * 0.4;
      } 
      // For tablets
      else if (window.innerWidth <= 1024) {
        canvas.width = window.innerWidth * 0.7;
        canvas.height = window.innerHeight * 0.45;
      } 
      // For desktop
      else {
        canvas.width = 600;
        canvas.height = 450;
      }

      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update line width based on screen size
      ctx.lineWidth = window.innerWidth <= 768 ? 5 : 3;
    };

    // Set initial canvas size
    setCanvasSize();

    // Set drawing styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = window.innerWidth <= 768 ? 5 : 3;
    ctx.strokeStyle = '#000000';

    // Add event listener for window resize
    window.addEventListener('resize', setCanvasSize);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastPoint({x, y});
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastPoint({x, y});
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  // 触摸事件处理函数
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setIsDrawing(true);
    setLastPoint({x, y});
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !lastPoint) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setLastPoint({x, y});
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setGuess('');
  };

  const guessDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsLoading(true);
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        });
      });

      // Send to API for guessing
      const response = await fetch('/api/guess', {
        method: 'POST',
        body: blob,
        headers: {
          'Content-Type': 'image/png',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGuess(data.guess || '无法识别');
      } else {
        setGuess('识别失败');
      }
    } catch (error) {
      console.error('Error guessing drawing:', error);
      setGuess('识别出错');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 text-indigo-800">王嘉乐 你画我猜</h1>
        <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">画出你想画的内容，让王嘉乐来猜测是什么</p>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
          {/* 左侧：画布和控制按钮 */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 h-full">
              <div className="flex justify-center mb-4">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-300 rounded-lg cursor-crosshair shadow-sm max-w-full h-auto touch-none select-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                <button
                  onClick={clearCanvas}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-md flex-1 text-sm sm:text-base active:bg-gray-700"
                >
                  清空画布
                </button>
                <button
                  onClick={guessDrawing}
                  disabled={isLoading}
                  className={`px-4 py-2 sm:px-6 sm:py-3 text-white rounded-lg transition-colors shadow-md flex-1 text-sm sm:text-base ${
                    isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                  }`}
                >
                  {isLoading ? '王嘉乐 分析中...' : '王嘉乐 猜测'}
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：AI猜测结果和游戏说明 */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-indigo-800">王嘉乐 猜测结果</h2>
              {guess ? (
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <p className="text-base sm:text-xl font-semibold text-indigo-700">王嘉乐 的猜测: <span className="underline">{guess}</span></p>
                </div>
              ) : (
                <div className="text-center p-3 sm:p-4 text-gray-500">
                  <p className="text-sm sm:text-base">画完后点击&quot;王嘉乐 猜测&quot;按钮查看结果</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-indigo-800">游戏说明</h2>
              <ul className="list-disc pl-5 space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                <li>在画布上点击并拖动进行绘画</li>
                <li>画完后点击&quot;王嘉乐 猜测&quot;按钮，让王嘉乐识别你的画作</li>
                <li>点击&quot;清空画布&quot;可以重新开始绘画</li>
                <li>王嘉乐 可能无法准确识别复杂的画作，这很正常</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
