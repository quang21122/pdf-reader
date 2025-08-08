/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/utils/supabaseClient";
import { createClient } from "@supabase/supabase-js";
import { GraphQLScalarType, Kind } from "graphql";

// Types for resolver arguments
interface PDFFileInput {
  id: string;
  user_id: string;
  filename: string;
  file_path: string;
  file_size: number;
  upload_date: string;
  public_url?: string;
  description?: string;
}

interface ResolverContext {
  token?: string;
  req: Request;
  headers: Headers;
}

// Create authenticated Supabase client
function getAuthenticatedSupabaseClient(token?: string) {
  if (!token) {
    return supabase; // Fallback to default client
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}

// Custom scalar types
const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "DateTime custom scalar type",
  serialize(value: unknown) {
    return value instanceof Date ? value.toISOString() : value;
  },
  parseValue(value: unknown) {
    return new Date(value as string);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const UUIDScalar = new GraphQLScalarType({
  name: "UUID",
  description: "UUID custom scalar type",
  serialize(value: unknown) {
    return value;
  },
  parseValue(value: unknown) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  },
});

export const resolvers = {
  DateTime: DateTimeScalar,
  UUID: UUIDScalar,

  Query: {
    // PDF Files
    async getPDFFiles(
      _: unknown,
      { user_id }: { user_id: string },
      context: ResolverContext
    ) {
      const authenticatedSupabase = getAuthenticatedSupabaseClient(
        context.token
      );

      const { data, error } = await authenticatedSupabase
        .from("pdf_files")
        .select("*")
        .eq("user_id", user_id)
        .order("upload_date", { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch PDF files: ${error.message}`);
      }

      return data || [];
    },

    async getPDFFile(
      _: unknown,
      { id, user_id }: { id: string; user_id: string },
      context: ResolverContext
    ) {
      const authenticatedSupabase = getAuthenticatedSupabaseClient(
        context.token
      );

      const { data, error } = await authenticatedSupabase
        .from("pdf_files")
        .select("*")
        .eq("id", id)
        .eq("user_id", user_id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // Not found
        }
        throw new Error(`Failed to fetch PDF file: ${error.message}`);
      }

      return data;
    },

    // OCR Results
    async getOCRResults(
      _: any,
      { file_id, user_id }: { file_id: string; user_id: string }
    ) {
      const { data, error } = await supabase
        .from("ocr_results")
        .select("*")
        .eq("file_id", file_id)
        .eq("user_id", user_id)
        .order("page_number", { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch OCR results: ${error.message}`);
      }

      return data || [];
    },

    async getOCRResult(
      _: any,
      { id, user_id }: { id: string; user_id: string }
    ) {
      const { data, error } = await supabase
        .from("ocr_results")
        .select("*")
        .eq("id", id)
        .eq("user_id", user_id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null;
        }
        throw new Error(`Failed to fetch OCR result: ${error.message}`);
      }

      return data;
    },

    // Notes
    async getNotes(
      _: any,
      { file_id, user_id }: { file_id: string; user_id: string }
    ) {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("file_id", file_id)
        .eq("user_id", user_id)
        .order("created_at", { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch notes: ${error.message}`);
      }

      return data || [];
    },

    async getNote(_: any, { id, user_id }: { id: string; user_id: string }) {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .eq("user_id", user_id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null;
        }
        throw new Error(`Failed to fetch note: ${error.message}`);
      }

      return data;
    },
  },

  Mutation: {
    // PDF Files
    async insertPDFFile(
      _: unknown,
      { object }: { object: PDFFileInput },
      context: ResolverContext
    ) {
      const authenticatedSupabase = getAuthenticatedSupabaseClient(
        context.token
      );

      const { data, error } = await authenticatedSupabase
        .from("pdf_files")
        .insert([object])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to insert PDF file: ${error.message}`);
      }

      return data;
    },

    async updatePDFFile(_: any, { id, changes }: { id: string; changes: any }) {
      const { data, error } = await supabase
        .from("pdf_files")
        .update({
          ...changes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update PDF file: ${error.message}`);
      }

      return data;
    },

    async deletePDFFile(_: any, { id }: { id: string }) {
      const { data, error } = await supabase
        .from("pdf_files")
        .delete()
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to delete PDF file: ${error.message}`);
      }

      return data;
    },

    // OCR Results
    async insertOCRResult(_: any, { object }: { object: any }) {
      const { data, error } = await supabase
        .from("ocr_results")
        .insert([object])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to insert OCR result: ${error.message}`);
      }

      return data;
    },

    async insertOCRResults(_: any, { objects }: { objects: any[] }) {
      const { data, error } = await supabase
        .from("ocr_results")
        .insert(objects)
        .select();

      if (error) {
        throw new Error(`Failed to insert OCR results: ${error.message}`);
      }

      return data || [];
    },

    async updateOCRResult(
      _: any,
      { id, changes }: { id: string; changes: any }
    ) {
      const { data, error } = await supabase
        .from("ocr_results")
        .update({
          ...changes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update OCR result: ${error.message}`);
      }

      return data;
    },

    async deleteOCRResult(_: any, { id }: { id: string }) {
      const { data, error } = await supabase
        .from("ocr_results")
        .delete()
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to delete OCR result: ${error.message}`);
      }

      return data;
    },

    async deleteOCRResults(_: any, { file_id }: { file_id: string }) {
      const { data, error } = await supabase
        .from("ocr_results")
        .delete()
        .eq("file_id", file_id)
        .select();

      if (error) {
        throw new Error(`Failed to delete OCR results: ${error.message}`);
      }

      return data || [];
    },

    // Notes
    async insertNote(_: any, { object }: { object: any }) {
      const { data, error } = await supabase
        .from("notes")
        .insert([object])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to insert note: ${error.message}`);
      }

      return data;
    },

    async updateNote(_: any, { id, changes }: { id: string; changes: any }) {
      const { data, error } = await supabase
        .from("notes")
        .update({
          ...changes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update note: ${error.message}`);
      }

      return data;
    },

    async deleteNote(_: any, { id }: { id: string }) {
      const { data, error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to delete note: ${error.message}`);
      }

      return data;
    },

    async deleteNotes(_: any, { file_id }: { file_id: string }) {
      const { data, error } = await supabase
        .from("notes")
        .delete()
        .eq("file_id", file_id)
        .select();

      if (error) {
        throw new Error(`Failed to delete notes: ${error.message}`);
      }

      return data || [];
    },
  },
};
