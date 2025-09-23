import Link from 'next/link'
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-serif mb-4">Fancyについて</h3>
            <p className="text-sm">
              本物のデザイナーブランドをお手頃価格で。
              品質保証付き。
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-serif mb-4">カスタマーサービス</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  配送・返品
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  よくある質問
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  サイズガイド
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  注文追跡
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white text-lg font-serif mb-4">企業情報</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  会社概要
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  採用情報
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white transition-colors">
                  プレス
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-white transition-colors">
                  サステナビリティ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-serif mb-4">メールマガジン</h3>
            <p className="text-sm mb-4">
              限定オファーや新商品情報をお届けします。
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="メールアドレスを入力"
                className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-600"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-white text-black hover:bg-gray-100 transition-colors uppercase tracking-wider text-sm"
              >
                登録する
              </button>
            </form>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="hover:text-white transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-900 text-center text-sm">
          <p>&copy; 2024 Fancy. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <span>利用可能なお支払い方法：</span>
            <span className="inline-block">Visa</span>
            <span className="inline-block">Mastercard</span>
            <span className="inline-block">American Express</span>
            <span className="inline-block">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}