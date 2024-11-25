import { useOrganization as useClerkOrganization } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getOrganizationClient } from "@/lib/supabase";
import { useAuth } from "@clerk/nextjs";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type?: string;
  active?: boolean;
  created_at: string;
  updated_at: string;
}

export function useOrganization() {
  const { organization } = useClerkOrganization();
  const { getToken } = useAuth();
  const [orgData, setOrgData] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchOrganizationData() {
      if (!organization?.id) {
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();
        const supabase = await getOrganizationClient(organization.id, token || undefined);
        
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', organization.id)
          .single();

        if (error) throw error;

        setOrgData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch organization data'));
      } finally {
        setLoading(false);
      }
    }

    fetchOrganizationData();
  }, [organization?.id, getToken]);

  return {
    organization: orgData,
    isLoaded: !loading,
    error,
    clerkOrganization: organization,
  };
}
