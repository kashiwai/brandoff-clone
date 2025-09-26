import { SquareClient, SquareEnvironment } from 'square'

// Square クライアントの初期化
export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment: process.env.NODE_ENV === 'production'
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox,
})

// Square設定
export const squareConfig = {
  applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!,
  locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
}

// 金額をSquare形式に変換（円をセントに）
export function formatAmountForSquare(amount: number): bigint {
  return BigInt(Math.round(amount * 100))
}

// Squareからの金額を通常形式に変換
export function parseAmountFromSquare(amount: bigint): number {
  return Number(amount) / 100
}