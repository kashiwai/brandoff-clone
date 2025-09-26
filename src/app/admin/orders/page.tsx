'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiEye, FiPackage, FiTruck, FiCheck, FiX, FiRefreshCw,
  FiDollarSign, FiUser, FiCalendar, FiFilter
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  email: string;
  phone?: string;
  status: string;
  paymentStatus: string;
  total: number;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      sku: string;
    };
  }[];
  user?: {
    name: string;
    email: string;
  };
  createdAt: string;
  trackingNumber?: string;
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusIcons = {
  PENDING: FiCalendar,
  PROCESSING: FiPackage,
  SHIPPED: FiTruck,
  DELIVERED: FiCheck,
  CANCELLED: FiX,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'ALL') params.append('status', filter);

      const response = await fetch(`/api/admin/orders?${params}`);
      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error('注文の読み込みに失敗しました');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      toast.success('注文ステータスを更新しました');
      fetchOrders();
    } catch (error) {
      toast.error('ステータスの更新に失敗しました');
      console.error(error);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">注文管理</h1>
        <p className="text-gray-600 mt-2">すべての注文を管理・追跡できます</p>
      </div>

      {/* フィルター */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="注文番号またはメールアドレスで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'ALL' ? 'すべて' : status}
              </button>
            ))}
          </div>
        </div>

        {/* 統計 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">保留中</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'PENDING').length}
                </p>
              </div>
              <FiCalendar className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">処理中</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'PROCESSING').length}
                </p>
              </div>
              <FiPackage className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">発送済み</p>
                <p className="text-2xl font-bold text-purple-600">
                  {orders.filter(o => o.status === 'SHIPPED').length}
                </p>
              </div>
              <FiTruck className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">今月の売上</p>
                <p className="text-2xl font-bold text-green-600">
                  ¥{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
                </p>
              </div>
              <FiDollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 注文テーブル */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                注文番号
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                顧客
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                商品数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                合計
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                日時
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => {
              const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.orderNumber.slice(0, 8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.user?.name || 'ゲスト'}</div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} 点
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ¥{order.total.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${statusColors[order.status as keyof typeof statusColors]}`}>
                      {StatusIcon && <StatusIcon className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>

                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                          className="text-green-600 hover:text-green-900"
                          title="処理開始"
                        >
                          <FiPackage className="w-4 h-4" />
                        </button>
                      )}

                      {order.status === 'PROCESSING' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                          className="text-purple-600 hover:text-purple-900"
                          title="発送済みにする"
                        >
                          <FiTruck className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm('この注文の返品・交換を開始しますか？')) {
                            window.location.href = `/admin/returns/new?orderId=${order.id}`;
                          }
                        }}
                        className="text-orange-600 hover:text-orange-900"
                        title="返品・交換"
                      >
                        <FiRefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">注文が見つかりません</p>
          </div>
        )}
      </div>
    </div>
  );
}