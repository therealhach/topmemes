export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tokens: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          token_name: string
          token_symbol: string
          token_address: string
          ath_price: number | null
          pair_address: string | null
          coingecko_id: string | null
          logo_url: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          token_name: string
          token_symbol: string
          token_address: string
          ath_price?: number | null
          pair_address?: string | null
          coingecko_id?: string | null
          logo_url?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          token_name?: string
          token_symbol?: string
          token_address?: string
          ath_price?: number | null
          pair_address?: string | null
          coingecko_id?: string | null
          logo_url?: string | null
        }
      }
      swaps: {
        Row: {
          id: number
          created_at: string
          wallet_address: string
          payment_currency: string
          swap_amount: number
          token_address: string
          token_symbol: string
          token_amount: number
          token_price: number
          fee_amount: number
          tx_signature: string
          swap_type: string
          status: string
        }
        Insert: {
          id?: number
          created_at?: string
          wallet_address: string
          payment_currency: string
          swap_amount: number
          token_address: string
          token_symbol: string
          token_amount: number
          token_price: number
          fee_amount: number
          tx_signature: string
          swap_type: string
          status?: string
        }
        Update: {
          id?: number
          created_at?: string
          wallet_address?: string
          payment_currency?: string
          swap_amount?: number
          token_address?: string
          token_symbol?: string
          token_amount?: number
          token_price?: number
          fee_amount?: number
          tx_signature?: string
          swap_type?: string
          status?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
