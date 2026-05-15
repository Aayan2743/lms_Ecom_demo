import React, { useState, useEffect } from "react";
import { 
  Shield, User, Mail, Phone, MapPin, Calendar, Save, 
  Clock, Activity, LogIn, Settings, Key, AlertCircle,
  CheckCircle, Smartphone, Globe, History, Edit3, Camera,
  BadgeCheck, Lock, Eye, EyeOff
} from "lucide-react";
import { useShop } from "../../ShopContext.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminProfile = () => {
  const { user, updateUser } = useShop();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [note, setNote] = useState("");
  const [errorNote, setErrorNote] = useState("");
  const [activeSection, setActiveSection] = useState("profile");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  // Activity log
  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem("adminActivityLog");
    return saved ? JSON.parse(saved) : [
      { id: 1, action: "Logged in", detail: "Admin panel access", timestamp: new Date().toISOString(), type: "auth" },
      { id: 2, action: "Updated product catalog", detail: "Added 3 new sarees", timestamp: new Date(Date.now() - 86400000).toISOString(), type: "catalog" },
      { id: 3, action: "Changed order status", detail: "Order #LM-240228 → Shipped", timestamp: new Date(Date.now() - 172800000).toISOString(), type: "order" },
      { id: 4, action: "Updated profile", detail: "Changed display name", timestamp: new Date(Date.now() - 259200000).toISOString(), type: "profile" },
      { id: 5, action: "Category updated", detail: "Added 'Festive Collection' subcategory", timestamp: new Date(Date.now() - 345600000).toISOString(), type: "catalog" },
      { id: 6, action: "Logged in", detail: "Admin panel access", timestamp: new Date(Date.now() - 432000000).toISOString(), type: "auth" },
    ];
  });

  // Save activity log to localStorage
  useEffect(() => {
    localStorage.setItem("adminActivityLog", JSON.stringify(activityLog));
  }, [activityLog]);

  const addActivity = (action, detail, type = "profile") => {
    const newActivity = {
      id: Date.now(),
      action,
      detail,
      timestamp: new Date().toISOString(),
      type
    };
    setActivityLog(prev => [newActivity, ...prev].slice(0, 50)); // Keep last 50
  };

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setRole(user?.role || "admin");
    setDepartment(user?.department || "");
    setBio(user?.bio || "");
    if (user?.profilePhoto) {
      setProfilePhotoPreview(user.profilePhoto);
    }
  }, [user]);

  const save = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorNote("Name is required.");
      setTimeout(() => setErrorNote(""), 3000);
      return;
    }
    const updatedUser = {
      ...user,
      name: name.trim(),
      email: (email.trim() || user.email).toLowerCase(),
      phone: phone.trim(),
      role: role || "admin",
      department: department.trim(),
      bio: bio.trim(),
    };
    updateUser(updatedUser);
    addActivity("Updated profile", "Changed account details");
    setNote("Profile saved successfully.");
    setTimeout(() => setNote(""), 2500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      setErrorNote("Current password is required.");
      setTimeout(() => setErrorNote(""), 3000);
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setErrorNote("New password must be at least 6 characters.");
      setTimeout(() => setErrorNote(""), 3000);
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorNote("Passwords do not match.");
      setTimeout(() => setErrorNote(""), 3000);
      return;
    }
    addActivity("Changed password", "Account password updated");
    setNote("Password changed successfully.");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowPasswordFields(false);
    setTimeout(() => setNote(""), 2500);
  };

  const handleCameraClick = () => fileInputRef.current?.click();

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result;
        setProfilePhotoPreview(photoData);
        const updatedUser = { ...user, profilePhoto: photoData };
        updateUser(updatedUser);
        setIsUploading(false);
        addActivity("Updated photo", "Profile picture changed");
        setNote("Profile photo updated!");
        setTimeout(() => setNote(""), 2500);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setErrorNote("Image must be under 5MB.");
      setTimeout(() => setErrorNote(""), 3000);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhotoPreview(null);
    const updatedUser = { ...user, profilePhoto: null };
    updateUser(updatedUser);
    addActivity("Removed photo", "Profile picture removed");
    setNote("Photo removed.");
    setTimeout(() => setNote(""), 2500);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "auth": return <LogIn className="w-3.5 h-3.5" />;
      case "catalog": return <Settings className="w-3.5 h-3.5" />;
      case "order": return <Activity className="w-3.5 h-3.5" />;
      case "profile": return <User className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "auth": return "bg-blue-500/20 text-blue-400";
      case "catalog": return "bg-purple-500/20 text-purple-400";
      case "order": return "bg-amber-500/20 text-amber-400";
      case "profile": return "bg-green-500/20 text-green-400";
      default: return "bg-stone-500/20 text-stone-400";
    }
  };

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "activity", label: "Activity Log", icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl text-white">Admin Profile</h1>
        <p className="text-sm text-stone-400 mt-1">
          Manage your admin account, security settings, and view activity history.
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
              activeSection === section.id
                ? 'bg-primary/20 text-primary'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Notifications */}
      {note && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg p-3 max-w-lg">
          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-400">{note}</p>
        </div>
      )}
      {errorNote && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 max-w-lg">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{errorNote}</p>
        </div>
      )}

      {/* ==================== PROFILE SECTION ==================== */}
      {activeSection === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative group mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg overflow-hidden">
                    {profilePhotoPreview ? (
                      <img src={profilePhotoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-heading font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || "A"}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={handleCameraClick}
                    className="absolute -bottom-1 -right-1 bg-stone-800 p-1.5 rounded-full shadow-md hover:bg-stone-700 transition-all border border-white/10"
                  >
                    {isUploading ? (
                      <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Camera className="w-3.5 h-3.5 text-stone-300" />
                    )}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleProfilePhotoChange} accept="image/*" className="hidden" />
                </div>

                <h2 className="text-lg font-semibold text-white">{user?.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <BadgeCheck className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium capitalize">{role || "Admin"}</span>
                </div>
                <p className="text-sm text-stone-400 mt-1">{user?.email}</p>
                
                {department && (
                  <p className="text-xs text-stone-500 mt-2 bg-white/5 rounded-full px-3 py-1">
                    {department}
                  </p>
                )}

                {profilePhotoPreview && (
                  <button 
                    onClick={handleRemovePhoto}
                    className="text-xs text-red-400 hover:text-red-300 mt-3 transition"
                  >
                    Remove Photo
                  </button>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 w-full mt-5 pt-4 border-t border-white/10">
                  <div className="bg-white/5 rounded-lg p-2.5">
                    <p className="text-lg font-bold text-white">{activityLog.filter(a => a.type === "catalog").length}</p>
                    <p className="text-[10px] text-stone-400">Catalog Actions</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2.5">
                    <p className="text-lg font-bold text-white">{activityLog.filter(a => a.type === "order").length}</p>
                    <p className="text-[10px] text-stone-400">Order Actions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/20">
                  <Edit3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Edit Profile</h3>
                  <p className="text-xs text-stone-400">Update your account information</p>
                </div>
              </div>

              <form onSubmit={save} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-stone-300">Display Name *</Label>
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" 
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-300">Email</Label>
                    <Input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" 
                      placeholder="admin@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-300">Phone</Label>
                    <Input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" 
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-300">Role</Label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full h-10 bg-white/5 border border-white/10 rounded-md text-white px-3 text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="admin" className="bg-stone-800">Admin</option>
                      <option value="super_admin" className="bg-stone-800">Super Admin</option>
                      <option value="manager" className="bg-stone-800">Manager</option>
                      <option value="editor" className="bg-stone-800">Editor</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-300">Department</Label>
                    <Input 
                      value={department} 
                      onChange={(e) => setDepartment(e.target.value)} 
                      className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" 
                      placeholder="e.g., Catalog Management"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-300">Member Since</Label>
                    <Input 
                      value={user?.memberSince || "N/A"} 
                      disabled 
                      className="bg-white/5 border-white/10 text-stone-500 placeholder:text-stone-600 cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-300">Bio</Label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-md text-white px-3 py-2 text-sm focus:outline-none focus:border-primary placeholder:text-stone-600 resize-none"
                    rows="3"
                    placeholder="A short bio about your role..."
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-white/10 text-stone-300 hover:bg-white/5"
                    onClick={() => {
                      setName(user?.name || "");
                      setEmail(user?.email || "");
                      setPhone(user?.phone || "");
                      setRole(user?.role || "admin");
                      setDepartment(user?.department || "");
                      setBio(user?.bio || "");
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SECURITY SECTION ==================== */}
      {activeSection === "security" && (
        <div className="max-w-lg space-y-6">
          {/* Change Password */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
              <div className="p-2.5 rounded-xl bg-primary/20">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-white">Change Password</h3>
                <p className="text-xs text-stone-400">Update your account password</p>
              </div>
            </div>

            {!showPasswordFields ? (
              <Button 
                onClick={() => setShowPasswordFields(true)}
                variant="outline" 
                className="border-white/10 text-stone-300 hover:bg-white/5"
              >
                Change Password
              </Button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-stone-300">Current Password</Label>
                  <Input 
                    type="password" 
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" 
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-stone-300">New Password</Label>
                  <Input 
                    type="password" 
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" 
                    placeholder="Min. 6 characters"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-stone-300">Confirm New Password</Label>
                  <Input 
                    type="password" 
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" 
                    placeholder="Re-enter new password"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Update Password</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-white/10 text-stone-300 hover:bg-white/5"
                    onClick={() => {
                      setShowPasswordFields(false);
                      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/20">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Two-Factor Authentication</h3>
                <p className="text-xs text-stone-400">Add an extra layer of security to your admin account</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-300">Status: <span className="text-red-400">Disabled</span></p>
                <p className="text-xs text-stone-500 mt-1">Protect your account with 2FA</p>
              </div>
              <Button 
                variant="outline" 
                className="border-white/10 text-stone-300 hover:bg-white/5"
                onClick={() => {
                  addActivity("2FA setup", "Two-factor authentication enabled");
                  setNote("2FA enabled successfully.");
                  setTimeout(() => setNote(""), 2500);
                }}
              >
                Enable 2FA
              </Button>
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/20">
                <Smartphone className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Active Sessions</h3>
                <p className="text-xs text-stone-400">Devices currently logged into your account</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-sm text-white">Current Session</p>
                    <p className="text-xs text-stone-500">Windows • Chrome • Mumbai, IN</p>
                  </div>
                </div>
                <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-stone-400" />
                  <div>
                    <p className="text-sm text-stone-300">Mobile Device</p>
                    <p className="text-xs text-stone-500">Android • Chrome • Last active 2h ago</p>
                  </div>
                </div>
                <button className="text-xs text-red-400 hover:text-red-300 transition">Revoke</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ACTIVITY LOG SECTION ==================== */}
      {activeSection === "activity" && (
        <div className="max-w-2xl">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/20">
                <History className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Activity Log</h3>
                <p className="text-xs text-stone-400">Recent actions performed on your admin account</p>
              </div>
            </div>

            {/* Activity Filter Pills */}
            <div className="flex gap-1.5 mb-4 flex-wrap">
              {["All", "auth", "catalog", "order", "profile"].map((filter) => (
                <button
                  key={filter}
                  className={`text-xs px-3 py-1 rounded-full transition ${
                    filter === "All" 
                      ? 'bg-white/10 text-white' 
                      : 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {filter === "All" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              {activityLog.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                  <p className="text-sm text-stone-500">No activity recorded yet</p>
                </div>
              ) : (
                activityLog.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition">
                    <div className={`p-1.5 rounded-lg ${getActivityColor(entry.type)} flex-shrink-0`}>
                      {getActivityIcon(entry.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-white font-medium">{entry.action}</p>
                        <span className="text-[10px] text-stone-500 flex-shrink-0">{formatTimestamp(entry.timestamp)}</span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">{entry.detail}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {activityLog.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <button 
                  onClick={() => {
                    setActivityLog([]);
                    localStorage.removeItem("adminActivityLog");
                    setNote("Activity log cleared.");
                    setTimeout(() => setNote(""), 2500);
                  }}
                  className="text-xs text-red-400 hover:text-red-300 transition"
                >
                  Clear Activity Log
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
