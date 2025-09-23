'use client';

import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCart();
  const subtotal = getSubtotal();
  const shipping = 0; // 送料無料
  const tax = Math.floor(subtotal * 0.1); // 消費税10%
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('カートに商品がありません');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">ショッピングカート</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FiShoppingBag className="mx-auto text-gray-400 w-24 h-24 mb-4" />
            <p className="text-xl text-gray-600 mb-8">カートに商品がありません</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors"
            >
              買い物を続ける
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ショッピングカート</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* カートアイテム */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium">{items.length}点の商品</p>
                  <button
                    onClick={() => {
                      if (confirm('カートを空にしてもよろしいですか？')) {
                        clearCart();
                        toast.success('カートを空にしました');
                      }
                    }}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    カートを空にする
                  </button>
                </div>
              </div>
              
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.productId} className="p-6">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-lg font-bold text-gray-900 mb-3">
                          ¥{item.price.toLocaleString()}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <FiMinus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <FiPlus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => {
                              removeItem(item.productId);
                              toast.success('商品を削除しました');
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 注文サマリー */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">注文内容</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">小計</span>
                  <span className="font-medium">¥{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">送料</span>
                  <span className="font-medium text-green-600">無料</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">消費税（10%）</span>
                  <span className="font-medium">¥{tax.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">合計</span>
                  <span className="text-lg font-bold">¥{total.toLocaleString()}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                レジに進む
              </button>
              
              <Link
                href="/products"
                className="block text-center text-blue-600 hover:text-blue-700 mt-4 text-sm"
              >
                買い物を続ける
              </Link>
              
              <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
                <p>✓ 全国送料無料</p>
                <p>✓ 安全な決済</p>
                <p>✓ 14日間返品保証</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}