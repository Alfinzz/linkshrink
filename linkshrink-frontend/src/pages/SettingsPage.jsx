import { useState } from "react";
import { User, Shield, SlidersHorizontal, Upload, Link2 } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  // Read real user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem("linkshrink_user") || "{}");
  const [profileForm, setProfileForm] = useState({
    name: storedUser.name || "",
    email: storedUser.email || ""
  });

  return (
    <section className="space-y-6 animate-slideUp">
      <h1 className="page-title">Account Settings</h1>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={[
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              activeTab === tab.id
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Profile Form */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                <User size={28} />
              </div>
              <div>
                <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1.5">
                  <Upload size={14} />
                  Upload new picture
                </button>
                <p className="text-xs text-gray-400 mt-0.5">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-5">
              <div>
                <label htmlFor="settings-name" className="label-text">Full Name</label>
                <input
                  id="settings-name"
                  className="input-field"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="settings-email" className="label-text">Email Address</label>
                <input
                  id="settings-email"
                  className="input-field"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>
              <button type="button" className="btn-primary">
                Save Changes
              </button>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="card p-6 h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-3">
                <Link2 size={24} />
              </div>
              <h3 className="text-sm font-semibold text-primary-600">Account Status</h3>
              <p className="text-xs text-gray-400 mt-1">Your account is currently in good standing.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="card p-6 max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="current-password" className="label-text">Current Password</label>
              <input id="current-password" className="input-field" type="password" placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="new-password" className="label-text">New Password</label>
                <input id="new-password" className="input-field" type="password" placeholder="••••••••" />
              </div>
              <div>
                <label htmlFor="confirm-new-password" className="label-text">Confirm New Password</label>
                <input id="confirm-new-password" className="input-field" type="password" placeholder="••••••••" />
              </div>
            </div>
            <button type="button" className="btn-primary">Update Password</button>
          </div>
        </div>
      )}

      {activeTab === "preferences" && (
        <div className="card p-6 max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="default-domain" className="label-text">Default Domain</label>
              <input id="default-domain" className="input-field" placeholder="https://linkshrink-backend.vercel.app" />
            </div>
            <div>
              <label htmlFor="brand-name" className="label-text">Brand Name</label>
              <input id="brand-name" className="input-field" placeholder="LinkShrink" />
            </div>
            <button type="button" className="btn-primary">Save Preferences</button>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="card border-danger-200 p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-danger-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button type="button" className="btn-danger">
          Delete Account
        </button>
      </div>
    </section>
  );
}
