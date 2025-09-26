'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiUser, FiMail, FiPhone, FiShoppingBag, FiCalendar, FiDollarSign, FiEdit, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  orders: {
    id: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
  _count: {
    orders: number;
  };
  totalSpent: number;
  lastOrderDate?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchCustomers();
  }, [sortBy]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`/api/admin/customers?sort=${sortBy}`);
      if (!response.ok) throw new Error('Failed to fetch customers');

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      toast.error('顧客データの読み込みに失敗しました');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerSegment = (totalSpent: number) => {
    if (totalSpent >= 1000000) return { label: 'VIP', color: 'text-purple-600 bg-purple-100' };
    if (totalSpent >= 500000) return { label: 'ゴールド', color: 'text-yellow-600 bg-yellow-100' };
    if (totalSpent >= 100000) return { label: 'シルバー', color: 'text-gray-600 bg-gray-100' };
    return { label: 'レギュラー', color: 'text-blue-600 bg-blue-100' };
  };

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
        <h1 className="text-3xl font-bold text-gray-900">顧客管理</h1>
        <p className="text-gray-600 mt-2">顧客情報と購入履歴を管理</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">総顧客数</p>
              <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <FiUser className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">VIP顧客</p>
              <p className="text-3xl font-bold text-purple-600">
                {customers.filter(c => c.totalSpent >= 1000000).length}
              </p>
            </div>
            <FiDollarSign className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今月の新規顧客</p>
              <p className="text-3xl font-bold text-green-600">
                {customers.filter(c => {
                  const date = new Date(c.createdAt);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <FiCalendar className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">平均購入額</p>
              <p className="text-3xl font-bold text-gray-900">
                ¥{Math.floor(
                  customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length || 0
                ).toLocaleString()}
              </p>
            </div>
            <FiShoppingBag className="w-10 h-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* フィルターと検索 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="名前またはメールアドレスで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">最近登録</option>
            <option value="orders">購入回数順</option>
            <option value="spent">購入金額順</option>
            <option value="name">名前順</option>
          </select>
        </div>
      </div>

      {/* 顧客テーブル */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                顧客情報
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                セグメント
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                購入回数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                総購入額
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最終購入日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                登録日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.map((customer) => {
              const segment = getCustomerSegment(customer.totalSpent);
              return (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name || 'ゲストユーザー'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <FiMail className="w-3 h-3" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <FiPhone className="w-3 h-3" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${segment.color}`}>
                      {segment.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer._count.orders} 回</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ¥{customer.totalSpent.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleDateString('ja-JP')
                        : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString('ja-JP')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="詳細を見る"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          // メール送信機能を実装
                          toast.success('メール機能は準備中です');
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="メールを送る"
                      >
                        <FiMail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">顧客が見つかりません</p>
          </div>
        )}
      </div>
    </div>
  );
}