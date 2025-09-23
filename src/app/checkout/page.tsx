'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FiCreditCard, FiLock } from 'react-icons/fi';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  const subtotal = getSubtotal();
  const shipping = 0;
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
    
    // 支払い情報
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 実際の決済処理をシミュレート
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 注文を作成（実際にはAPIを呼び出す）
      const order = {
        id: `ORD-${Date.now()}`,
        items: items,
        total: total,
        customer: formData,
        createdAt: new Date().toISOString(),
      };
      
      // 注文情報をローカルストレージに保存
      localStorage.setItem('lastOrder', JSON.stringify(order));
      
      // カートをクリア
      clearCart();
      
      // 注文確認ページへ
      router.push('/order-confirmation');
    } catch (error) {
      toast.error('注文の処理中にエラーが発生しました');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
                    電話番号 *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
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
                    <option value="神奈川県">神奈川県</option>
                    <option value="愛知県">愛知県</option>
                    <option value="福岡県">福岡県</option>
                    {/* 他の都道府県も追加可能 */}
                  </select>
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
                    住所1 *
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
                    住所2（建物名など）
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

            {/* 支払い情報 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">支払い情報</h2>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-md flex items-center">
                <FiLock className="text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">すべての支払い情報は安全に暗号化されています</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    カード番号 *
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    required
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                    カード名義 *
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    required
                    placeholder="TARO YAMADA"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      有効期限 *
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      required
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      セキュリティコード *
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      required
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：注文サマリー */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">注文内容</h2>
              
              {/* 商品リスト */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ¥{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-3">
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
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>処理中...</>
                ) : (
                  <>
                    <FiCreditCard className="mr-2" />
                    注文を確定する
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                注文を確定することで、利用規約に同意したものとみなされます
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}