export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          cover_letter: string | null
          created_at: string | null
          id: string
          opportunity_id: string
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          opportunity_id: string
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          opportunity_id?: string
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          certification_name: string
          certification_type: string
          created_at: string | null
          document_url: string | null
          expiration_date: string | null
          id: string
          issue_date: string | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          certification_name: string
          certification_type: string
          created_at?: string | null
          document_url?: string | null
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          certification_name?: string
          certification_type?: string
          created_at?: string | null
          document_url?: string | null
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "certifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      education: {
        Row: {
          created_at: string | null
          degree: string
          gpa: number | null
          gpa_visible: boolean | null
          graduation_year: number | null
          id: string
          major: string
          school_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          degree: string
          gpa?: number | null
          gpa_visible?: boolean | null
          graduation_year?: number | null
          id?: string
          major: string
          school_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          degree?: string
          gpa?: number | null
          gpa_visible?: boolean | null
          graduation_year?: number | null
          id?: string
          major?: string
          school_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          organization: string
          role_title: string
          start_date: string
          supervisor: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          organization: string
          role_title: string
          start_date: string
          supervisor?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          organization?: string
          role_title?: string
          start_date?: string
          supervisor?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hour_logs: {
        Row: {
          created_at: string
          date: string
          description: string | null
          document_url: string | null
          experience_type: Database["public"]["Enums"]["experience_type"]
          hours: number
          id: string
          location: string | null
          organization: string
          role_title: string
          supervisor_email: string | null
          supervisor_name: string | null
          updated_at: string
          user_id: string
          verification_date: string | null
          verification_notes: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          verifier_name: string | null
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          document_url?: string | null
          experience_type: Database["public"]["Enums"]["experience_type"]
          hours: number
          id?: string
          location?: string | null
          organization: string
          role_title: string
          supervisor_email?: string | null
          supervisor_name?: string | null
          updated_at?: string
          user_id: string
          verification_date?: string | null
          verification_notes?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verifier_name?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          document_url?: string | null
          experience_type?: Database["public"]["Enums"]["experience_type"]
          hours?: number
          id?: string
          location?: string | null
          organization?: string
          role_title?: string
          supervisor_email?: string | null
          supervisor_name?: string | null
          updated_at?: string
          user_id?: string
          verification_date?: string | null
          verification_notes?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verifier_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_profiles: {
        Row: {
          banner_url: string | null
          contact_email: string | null
          created_at: string | null
          department: string | null
          description: string | null
          id: string
          institution: string
          lab_name: string
          updated_at: string | null
          user_id: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          banner_url?: string | null
          contact_email?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          id?: string
          institution: string
          lab_name: string
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          banner_url?: string | null
          contact_email?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          id?: string
          institution?: string
          lab_name?: string
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          banner_url: string | null
          category: Database["public"]["Enums"]["opportunity_category"]
          compensation_amount: number | null
          created_at: string | null
          description: string
          duration_months: number | null
          hours_per_week: number | null
          id: string
          is_paid: boolean | null
          is_remote: boolean | null
          lab_profile_id: string
          location: string
          min_gpa: number | null
          preferred_skills: string[] | null
          required_certifications: string[] | null
          required_skills: string[] | null
          responsibilities: string | null
          slots_available: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["opportunity_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          banner_url?: string | null
          category: Database["public"]["Enums"]["opportunity_category"]
          compensation_amount?: number | null
          created_at?: string | null
          description: string
          duration_months?: number | null
          hours_per_week?: number | null
          id?: string
          is_paid?: boolean | null
          is_remote?: boolean | null
          lab_profile_id: string
          location: string
          min_gpa?: number | null
          preferred_skills?: string[] | null
          required_certifications?: string[] | null
          required_skills?: string[] | null
          responsibilities?: string | null
          slots_available?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          banner_url?: string | null
          category?: Database["public"]["Enums"]["opportunity_category"]
          compensation_amount?: number | null
          created_at?: string | null
          description?: string
          duration_months?: number | null
          hours_per_week?: number | null
          id?: string
          is_paid?: boolean | null
          is_remote?: boolean | null
          lab_profile_id?: string
          location?: string
          min_gpa?: number | null
          preferred_skills?: string[] | null
          required_certifications?: string[] | null
          required_skills?: string[] | null
          responsibilities?: string | null
          slots_available?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_lab_profile_id_fkey"
            columns: ["lab_profile_id"]
            isOneToOne: false
            referencedRelation: "lab_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          academic_status: string | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          coursework: string[] | null
          created_at: string | null
          department: string | null
          email: string
          full_name: string | null
          google_scholar_url: string | null
          gpa: number | null
          gpa_visible: boolean | null
          graduation_year: number | null
          id: string
          institutional_profile_url: string | null
          lab_name: string | null
          linkedin_url: string | null
          location: string | null
          major: string | null
          orcid_link: string | null
          pubmed_link: string | null
          research_focus: string | null
          resume_url: string | null
          school: string | null
          skills: string[] | null
          title: string | null
          updated_at: string | null
          verified: boolean | null
          weekly_availability: Json | null
          year: string | null
        }
        Insert: {
          academic_status?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          coursework?: string[] | null
          created_at?: string | null
          department?: string | null
          email: string
          full_name?: string | null
          google_scholar_url?: string | null
          gpa?: number | null
          gpa_visible?: boolean | null
          graduation_year?: number | null
          id: string
          institutional_profile_url?: string | null
          lab_name?: string | null
          linkedin_url?: string | null
          location?: string | null
          major?: string | null
          orcid_link?: string | null
          pubmed_link?: string | null
          research_focus?: string | null
          resume_url?: string | null
          school?: string | null
          skills?: string[] | null
          title?: string | null
          updated_at?: string | null
          verified?: boolean | null
          weekly_availability?: Json | null
          year?: string | null
        }
        Update: {
          academic_status?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          coursework?: string[] | null
          created_at?: string | null
          department?: string | null
          email?: string
          full_name?: string | null
          google_scholar_url?: string | null
          gpa?: number | null
          gpa_visible?: boolean | null
          graduation_year?: number | null
          id?: string
          institutional_profile_url?: string | null
          lab_name?: string | null
          linkedin_url?: string | null
          location?: string | null
          major?: string | null
          orcid_link?: string | null
          pubmed_link?: string | null
          research_focus?: string | null
          resume_url?: string | null
          school?: string | null
          skills?: string[] | null
          title?: string | null
          updated_at?: string | null
          verified?: boolean | null
          weekly_availability?: Json | null
          year?: string | null
        }
        Relationships: []
      }
      saved_opportunities: {
        Row: {
          created_at: string | null
          id: string
          opportunity_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          opportunity_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          opportunity_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          created_at: string
          expires_at: string
          hour_log_id: string
          id: string
          status: Database["public"]["Enums"]["verification_status"]
          token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          hour_log_id: string
          id?: string
          status?: Database["public"]["Enums"]["verification_status"]
          token: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          hour_log_id?: string
          id?: string
          status?: Database["public"]["Enums"]["verification_status"]
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_hour_log"
            columns: ["hour_log_id"]
            isOneToOne: false
            referencedRelation: "hour_logs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "lab" | "clinic" | "admin"
      application_status: "pending" | "accepted" | "rejected" | "withdrawn"
      experience_type:
        | "clinical"
        | "research"
        | "volunteer"
        | "shadowing"
        | "other"
      opportunity_category:
        | "research"
        | "clinical"
        | "volunteer"
        | "shadowing"
        | "data"
      opportunity_status: "draft" | "active" | "closed"
      verification_status: "pending" | "verified" | "rejected" | "self_logged"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "lab", "clinic", "admin"],
      application_status: ["pending", "accepted", "rejected", "withdrawn"],
      experience_type: [
        "clinical",
        "research",
        "volunteer",
        "shadowing",
        "other",
      ],
      opportunity_category: [
        "research",
        "clinical",
        "volunteer",
        "shadowing",
        "data",
      ],
      opportunity_status: ["draft", "active", "closed"],
      verification_status: ["pending", "verified", "rejected", "self_logged"],
    },
  },
} as const
