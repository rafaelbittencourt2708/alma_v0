"use client";

import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Alma</h1>
            </div>
            <div className="flex items-center space-x-4">
              <OrganizationSwitcher 
                afterCreateOrganizationUrl="/dashboard"
                afterLeaveOrganizationUrl="/select-organization"
                afterSelectOrganizationUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "flex justify-center",
                    organizationSwitcherTrigger: "flex items-center gap-2"
                  }
                }}
              />
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Welcome to your organization dashboard</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your clinic, staff, and patients all in one place.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
