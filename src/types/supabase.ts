export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
          clerk_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
          clerk_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
          clerk_id?: string;
        };
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: string;
          created_at: string;
          updated_at: string;
          clerk_id: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role: string;
          created_at?: string;
          updated_at?: string;
          clerk_id: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
          clerk_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
