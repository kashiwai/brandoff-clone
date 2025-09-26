'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FiCreditCard, FiLock } from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Fincode Payment Formを動的インポート（SSR回避）
const FincodePaymentForm = dynamic(
  () => import('@/components/FincodePaymentForm'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-100 rounded-lg p-8 animate-pulse">
        <div className="h-12 bg-gray-300 rounded mb-4"></div>
        <div className="h-40 bg-gray-300 rounded"></div>
      </div>
    )
  }
);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // クライアントサイドでのみ実行
  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getSubtotal();
  const shipping: number = 0;
  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + shipping + tax;

  const [formData, setFormData] = useState({
    // お客様情報
    email: '',
    firstName: '',
    lastName: '',
    phone: '',

    // 配送先
    postalCode: '',
    prefecture: '',
    city: '',
    address1: '',
    address2: '',

    // 支払い方法
    paymentMethod: 'card',

    // その他
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Square Payment Formで処理するため、ここでは何もしない
    // 実際の支払いはSquarePaymentFormコンポーネントで処理
  };

  const handlePaymentSuccess = (paymentResult: any) => {
    // 注文を作成
    const order = {
      id: paymentResult.id || `ORD-${Date.now()}`,
      items: items,
      total: total,
      customer: formData,
      createdAt: new Date().toISOString(),
      paymentId: paymentResult.id,
      paymentStatus: paymentResult.status,
      receiptUrl: paymentResult.receiptUrl,
    };

    // 注文情報をローカルストレージに保存
    localStorage.setItem('lastOrder', JSON.stringify(order));

    // カートをクリア
    clearCart();

    // 注文確認ページへ
    router.push('/order-confirmation');
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    toast.error('お支払いに失敗しました。もう一度お試しください。');
    setLoading(false);
  };

  // クライアントサイドでマウントされるまでローディング表示
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-100 rounded-lg p-8 animate-pulse">
            <div className="h-12 bg-gray-300 rounded mb-4"></div>
            <div className="h-40 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // カートが空の場合のリダイレクト（クライアントサイドのみ）
  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">チェックアウト</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：フォーム */}
          <div className="lg:col-span-2 space-y-6">
            {/* お客様情報 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">お客様情報</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      姓 *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      名 *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    電話番号
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* 配送先住所 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">配送先住所</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      郵便番号 *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      required
                      placeholder="123-4567"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-1">
                      都道府県 *
                    </label>
                    <select
                      id="prefecture"
                      name="prefecture"
                      required
                      value={formData.prefecture}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">選択してください</option>
                      <option value="東京都">東京都</option>
                      <option value="大阪府">大阪府</option>
                      <option value="愛知県">愛知県</option>
                      <option value="福岡県">福岡県</option>
                      {/* その他の都道府県も追加 */}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    市区町村 *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
                    番地・建物名 *
                  </label>
                  <input
                    type="text"
                    id="address1"
                    name="address1"
                    required
                    value={formData.address1}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
                    部屋番号など（任意）
                  </label>
                  <input
                    type="text"
                    id="address2"
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* 支払い方法 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiCreditCard className="mr-2" />
                お支払い方法
              </h3>

              <FincodePaymentForm
                amount={total}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                customerInfo={{
                  email: formData.email,
                  phone: formData.phone,
                  billingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    addressLine1: formData.address1,
                    addressLine2: formData.address2,
                    locality: formData.city,
                    administrativeDistrictLevel1: formData.prefecture,
                    postalCode: formData.postalCode,
                    country: 'JP',
                  },
                  shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    addressLine1: formData.address1,
                    addressLine2: formData.address2,
                    locality: formData.city,
                    administrativeDistrictLevel1: formData.prefecture,
                    postalCode: formData.postalCode,
                    country: 'JP',
                  },
                }}
                items={items.map(item => ({
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                }))}
              />
            </div>
          </div>

          {/* 右側：注文サマリー */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">注文内容</h2>

              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.productId} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        ¥{item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ¥{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">小計</span>
                  <span className="font-medium">¥{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">配送料</span>
                  <span className="font-medium">{shipping === 0 ? '無料' : `¥${shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">消費税</span>
                  <span className="font-medium">¥{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>合計</span>
                  <span>¥{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}