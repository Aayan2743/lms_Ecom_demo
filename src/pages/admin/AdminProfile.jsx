import React, { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { useShop } from "../../ShopContext.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminProfile = () => {
  const { user, updateUser } = useShop();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const save = (e) => {
    e.preventDefault();
    updateUser({
      ...user,
      name: name.trim() || user.name,
      email: (email.trim() || user.email).toLowerCase(),
      role: "admin",
    });
    setNote("Saved.");
    setTimeout(() => setNote(""), 2500);
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-2xl text-stone-900">Admin profile</h1>
        <p className="text-sm text-stone-500 mt-1">
          Stored locally with your login session — swap for a backend when you ship.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-2">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <div className="p-3 rounded-xl bg-primary/10">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-medium text-stone-900">{user?.name}</p>
            <p className="text-sm text-stone-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={save} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Display name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit">Save changes</Button>
          {note && <p className="text-sm text-green-600">{note}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
