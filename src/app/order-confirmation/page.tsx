'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiCheckCircle, FiMail, FiPackage } from 'react-icons/fi';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    postalCode: string;
    prefecture: string;
    city: string;
    address1: string;
    address2?: string;
  };
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // ローカルストレージから注文情報を取得
    const orderData = localStorage.getItem('lastOrder');
    if (orderData) {
      setOrder(JSON.parse(orderData));
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl text-gray-600">注文情報が見つかりません</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
            ホームへ戻る
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 成功メッセージ */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
          <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ご注文ありがとうございます！</h1>
          <p className="text-lg text-gray-600 mb-4">
            ご注文を承りました。確認メールをお送りしました。
          </p>
          <p className="text-sm text-gray-500">
            注文番号: <span className="font-medium">{order.id}</span>
          </p>
        </div>

        {/* 注文詳細 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">注文内容</h2>
          
          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <div key={item.productId} className="flex gap-4 pb-4 border-b last:border-0">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                  <p className="text-sm font-medium mt-1">
                    ¥{item.price.toLocaleString()} × {item.quantity} = ¥{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 space-y-2">
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
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>合計</span>
              <span>¥{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 配送情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <FiPackage className="mr-2" />
              配送先
            </h3>
            <p className="text-sm text-gray-600">
              {order.customer.lastName} {order.customer.firstName} 様<br />
              〒{order.customer.postalCode}<br />
              {order.customer.prefecture}{order.customer.city}<br />
              {order.customer.address1}<br />
              {order.customer.address2 && <>{order.customer.address2}<br /></>}
              電話: {order.customer.phone}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <FiMail className="mr-2" />
              連絡先
            </h3>
            <p className="text-sm text-gray-600">
              確認メールを以下のアドレスに送信しました：<br />
              <span className="font-medium">{order.customer.email}</span>
            </p>
          </div>
        </div>

        {/* 次のステップ */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-3">次のステップ</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>注文確認メールをご確認ください</li>
            <li>商品の発送準備が整い次第、発送通知メールをお送りします</li>
            <li>通常、ご注文から2-3営業日以内に発送いたします</li>
            <li>配送状況は、発送通知メールに記載の追跡番号からご確認いただけます</li>
          </ol>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors text-center font-medium"
          >
            ホームへ戻る
          </Link>
          <Link
            href="/products"
            className="border border-blue-600 text-blue-600 py-3 px-8 rounded-md hover:bg-blue-50 transition-colors text-center font-medium"
          >
            買い物を続ける
          </Link>
        </div>
      </div>
    </div>
  );
}