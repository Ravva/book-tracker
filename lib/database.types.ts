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
      achievements: {
        Row: {
          description: string
          icon_url: string | null
          id: number
          name: string
        }
        Insert: {
          description: string
          icon_url?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string
          icon_url?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      book_tags: {
        Row: {
          book_id: number
          id: number
          tag_id: number
        }
        Insert: {
          book_id: number
          id?: number
          tag_id: number
        }
        Update: {
          book_id?: number
          id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "book_tags_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      books: {
        Row: {
          author: string
          cover_url: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          book_id: number
          content: string
          created_at: string
          id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: number
          content: string
          created_at?: string
          id?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: number
          content?: string
          created_at?: string
          id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      list_books: {
        Row: {
          book_id: number
          created_at: string
          id: number
          list_id: number
        }
        Insert: {
          book_id: number
          created_at?: string
          id?: number
          list_id: number
        }
        Update: {
          book_id?: number
          created_at?: string
          id?: number
          list_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "list_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "list_books_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          }
        ]
      }
      lists: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_public: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_public?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_public?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achieved_at: string
          achievement_id: number
          id: number
          user_id: string
        }
        Insert: {
          achieved_at?: string
          achievement_id: number
          id?: number
          user_id: string
        }
        Update: {
          achieved_at?: string
          achievement_id?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_books: {
        Row: {
          book_id: number
          created_at: string
          id: number
          rating: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: number
          created_at?: string
          id?: number
          rating?: number | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: number
          created_at?: string
          id?: number
          rating?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_books_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Buckets: {
      book_covers: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      book_files: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
  }
}