'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiPackage, FiUsers, FiDollarSign, FiTrendingUp,
  FiAlertTriangle, FiShoppingCart, FiPercent, FiGift,
  FiPlus, FiEdit2, FiTrash2, FiEye
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// 在庫管理コンポーネント
function InventoryManagement() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/inventory');
      if (!response.ok) throw new Error('在庫データの取得に失敗しました');
      const data = await response.json();
      setInventory(data.products || []);
      setLowStockItems(data.products?.filter((p: any) => p.quantity < 10) || []);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      toast.error('在庫データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/admin/inventory/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (response.ok) {
        toast.success('在庫を更新しました');
        fetchInventory();
      }
    } catch (error) {
      toast.error('在庫更新に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FiPackage /> 在庫管理
        </h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FiPackage /> 在庫管理
      </h2>

      {/* 在庫アラート */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-red-600 font-semibold mb-2">
            <FiAlertTriangle />
            在庫不足アラート
          </div>
          <div className="space-y-2">
            {lowStockItems.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-sm">{item.name}</span>
                <span className="text-red-600 font-bold">残り {item.quantity} 個</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 在庫リスト */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                商品名
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                SKU
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                在庫数
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                ステータス
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventory.slice(0, 5).map(item => (
              <tr key={item.id}>
                <td className="py-3 text-sm">{item.name}</td>
                <td className="py-3 text-sm text-gray-500">{item.sku}</td>
                <td className="py-3">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateStock(item.id, parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.quantity < 10 ? 'bg-red-100 text-red-600' :
                    item.quantity < 50 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {item.quantity < 10 ? '低在庫' :
                     item.quantity < 50 ? '要注意' : '正常'}
                  </span>
                </td>
                <td className="py-3">
                  <Link href={`/admin/products/${item.id}/edit`} className="text-blue-600 hover:text-blue-800">
                    <FiEdit2 className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// クーポン管理コンポーネント
function CouponManagement() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 10,
    type: 'PERCENT',
    minAmount: 0,
    expiresAt: '',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/coupons');
      if (!response.ok) throw new Error('クーポンデータの取得に失敗しました');
      const data = await response.json();
      setCoupons(data || []);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
      toast.error('クーポンデータの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async () => {
    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });
      if (response.ok) {
        toast.success('クーポンを作成しました');
        setShowForm(false);
        fetchCoupons();
      }
    } catch (error) {
      toast.error('クーポン作成に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FiPercent /> クーポン管理
        </h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FiPercent /> クーポン管理
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FiPlus /> 新規作成
        </button>
      </div>

      {/* クーポン作成フォーム */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="クーポンコード"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="割引"
                value={newCoupon.discount}
                onChange={(e) => setNewCoupon({...newCoupon, discount: parseInt(e.target.value)})}
                className="px-3 py-2 border rounded-lg flex-1"
              />
              <select
                value={newCoupon.type}
                onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="PERCENT">%</option>
                <option value="AMOUNT">円</option>
              </select>
            </div>
            <input
              type="number"
              placeholder="最低購入金額"
              value={newCoupon.minAmount}
              onChange={(e) => setNewCoupon({...newCoupon, minAmount: parseInt(e.target.value)})}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="date"
              value={newCoupon.expiresAt}
              onChange={(e) => setNewCoupon({...newCoupon, expiresAt: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={createCoupon}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            作成
          </button>
        </div>
      )}

      {/* クーポンリスト */}
      <div className="space-y-2">
        {coupons.map(coupon => (
          <div key={coupon.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-mono font-bold">{coupon.code}</span>
              <span className="ml-2 text-sm text-gray-600">
                {coupon.type === 'PERCENT' ? `${coupon.discount}%` : `¥${coupon.discount}`}オフ
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                coupon.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {coupon.active ? '有効' : '無効'}
              </span>
              <button className="text-red-600 hover:text-red-800">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    activeProducts: 0,
    pendingOrders: 0,
    monthlyGrowth: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">管理ダッシュボード</h1>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">総売上</p>
              <p className="text-2xl font-bold">¥{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600">+{stats.monthlyGrowth}% 前月比</p>
            </div>
            <FiDollarSign className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">注文数</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
              <p className="text-xs text-orange-600">{stats.pendingOrders} 件処理中</p>
            </div>
            <FiShoppingCart className="w-10 h-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">顧客数</p>
              <p className="text-2xl font-bold">{stats.totalCustomers}</p>
            </div>
            <FiUsers className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">商品数</p>
              <p className="text-2xl font-bold">{stats.activeProducts}</p>
            </div>
            <FiPackage className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InventoryManagement />
        <CouponManagement />
      </div>

      {/* クイックアクション */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">クイックアクション</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/orders" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 text-center">
            <FiShoppingCart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium">注文管理</p>
          </Link>
          <Link href="/admin/customers" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 text-center">
            <FiUsers className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium">顧客管理</p>
          </Link>
          <Link href="/admin/products" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 text-center">
            <FiPackage className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium">商品管理</p>
          </Link>
          <Link href="/admin/returns" className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 text-center">
            <FiGift className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-sm font-medium">返品管理</p>
          </Link>
        </div>
      </div>
    </div>
  );
}